import { v2 as cloudinary } from "cloudinary";


cloudinary.config({

    cloud_name:
        process.env.CLOUDINARY_CLOUD_NAME,

    api_key:
        process.env.CLOUDINARY_API_KEY,

    api_secret:
        process.env.CLOUDINARY_API_SECRET

});



export async function uploadToCloudinary(
    buffer: Buffer
){

    return new Promise<any>(

        (resolve,reject)=>{


            const stream =
            cloudinary.uploader.upload_stream(

             {
    folder:"obaaratech-marketplace",

    transformation:[
        {
            width:1200,
            crop:"limit",
            quality:"auto",
            fetch_format:"auto"
        }
    ]
}


                (error,result)=>{


                    if(error){

                        reject(error);

                        return;

                    }


                    resolve(result);

                }

            );


            stream.end(buffer);


        }

    );

}



export default cloudinary;