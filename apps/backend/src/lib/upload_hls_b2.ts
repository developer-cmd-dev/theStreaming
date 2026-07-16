
import fs, { } from 'fs'
import { b2Client, BUCKET_NAME } from '../config/b2_client';
import { PutObjectCommand, type PutObjectCommandOutput } from '@aws-sdk/client-s3';
import path from 'path';

export function getContentType(filename: string): string {
    if (filename.endsWith(".m3u8")) return "application/vnd.apple.mpegurl";
    if (filename.endsWith(".ts")) return "video/MP2T";
    return "application/octet-stream";
}



export async function uploadFile(localPath: string, remoteKey: string,filename:string): Promise<PutObjectCommandOutput> {
    try {
        const fileBuffer = fs.readFileSync(localPath);
        const result = await b2Client.send(
            new PutObjectCommand({
                Bucket: BUCKET_NAME || process.env.B2_BUCKET_NAME,
                Key: remoteKey,
                Body: fileBuffer,
                ContentType: getContentType(localPath),
                ContentLength: fileBuffer.length,
                Metadata:{
                    "filename":filename
                }

            })
        );

        console.log(`Uploaded: ${remoteKey}`);
        return result
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export async function uploadFolder(localDir: string, remotePrefix: string): Promise<string|false> {

    try {
        const files = fs.readdirSync(localDir);

        const promise: PutObjectCommandOutput[] = []

        let isM3U8FileUploaded=false;

        for (const file of files) {
            const localPath = path.join(localDir, file);
            const result = await uploadFile(localPath, `${remotePrefix}/${file}`,file);
            if(file==='output.m3u8' && result.$metadata.httpStatusCode===200) isM3U8FileUploaded=true;
            promise.push(result)

        }

         await Promise.all(promise)

        const extractFolderPath = localDir.replace("/hls_video","");
        fs.rmdirSync(extractFolderPath,{recursive:true})
        if(isM3U8FileUploaded){
            return `${remotePrefix}/output.m3u8`
        }else{
            return false
        }
    } catch (error) {
        console.log(error);
        throw error;
    }


}