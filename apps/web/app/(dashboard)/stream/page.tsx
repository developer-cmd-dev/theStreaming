'use client'
import CreateStreamDialog from '@/components/streaming/CreateStreamDialog'
import LiveChat from '@/components/streaming/LiveChat'
import StreamStatus from '@/components/streaming/StreamStatus'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { useStreamState, useUserAuth } from '@/lib/zustandStore'
import { HTTP_BACKEND_URL } from '@/utils/env'
import { axiosHandler } from '@repo/axios'
import { CreatedStreamState, HttpResponse } from '@repo/zod/schema'
import { IconAlertSquareRounded, IconChevronRight, IconEdit, IconHandThreeFingers, IconInfoCircle, IconVideo } from '@tabler/icons-react'
import Image from 'next/image'
import { useEffect } from 'react'


const sessionInfoItems = ['Session', 'Viewers', 'Followers', 'Sub Counts', 'Time Live']

function page() {

  const { currentStreamState,setCurrentStreamState } = useStreamState((state) => state);
  const {userPayload}=useUserAuth((state)=>state)


  useEffect(() => {

    (async()=>{

      if(userPayload && !currentStreamState){
        try {
          
          const response = await axiosHandler<HttpResponse<CreatedStreamState[]>>({
            method:"GET",
            url:`${HTTP_BACKEND_URL}/stream`,
            withCredentials:true
          })

          setCurrentStreamState(response.data[0]);


        } catch (error) {
          console.log(error)
        }



        
      }
    })()
    

  }, [userPayload])



  return (
    <>
      <div className='w-full min-[769px]:hidden  text-4xl font-bold flex items-center justify-center '><h1>Use Tablet or Bigger Screen</h1></div>



      <div className="bg-black w-full  p-2 hidden min-[769px]:flex  flex-1 gap-2  ">
        {/* left */}

        <div className='w-1/2 flex flex-col gap-2 h-full'>

          {/* stream info */}

          <div className='w-full h-48 bg-brand-foreground py-2  flex flex-col gap-3 rounded-sm'>

            <Heading icon={<IconAlertSquareRounded />} title='Session Info' />

            <div className="grid grid-cols-5 h-22 border border-x-0">
              {sessionInfoItems.map((value, index) => (<div key={index} className='border-r p-2 flex flex-col justify-around  '>
                {index === 0 ? (<span className='bg-foreground w-fit text-sm px-1 rounded text-background'>OFFLINE</span>) : (<span>-</span>)}
                <p className='text-text-secondary'>{value}</p>
              </div>))}
            </div>

          </div>

          {/* stream preview */}

          <div className='w-full flex-1  rounded-sm bg-brand-foreground py-2  overflow-hidden flex flex-col gap-3'>
            <Heading icon={<IconVideo />} title='Stream Preview' className='h-12' />

            <div className='relative'>
              <Image src={!currentStreamState ? "/images/offline_banner.avif" : currentStreamState.thumbnail ?? ""}
                alt="Gaming streaming banner"
                loading='eager'
                width={2048}
                height={200}
                className="w-full h-auto"
              />
              <StreamStatus className='left-1/2' data={'Stream'} />

            </div>


          </div>
        </div>

        <div className='flex gap-2  w-1/2 h-full'>
          <div className=' w-2/3 h-full flex flex-col'>
            <LiveChat className='border-none  bg-brand-foreground rounded-sm ' />
          </div>

          <div className=' w-1/2 h-full flex flex-col gap-2 '>
            <div className='h-1/3 w-full bg-brand-foreground rounded-sm flex flex-col flex-1 '>
              <div className='h-fit'>
                <Heading title='Stream Info' icon={<IconInfoCircle />} className='h-11' />
                <Separator />
              </div>

              {
                !currentStreamState ? (
                  <div className='h-full flex items-center justify-center '>
                    <CreateStreamDialog>
                      <span className='bg-brand px-3 py-2 text-background rounded-md text-sm font-semibold hover:bg-foreground cursor-pointer transition ease-in-out delay-100 '>Create Stream</span>
                    </CreateStreamDialog>
                  </div>
                ) : (
                 
              <div className='w-full h-full flex flex-col  items-center p-2 justify-center'>
                <div className=' h-full w-full p-2 flex flex-col gap-1 '>
                  <div className='flex  items-center justify-between w-full  '>
                    <h1 className='text-primary font-semibold'>
                     {currentStreamState.title}
                    </h1>
                    <Button className={`h-6`}>
                      <IconEdit />
                    </Button>
                  </div>
                </div>

                <div className=''>
                  <p className='text-text-muted'>
                   {currentStreamState.description}
                  </p>

                </div>
              </div>
                )
              }



            </div>

            <div className='w-full h-2/3 bg-brand-foreground rounded-sm '>
              <Heading title='Channel Actions' icon={<IconHandThreeFingers />} className='h-12' />
              <Separator />

              <div className='h-full w-full px-3'>
                {
                  channelActionSections.map((value, index) => (

                    < div key={index}>
                      <div className='w-full flex flex-col gap-3 py-3'>
                        <h1 className='text-xl'>{value.title}</h1>
                        {value.items.map((items, id) => (
                          <div key={id} className='flex items-center w-full justify-between'>
                            <p className='text-text-secondary text-sm'>{items.label}</p>
                            {items.type === 'navigation' ? (<span className=' text-sm flex items-center justify-center text-text-secondary'>{items.value} <IconChevronRight /></span>) : (<Switch />)}
                          </div>
                        ))}
                      </div>
                      <Separator />
                    </div>


                  ))
                }
              </div>

            </div>

          </div>

          <div className='h-full'>

          </div>
        </div>
      </div>
    </>
  )







}



function Heading({ title, icon, className }: { title: string, icon: React.ReactNode, className?: string }) {
  return (
    <div className={cn('h-10 px-6 flex gap-4 items-center ', className)}>
      {icon}
      <h1 className='text-md xl:text-xl font-semibold'>{title}</h1>
    </div>
  )
}
export default page


const channelActionSections = [
  {
    title: "Chat access",
    items: [
      {
        label: "Account age",
        type: "navigation",
        value: "Off",
      },
      {
        label: "Followers only",
        type: "navigation",
        value: "Off",
      },
      {
        label: "Subscribers only",
        type: "switch",
        value: false,
      },
    ],
  },

  {
    title: "Chat options",
    items: [
      {
        label: "Emotes only",
        type: "switch",
        value: false,
      },
      {
        label: "Slow mode",
        type: "navigation",
        value: "Off",
      },
      {
        label: "Banned words",
        type: "navigation",
      },
      {
        label: "AI Chat Moderation",
        type: "external",
      },
    ],
  },

  {
    title: "Channel options",
    items: [
      {
        label: "Show view count",
        type: "switch",
        value: true,
      },
      {
        label: "Raid Channel",
        type: "navigation",
        disabled: true,
      },
      {
        label: "Set goals",
        type: "navigation",
      },
    ],
  },
];