import React from 'react'

function layout({children}:{children:React.ReactNode}) {
  return (
    <div className='flex flex-col flex-1 '>{children}</div>
  )
}

export default layout