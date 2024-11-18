import { SocketProvider } from "@/lib/socket";
import StoreProvider from "../StoreProvider";
import Navbar from "@/components/layout/Navbar";
import { Suspense } from "react";
import CurrencyHandler from "@/components/layout/CurrencyHandler";
import Sidebar from "@/components/layout/Sidebar";
import Multipliers from "@/components/layout/Multipliers";
import { AudioProvider } from "@/lib/audioContext";
import { Toaster } from "react-hot-toast";
import TokenHandler from "@/components/layout/TokenHandler";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AudioProvider>
      <StoreProvider>
        <SocketProvider>
          <Suspense fallback={null}>
            <Navbar />
            <TokenHandler />
            <CurrencyHandler />
          </Suspense>
          <div className="flex flex-1 overflow-hidden p-1 flex-col-reverse lg:flex-row hide-scrollbar">
            <Sidebar />
            <main className="flex-1 overflow-hidden relative lg:h-[calc(100vh-56px)]">
              <Multipliers />
              <Toaster position="top-right" reverseOrder={false} />
              {children}
            </main>
          </div>
        </SocketProvider>
      </StoreProvider>
    </AudioProvider>
  );
}
