"use client"
import React, { useEffect, useState } from 'react'
import Navbar from './streaming/Navbar';
import Sidebar from './streaming/Sidebar';
import MobileNavigation from './streaming/MobileNavigation';
import Dialog from './Dialog';

function DashLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 600);
        return () => clearTimeout(timer);
    }, []);

    const handleMenuToggle = () => {
        if (typeof window !== "undefined" && window.innerWidth >= 1024) {
            setSidebarCollapsed((prev) => !prev);
        } else {
            setSidebarOpen((prev) => !prev);
        }
    };



    return (

     <>
       
       <Dialog/>
   
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
     </>

    )
}

export default DashLayout