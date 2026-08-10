import { FastifyInstance } from 'fastify'
import bcrypt from 'bcrypt'
import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

export default async function authRoutes(app: FastifyInstance) {
  app.post('/register', async (request, reply) => {
    const { name, email, password, role } = request.body as {
      name: string
      email: string
      password: string
      role?: string
    }

    if (!name || !email || !password) {
      return reply.status(400).send({ error: 'Name, email, and password are required' })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return reply.status(409).send({ error: 'An account with this email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const userRole = role === 'seller' ? 'seller' : 'buyer'

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: userRole },
    })

    const token = app.jwt.sign({ id: user.id, role: user.role })

    return reply.status(201).send({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    })
  })

  app.post('/login', async (request, reply) => {
    const { email, password } = request.body as { email: string; password: string }

    if (!email || !password) {
      return reply.status(400).send({ error: 'Email and password are required' })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return reply.status(401).send({ error: 'Invalid email or password' })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return reply.status(401).send({ error: 'Invalid email or password' })
    }

    const token = app.jwt.sign({ id: user.id, role: user.role })

    return reply.send({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    })
  })

  app.get('/me', { onRequest: [app.authenticate] }, async (request) => {
    return { user: request.user }
  })
}