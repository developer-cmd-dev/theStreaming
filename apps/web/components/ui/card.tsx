"use client"
import { IconMessage } from '@tabler/icons-react'
import Image from 'next/image'
import React, { useState } from 'react'

import { AnimatePresence, motion } from 'motion/react'
function Card() {

  const [open, setOpen] = useState<boolean>(true)



  return (
    <>
  <AnimatePresence>

  {
        open && (
        <motion.div

        initial={{
          opacity:0,
          scale:0.98,
          filter:'blur(10px)'

        }}

        animate={
          {
            opacity: 1,
            scale: 1, // The 'scale' property here controls the scaling (size transformation) of the element during animation. A value of 1 means the element is at its normal size, while values less than 1 shrink it and values greater than 1 enlarge it.
            filter: 'blur(0px)'
       
          }
        }


        exit={{
          opacity:0,
          scale:0.98,
          filter:'blur(10px)'
        }}

        transition={{
          duration:0.3,
          ease:'easeOut'
        }}
        className='max-w-md h-4/6 shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-lg p-8 flex flex-col'>


          <h2 className='text-[21px] font-bold '>Acternity UI Components</h2>
          <p className='text-[14px] text-neutral-500 mt-3'>
            A modern collection of customizable user interface components for building stunning web applications quickly and efficiently.
          </p>

          <div className="flex item-center justify-center">
            <button onClick={() => setOpen(!open)} className='text-black flex items-center justify-center gap-2 text-[18px] mt-4 shadow-[0_3px_10px_rgb(0,0,0,0.2)] p-1 px-3 rounded-lg'>
              <svg xmlns="http://www.w3.org/2000/svg" width={25} height={25} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-scan-letter-a">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M9 16v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
                <path d="M9 13h6" />
                <path d="M3 7v-2a2 2 0 0 1 2 -2h2" />
                <path d="M3 17v2a2 2 0 0 0 2 2h2" />
                <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                <path d="M17 21h2a2 2 0 0 0 2 -2v-2" />
              </svg>
              Acternity
            </button>
          </div>

          <div className='relative bg-gray-100 flex-1 mt-6 rounded-lg border border-dashed border-neutral-200'>


            <motion.div
              className='absolute inset-0 h-full w-full bg-white rounded-lg divide-y border-neutral-200 divide-neutral-200 border  '
              initial={{
                opacity: 0,
                scale: 0.98,
                filter: 'blur(10px)'
              }}

              whileHover={{
                opacity: 1,
                scale: 1.05,
                filter: 'blur(0px)'
              }}
              transition={{
                duration: 0.3,
                ease: 'easeInOut'
              }}
            >


              <div className='flex gap-5 p-6'>

                <div className='h-10 w-10 flex shrink-0 bg-linear-to-br bg-white rounded-md  items-center justify-center shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]'>
                  <IconMessage className='h-6 w-6 text-neutral-400' />
                </div>

                <div className='flex flex-col '>
                  <p className='font-bold text-neutral-600 text-[13px]'>Acternity UI Component</p>
                  <p className='font-bold text-neutral-400 text-[11px] mt-1'>A Collection of UI components</p>
                </div>

              </div>

              <div className='flex gap-5 p-6'>

                <div className='h-10 w-10 flex shrink-0 bg-linear-to-br bg-white rounded-md  items-center justify-center shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]'>
                  <IconMessage className='h-6 w-6 text-neutral-400' />
                </div>

                <div className='flex flex-col '>
                  <p className='font-bold text-neutral-600 text-[13px]'>Acternity UI Component</p>
                  <p className='font-bold text-neutral-400 text-[11px] mt-1'>A Collection of UI components</p>
                </div>

              </div>

              <div className='flex gap-5 p-6'>

                <div className='h-10 w-10 flex shrink-0 bg-linear-to-br bg-white rounded-md  items-center justify-center shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]'>
                  <IconMessage className='h-6 w-6 text-neutral-400' />
                </div>

                <div className='flex flex-col '>
                  <p className='font-bold text-neutral-600 text-[13px]'>Acternity UI Component</p>
                  <p className='font-bold text-neutral-400 text-[11px] mt-1'>A Collection of UI components</p>
                </div>

              </div>

              <div className='flex gap-5 p-6'>

                <div className='h-10 w-10 flex shrink-0 bg-linear-to-br bg-white rounded-md  items-center justify-center shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]'>
                  <IconMessage className='h-6 w-6 text-neutral-400' />
                </div>

                <div className='flex flex-col '>
                  <p className='font-bold text-neutral-600 text-[13px]'>Acternity UI Component</p>
                  <p className='font-bold text-neutral-400 text-[11px] mt-1'>A Collection of UI components</p>
                </div>

              </div>



            </motion.div>




          </div>



        </motion.div>)
      }
  </AnimatePresence>

    </>



  )
}

export default Card