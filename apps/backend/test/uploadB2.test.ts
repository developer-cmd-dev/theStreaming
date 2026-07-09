import {expect, test} from 'bun:test'
import { uploadFile, uploadFolder } from '../src/lib/upload_hls_b2'
import fs from 'fs'
import path from 'path'


test('uploadfile',async()=>{
    const localDir = `/home/devslinux/Documents/Workdir/FullStackProjects/theStreaming/apps/recordings/94e194e4-6da0-4ee8-a289-45ba98d697ca_video/hls_video`

    const filename = 'output.m3u8'

    const localPath = path.join(localDir,filename)
    const result = await uploadFile(localPath,`remotePrefix/${filename}`,filename);
    console.log(result)
    expect(result?.$metadata.httpStatusCode).toBe(200)
})



test('uploadFolder',async()=>{
    const localDir = `/home/devslinux/Documents/Workdir/FullStackProjects/theStreaming/apps/recordings/94e194e4-6da0-4ee8-a289-45ba98d697ca_video/hls_video`


    const result = await uploadFolder(localDir,`94e194e4-6da0-4ee8-a289-45ba98d697`);
    expect(result).toBe("output.m3u8");
},30000)