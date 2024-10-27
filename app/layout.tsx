import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "../components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Multipliers from "@/components/layout/Multipliers";
import StoreProvider from "./StoreProvider";

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
  title: "Aviator -Game Hub 60",
  description: "Aviator -Game Hub 60",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#111111] lg:h-screen flex flex-col hide-scrollbar`}
      >
        <StoreProvider>
          <Navbar />
          <div className="flex flex-1 overflow-hidden p-1 flex-col-reverse lg:flex-row hide-scrollbar">
            <Sidebar />
            <main className="flex-1 overflow-hidden relative lg:h-[calc(100vh-56px)]">
              <Multipliers />
              {children}
            </main>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
