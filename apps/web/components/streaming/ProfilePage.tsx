'use client'
import React, { useState } from 'react'
import LiveChat from './LiveChat';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUserAuth } from '@/lib/zustandStore';
import Link from 'next/link';
import { Separator } from '../ui/separator';
import { useParams } from 'next/navigation';
interface Props {
    children: React.ReactNode
}
function ProfilePage({ children }: Props) {
    const { userPayload } = useUserAuth((state) => state)
    const [active, setActive] = useState(0)
    const params = useParams();
   
    return (
        <div className="w-full h-full flex">

            {/* profile menu section */}
            <div className='w-full'>
                <div className='border relative hidden md:block'>
                    <Image
                        src={`/images/gaming_glitch_banner2.avif`}
                        alt="Gaming streaming banner"
                        width={2048}
                        height={768}
                        priority
                        sizes="100vw"
                        className="h-auto w-full"
                    />

                    <div className='rounded-sm *:rounded-sm absolute text-2xl font-bold top-1/2 left-60 -translate-x-1/2 -translate-y-1/2  h-fit w-fit bg-background p-5 flex items-center gap-3 '>
                        <span className='py-2 px-3 bg-foreground text-background'>OFFLINE</span>
                        <span>{userPayload?.username} is offline</span>
                    </div>

                </div>

                <div className='px-4'>
                    <div className='p-4  flex items-center gap-4'>
                        <div>
                            <Avatar className={`size-24`}>
                                <AvatarImage src={userPayload?.avatar ?? ''} />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </div>

                        <div>
                            <h1 className='text-xl text-text-primary font-semibold flex items-center gap-9'>{userPayload?.username}<span className='text-sm px-3 py-2 md:hidden bg-white text-text-muted rounded-md'>OFFLINE</span></h1>
                            <p className='text-sm text-text-secondary'>0 followers</p>
                            <p className='text-sm text-text-primary font-semibold'>Last lived 2 hours ago</p>
                        </div>


                    </div>

                    <div className='flex flex-col gap-3 justify-between  h-12 ' >

                        <div className='text-lg text-text-primary flex gap-4  '>
                            {profileMenuItems.map((value, index) => (
                                <Link key={index} href={`/profile/${params.slug}/${value.href}`} onClick={() => setActive(index)} style={{
                                    color: active === index ? "#53FC18" : "white",
                                }} className=' hover:text-brand hover:border-b-2 border-brand '>
                                    {value.label}
                                </Link>
                            ))}


                        </div>

                        <Separator />

                    </div>

                    <div>
                        {children}
                    </div>
                </div>

            </div>


            <div>
                <LiveChat className='border-none rounded-none bg-background  hidden lg:flex lg:w-64 xl:w-100' />

            </div>




        </div>
    )
}

const profileMenuItems = [
    {
        label: "Home",
        href: "",
    },
    {
        label: "About",
        href: "about",
    },
    {
        label: "Videos",
        href: "videos",
    },
    {
        label: "Clips",
        href: "clips",
    },
    {
        label: "Schedule",
        href: "schedule",
    }
];


export default ProfilePage