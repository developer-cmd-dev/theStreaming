import cloudinary from 'cloudinary'
import path from 'path'
import fs from 'fs'
export async function cloudinaryUpload(fileData:Express.Multer.File):Promise<cloudinary.UploadApiResponse> {
    
try {

    const result = await cloudinary.v2.uploader.upload(fileData.path, {
        folder: "thumbnails",
        resource_type: "image",
      });
    fs.unlink(fileData.path,(err)=>console.log(err))
      return result;
      
} catch (error) {
    fs.unlink(fileData.path,(err)=>console.log(err))
    throw error;
}



}