'use client'
import React, { useState } from 'react'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, Dialog } from '../ui/dialog'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { CreatedStreamState, CreateStreamInput, createStreamSchema, HttpResponse } from '@repo/zod/schema'
import { toast } from '../ui/toast'
import { axiosHandler, AxiosPayload } from '@repo/axios'
import { HTTP_BACKEND_URL } from '@/utils/env'
import { useStreamState } from '@/lib/zustandStore'
import { Spinner } from '../ui/spinner'

function CreateStreamDialog({ children }: { children: React.ReactNode }) {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const { setCurrentStreamState } = useStreamState((state) => state);
    const [loading, setLoading] = useState(false);


    const handleSubmit = async () => {
        setLoading(true)

        const { data, error } = createStreamSchema.safeParse({ title, description, thumbnail });
        if (error) {
            console.log(error)
            toast.add({
                type: 'error',
                description: "Invalid Input"
            })
            return
        }
        const formData = new FormData();


        formData.append('title', data.title);
        if (data.description !== undefined && data.description !== null) {
            formData.append('description', data.description);
        }
        if (thumbnail) {
            formData.append('thumbnail', thumbnail);
        }





        try {

            const payload: AxiosPayload = {
                url: `${HTTP_BACKEND_URL}/stream`,
                method: "POST",
                data: formData,
                withCredentials: true
            }



            const response = await axiosHandler<HttpResponse<CreatedStreamState>>(payload);
            setCurrentStreamState(response.data);
        } catch (error) {
            console.log(error);

        } finally {
            setLoading(false)
        }




    }




    return (
        <Dialog>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create your stream.</DialogTitle>
                </DialogHeader>
                <div className="w-full flex flex-col gap-4">
                    {/* Title */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="stream-title" className="font-medium">Title</label>
                        <Input
                            type="text"
                            name="title"
                            id="stream-title"
                            placeholder="Enter Title"
                            className="w-full"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="stream-description" className="font-medium">Description</label>
                        <Textarea onChange={(e) => setDescription(e.target.value)} />
                    </div>

                    {/* Thumbnail */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="stream-thumbnail" className="font-medium">Thumbnail</label>
                        <input
                            type="file"
                            name="thumbnail"
                            id="stream-thumbnail"
                            accept="image/*"
                            onChange={(e) => {
                                const files = e.target.files
                                if (files) {
                                    setThumbnail(files[0]);
                                }
                            }}
                            className="block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded file:border-0
                       file:text-sm file:font-semibold
                       file:bg-foreground file:text-background
                       hover:file:bg-brand-foreground hover:file:text-foreground transition file:transition-colors file:duration-200 file:ease-in-out "
                        />
                    </div>

                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        className="w-full mt-4 bg-brand text-background py-2 px-4 rounded font-semibold hover:bg-brand-foreground hover:text-foreground transition-colors duration-200"
                    >
                        {loading ? <Spinner/> : "Create Stream"}
                    </Button>

                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreateStreamDialog