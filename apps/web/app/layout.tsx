
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DashLayout from "@/components/DashLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PulseLive — Live Streaming Platform",
  description: "Watch live streams, discover creators, and join the community on PulseLive.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {



  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">

        <DashLayout>
          {children}
        </DashLayout>


      </body>
    </html>
  );
}
