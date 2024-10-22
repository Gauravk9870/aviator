'use client'
import { useState } from "react";

export default function Avitor() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="h-full w-full relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0e0e0e] text-white">
          <p>Loading...</p>
        </div>
      )}
      <iframe
        src="https://elaborate-monstera-c8852a.netlify.app"
        className="w-full h-full"
        onLoad={handleLoad}
        style={{ display: isLoading ? "none" : "block" }}
      ></iframe>
    </div>
  );
}
