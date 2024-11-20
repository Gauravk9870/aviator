// Home.tsx
"use client";
import { useState, useEffect } from "react";
import BetControl from "@/components/layout/BetControl";
import Avitor from "@/components/layout/Avitor";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
// 
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000); 

    return () => clearTimeout(timeout);
  }, []);

  return (
    <main className="lg:h-[calc(100vh-85.5px)] flex flex-col bg-[#0e0e0e] justify-between lg:p-2 relative">
      {isLoading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0e0e0e] text-white z-50">
          <img
            src="./logo.png" 
            alt="Logo"
            className="w-24 h-24 mb-4"
          />
          <p>Loading...</p>
        </div>
      )}
      <Avitor setIsLoading={setIsLoading} />
      <BetControl  />
    </main>
  );
}
