import type {
 FastifyReply,
 FastifyRequest,
} from "fastify";

import path from "node:path";
import fs from "node:fs/promises";

import { prisma } from "../../database/prisma.js";


export async function uploadImageController(
 request: FastifyRequest,
 reply: FastifyReply
){

 const { listingId } = request.params as {
   listingId:string;
 };


 const file = await request.file();


 if(!file){

   return reply.code(400).send({
     success:false,
     message:"No image uploaded",
   });

 }


 const uploadDir = path.join(
   process.cwd(),
   "uploads"
 );


 await fs.mkdir(
   uploadDir,
   {
     recursive:true,
   }
 );


 const filename =
 `${Date.now()}-${file.filename}`;


 const filePath =
 path.join(
   uploadDir,
   filename
 );


 const buffer =
 await file.toBuffer();


 await fs.writeFile(
   filePath,
   buffer
 );


 const image =
 await prisma.listingImage.create({

   data:{
     url:`/uploads/${filename}`,
     listingId,
   },

 });


 return reply.send({

   success:true,

   message:"Image uploaded successfully",

   image,

 });

}