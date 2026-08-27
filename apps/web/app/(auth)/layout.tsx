"use client"
import React from 'react'

function layout({ children }: { children: React.ReactNode }) {
    return (
  

        <div className="flex min-h-screen">
            <div className="flex flex-col justify-center items-center w-full  bg-background px-6 py-8">
                {children}
            </div>
        </div>
    )
}

export default layout