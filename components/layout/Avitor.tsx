"use client";
import { useState } from "react";

export default function Avitor() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className=" h-[200px] w-full relative border border-[#6666664b] rounded-2xl lg:h-full">
      {isLoading && (
        <div className="h-full absolute inset-0 flex items-center justify-center bg-[#0e0e0e] text-white">
          <p>Loading...</p>
        </div>
      )}
      <iframe
        src="https://elaborate-monstera-c8852a.netlify.app"
        className="h-full w-full rounded-2xl"
        onLoad={handleLoad}
        style={{
          display: isLoading ? "hidden " : "block",
          overflow: "hidden",
        }}
      ></iframe>
    </div>
  );
}
