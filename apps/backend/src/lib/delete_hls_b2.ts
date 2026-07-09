import { DeleteObjectCommand, DeleteObjectsCommand, ListObjectsCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { b2Client, BUCKET_NAME } from "../config/b2_client";

export async function deleteStreamDataB2(streamId: string): Promise<boolean> {
    let continuationToken: string | undefined;
    const prefix = `${streamId}`
    try {

        do {

            const listResponse = await b2Client.send(
                new ListObjectsV2Command({
                    Bucket: BUCKET_NAME,
                    Prefix: prefix,
                    ContinuationToken: continuationToken,
                })
            )


            if(!listResponse.Contents) throw new Error("Data not available")


            const objects = listResponse.Contents.map(data => ({ Key: data.Key! })) ?? []


            console.log(objects)
            if (objects.length > 0) {
                await b2Client.send(
                    new DeleteObjectsCommand({
                        Bucket: BUCKET_NAME,
                        Delete: {
                            Objects: objects,
                            Quiet: true,
                        }
                    })
                )
            }

            continuationToken = listResponse.NextContinuationToken


        } while (continuationToken)

        return true

    } catch (error) {
        console.log(error)
        throw error
    }







}