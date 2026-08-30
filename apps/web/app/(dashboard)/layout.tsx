"use client"
import Dialog from '@/components/Dialog'
import MobileNavigation from '@/components/streaming/MobileNavigation'
import Navbar from '@/components/streaming/Navbar'
import Sidebar from '@/components/streaming/Sidebar'
import { userUserAuth } from '@/lib/zustandStore'
import { axiosHandler, AxiosPayload } from '@repo/axios'
import { CustomError } from '@repo/customError'
import { HttpResponse, PublicUser } from '@repo/zod/schema'
import React, { useEffect, useState } from 'react'

function DashLayout({ children }: { children: React.ReactNode }) {



    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [loading, setLoading] = useState(true);
    const { userPayload, setUserPaylod } = userUserAuth(state => state)


    useEffect(() => {
        (async () => {

            if (!userPayload) {
                try {
                    const payload: AxiosPayload = {
                        url: 'http://localhost:3001/api/v1/get-user',
                        method: "GET",
                        withCredentials: true
                    }

                    const response = await axiosHandler<HttpResponse<PublicUser>>(payload);
                    setUserPaylod(response.data);
                } catch (error) {
                    if (error instanceof CustomError) {
                        console.log(error.message);
                    }
                    throw error;
                }
            }

        })()
    }, []);

    const handleMenuToggle = () => {
        if (typeof window !== "undefined" && window.innerWidth >= 1024) {
            setSidebarCollapsed((prev) => !prev);
        } else {
            setSidebarOpen((prev) => !prev);
        }
    };
    return (
        <div className="flex relative h-dvh flex-col overflow-hidden bg-background ">
            <Navbar
                sidebarOpen={sidebarOpen}
                onMenuToggle={handleMenuToggle}
            />

            <div className="flex flex-1 overflow-hidden ">
                <Sidebar
                    open={sidebarOpen}
                    collapsed={sidebarCollapsed}
                    onClose={() => setSidebarOpen(true)}
                />
                <main className="flex flex-1 flex-col overflow-hidden ">
                    {children}
                </main>
            </div>

            <MobileNavigation />
        </div>
    )
}

export default DashLayout