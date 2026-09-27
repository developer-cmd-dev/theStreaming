import ProfilePage from '@/components/streaming/ProfilePage'
import React from 'react'

function layout({children}:{children:React.ReactNode}) {
  return (
    <ProfilePage>
        {children}
    </ProfilePage>
  )
}

export default layout