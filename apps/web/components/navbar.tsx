import React, { useState } from 'react'
import { Input } from './ui/input'
import { Bell, Mail } from 'lucide-react'
import { Button } from './ui/button'

function Navbar() {

    const [openModal, setOpenModal] = useState<boolean>(false)
    return (
        <div className='w-full flex justify-between h-20 text-white'>

            {/* logo */}
            <div className='w-30 sm:w-50 lg:w-80  flex items-center justify-center font-logo text-shadow-lg text-shadow-red-700 text-lg md:xl lg:text-2xl font-bold text-white'>
                <h1 className=''>BoTLY</h1>
            </div>


            {/* search */}
            <div className='hidden  lg:w-full lg:flex lg:items-center lg:pl-4 text-white/60 lg:gap-5 '>

                <span className='shadow-3xl  rounded-full bg-white/5 text- '>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left-icon lucide-chevron-left"><path d="m15 18-6-6 6-6" /></svg>
                </span>

                <div className='h-10 bg-white/10 shadow-2xl border border-white/20 backdrop-blur-md  rounded-full w-90 flex gap-2 items-center px-3'>
                    <span className=' flex items-center justify-center w-fit'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search-icon lucide-search"><path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" /></svg>
                    </span>

                    <span className=' w-full h-full'>
                        <Input className='w-full h-full focus-visible:ring-0 focus-visible:ring-offset-0 placeholder-white/90 text-white/90 focus:outline-none border-none' placeholder='Search...' name='search' id='search' />
                    </span>
                </div>
            </div>

            {/* avatar */}
            <div className=' w-fit lg:w-150 flex items-center justify-self-center gap-8 text-sm text-white/60 mr-4 lg:mr-0'>

                <div className='lg:flex gap-6 hidden '>
                    <span>
                        <Bell size={21} strokeWidth={2} />
                    </span>
                    <span>
                        <Mail size={21} strokeWidth={2} />
                    </span>
                </div>

                <div onClick={() => setOpenModal(!openModal)} className=' relative w-full h-full flex items-center gap-5 hover:bg-white/10 cursor-pointer p-2 '>
                    <span
                        className=' h-10 w-10 md:h-13 md:w-13 lg:h-15 lg:w-15 rounded-full bg-cover bg-center '
                        style={{
                            backgroundImage: "url('/androgynous-avatar-non-binary-queer-person.jpg')"
                        }}
                    ></span>

                    <span className='hidden w-fit text-lg h-15 lg:flex gap-2 flex-col items-start '>
                        <h1 className='text-white/70'>Dev Mandal</h1>
                        <p className='text-sm text-white/40'>devkmandal0@gmail.com</p>
                    </span>

                 
                </div>
                {
                        openModal && (
                            <div className='bg-accent-foreground text-accent-foreground w-72 h-90 absolute top-22 right-2 rounded-md flex flex-col items-center p-4 '>
                               <div className='w-full flex justify-center pb-4  border-b border-white/10  h-fit'>
                               <Button className='bg-white/20 hover:bg-accent hover:text-black' type='button' >
                                    View your channel
                                </Button>
                               </div>
                            </div>
                        )
                    }



            </div>
        </div>
    )
}

export default Navbar