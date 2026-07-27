import React, { useEffect, useState } from 'react'
import { ChartSquare, Gear, Logout6, Stars2 } from 'reicon-react'
import { cn } from '@/lib/utils';


interface Props {
    children: React.ReactNode;
    className?:string
}



function Dialog({ children,className }: Props) {
    const [openDialog, setOpenDialog] = useState<boolean>(true)




    return (
        <div className=''>
            <button onClick={()=>setOpenDialog(!openDialog)}>
            {children}
            </button>
            {
                openDialog && (
                <dialog className={cn('bg-accent-foreground text-accent-foreground w-1/3 h-100 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md flex flex-col items-center p-4',className)}>




                </dialog>
                )
            }
        </div>

    )
}


const modalMenu: { name: string, icon: React.ReactNode }[] = [
    {
        name: 'Subscription',
        icon: <Stars2 size={28} weight='Filled' />
    },

    {
        name: 'Creator Dashboard',
        icon: <ChartSquare size={28} weight='Filled' />

    },
    {
        name: 'Settings',
        icon: <Gear size={28} weight="Filled" />

    }
]
export default Dialog