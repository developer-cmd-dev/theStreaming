import cloudinary from 'cloudinary'
import 'dotenv/config'
const apiKey = process.env.CLOUDINARY_API_KEY as string;
const apiSecret = process.env.CLOUDINARY_API_SECRET as string;
const cloudName = process.env.CLOUDINARY_CLOUD_NAME as string;


cloudinary.v2.config({
    cloud_name:cloudName,
    api_key:apiKey,
    api_secret:apiSecret
})

export default cloudinary;