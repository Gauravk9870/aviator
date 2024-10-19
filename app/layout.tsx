import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "../components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Multipliers from "@/components/layout/Multipliers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#111111] h-screen overflow-hidden `}
      >
        <Navbar />
        <div className="flex flex-1 overflow-hidden p-1 h-[calc(100vh-48px)] ">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <Multipliers />
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
