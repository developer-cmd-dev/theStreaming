import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from './ui/dropdown-menu'
import { HttpResponse, PublicUser } from '@repo/zod/schema'
import { axiosHandler } from '@repo/axios'
import { HTTP_BACKEND_URL } from '@/utils/env'
import { toast } from './ui/toast'
import { CustomError } from '@repo/customError'
import { useUserAuth } from '@/lib/zustandStore'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import Link from 'next/link';
function UserMenuDropDown({ children, authUserPayload }: { children: React.ReactElement, authUserPayload: PublicUser }) {

  const { logout, userPayload } = useUserAuth((state) => state)

  async function handleLogout() {

    try {

      const response = await axiosHandler<HttpResponse>({
        url: HTTP_BACKEND_URL + '/logout',
        method: "POST",
        data: {
          id: authUserPayload.id
        },
        withCredentials: true
      })

      logout();

    } catch (error) {
      if (error instanceof CustomError) {
        toast.add({
          type: 'error',
          description: error.message
        })
      }

      return
    }
  }



  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={children} />
      <DropdownMenuContent className="w-80 h-fit text-[15px] " align="start">
        <DropdownMenuGroup >
          <DropdownMenuLabel className='flex flex-col items-center  rounded-md justify-center h-36 p-3 text-md text-white gap-5'>
            <div className="flex items-center justify-center gap-4">
              <Avatar size="xl">
                <AvatarImage src={userPayload?.avatar ?? ''} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>{userPayload?.username}

            </div>
            <Link className="border px-3 py-1 rounded-md bg-foreground text-secondary" href={`/profile/${userPayload?.username}`}>View your channel</Link>
            {/* <Button>View your channel</Button> */}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Creator Dashboard
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {/* <DropdownMenuSeparator /> */}
        {/* <DropdownMenuGroup>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuItem>Message</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>More...</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            New Team
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup> */}
        <DropdownMenuSeparator />
        {/* <DropdownMenuGroup>
          <DropdownMenuItem>GitHub</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuItem disabled>API</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator /> */}
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleLogout}>
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>

    </DropdownMenu>
  )
}

export default UserMenuDropDown