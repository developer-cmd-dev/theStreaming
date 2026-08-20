import { cn } from '@/lib/utils'
import React, { useState } from 'react'

function Dialog({ children }: { children?: React.ReactNode }) {

  const [openDialog, setOpenDialog] = useState(false)

  return (

    <div
      className={cn(
        'fixed left-0 top-0 w-full h-screen z-100 ',
        'bg-white/5 bg-opacity-80 backdrop-blur-lg',
        'flex items-center justify-center border'

      )}
    >


      <div>



      </div>


    </div>
  )
}

export default Dialog