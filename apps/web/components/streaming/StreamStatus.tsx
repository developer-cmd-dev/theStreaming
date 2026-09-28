import { cn } from '@/lib/utils'
import React from 'react'

interface Props{
    className?:string,
    data:string
}
function StreamStatus({data,className}:Props) {
    return (
        <div className={cn('rounded-sm *:rounded-sm absolute text-2xl font-bold top-1/2 left-60 -translate-x-1/2 -translate-y-1/2  h-fit w-fit bg-background p-5 flex items-center gap-3 ',className)}>
            <span className='py-2 px-3 bg-foreground text-background'>OFFLINE</span>
            <span>{data} is offline</span>
        </div>)
}

export default StreamStatus