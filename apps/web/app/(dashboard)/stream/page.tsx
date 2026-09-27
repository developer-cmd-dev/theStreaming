import LiveChat from '@/components/streaming/LiveChat'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { IconAlertSquareRounded, IconHandThreeFingers, IconInfoCircle, IconVideo } from '@tabler/icons-react'
import Image from 'next/image'
import React from 'react'


const sessionInfoItems = ['Session', 'Viewers', 'Followers', 'Sub Counts', 'Time Live']

function page() {
  return (
    <div className="bg-black w-full h-[95vh] p-2 flex flex-1 gap-2">
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

        <div className='w-full flex-1 rounded-sm bg-brand-foreground py-2  overflow-hidden flex flex-col gap-3'>
          <Heading icon={<IconVideo />} title='Stream Preview' className='h-12' />

          <Image src={`/images/offline_banner.avif`}
            alt="Gaming streaming banner"
            width={2048}
            height={200}
            className="w-full h-auto"
          />
        </div>
      </div>

      <div className='flex gap-2  w-1/2 h-full'>
        <div className=' w-2/3 h-full flex flex-col'>
          <LiveChat className='border-none  bg-brand-foreground rounded-sm '/>
        </div>

        <div className=' w-1/2 h-full flex flex-col gap-2 '>
            <div className='h-1/3 w-full bg-brand-foreground rounded-sm'>
            <Heading title='Stream Info' icon={<IconInfoCircle/>} className='h-11'/>
            <Separator/>

            </div>

            <div className='w-full h-2/3 bg-brand-foreground rounded-sm '>
            <Heading title='Channel Actions' icon={<IconHandThreeFingers/>} className='h-12'/>
            <Separator/>

            </div>

        </div>

        <div className='h-full'>

        </div>
      </div>
    </div>
  )
}



function Heading({ title, icon,className }: { title: string, icon: React.ReactNode,className?:string }) {
  return (
    <div className={cn('h-10 px-6 flex gap-4 items-center ',className)}>
      {icon}
      <h1 className='text-xl font-semibold'>{title}</h1>
    </div>
  )
}
export default page