import "dotenv/config";

const { default: cloudinary } =
await import("./src/config/cloudinary.js");


import fs from "node:fs";


const file =
fs.readFileSync(
"C:/Users/oba ara/Desktop/men1.jpg"
);


console.log("Uploading...");


const result =
await new Promise((resolve,reject)=>{


const upload =
cloudinary.uploader.upload_stream(

{
folder:"test-upload",

timeout:120000

},


(error,result)=>{


if(error){

reject(error);

return;

}


resolve(result);


}

);


upload.end(file);


});


console.log("SUCCESS");
console.log(result);