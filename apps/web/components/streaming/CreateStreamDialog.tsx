import React from 'react'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, Dialog } from '../ui/dialog'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'

function CreateStreamDialog({ children }: { children: React.ReactNode }) {







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
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="stream-description" className="font-medium">Description</label>
                        <Textarea />
                    </div>

                    {/* Thumbnail */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="stream-thumbnail" className="font-medium">Thumbnail</label>
                        <input
                            type="file"
                            name="thumbnail"
                            id="stream-thumbnail"
                            accept="image/*"
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
                    className="w-full mt-4 bg-brand text-background py-2 px-4 rounded font-semibold hover:bg-brand-foreground hover:text-foreground transition-colors duration-200"
                >
                    Create Stream
                </Button>
           
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreateStreamDialog