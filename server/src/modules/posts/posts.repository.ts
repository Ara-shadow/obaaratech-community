import prisma from "../../database/prisma";


export function createPost(
    userId:string,
    data:any
){

    return prisma.post.create({

        data:{
            content:data.content,
            image:data.image,
            authorId:userId
        },

        include:{
            author:{
                select:{
                    id:true,
                    name:true,
                    avatar:true
                }
            }
        }

    });

}



export function getPosts(){

    return prisma.post.findMany({

        orderBy:{
            createdAt:"desc"
        },

        include:{

            author:{
                select:{
                    id:true,
                    name:true,
                    avatar:true
                }
            },

            _count:{
                select:{
                    comments:true,
                    likes:true
                }
            }

        }

    });

}



export function getPostById(id:string){

    return prisma.post.findUnique({

        where:{
            id
        },

        include:{
            author:{
                select:{
                    id:true,
                    name:true,
                    avatar:true
                }
            },
            comments:true,
            likes:true
        }

    });

}



export function deletePost(id:string){

    return prisma.post.delete({

        where:{
            id
        }

    });

}