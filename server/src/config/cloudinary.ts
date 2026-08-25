import { v2 as cloudinary } from "cloudinary";


cloudinary.config({

    cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME,


    api_key:
    process.env.CLOUDINARY_API_KEY,


    api_secret:
    process.env.CLOUDINARY_API_SECRET

});



export default cloudinary;



export function uploadToCloudinary(
    buffer:Buffer
){

    return new Promise<any>((resolve,reject)=>{


        const stream =
        cloudinary.uploader.upload_stream(

        {
            folder:"obaaratech-marketplace"
        },


        (error,result)=>{

            if(error){

                reject(error);

                return;

            }


            resolve(result);

        });


        stream.end(buffer);


    });

}






export function deleteFromCloudinary(
    publicId:string
){

    return new Promise<any>((resolve,reject)=>{


        cloudinary.uploader.destroy(

            publicId,

            (error,result)=>{


                if(error){

                    reject(error);

                    return;

                }


                resolve(result);


            }

        );


    });

}
