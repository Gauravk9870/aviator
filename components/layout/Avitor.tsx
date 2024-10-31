// Avitor.tsx
"use client";

import { closeMenu } from "@/lib/features/menuSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

// Define the prop types for Avitor
interface AvitorProps {
  setIsLoading: (isLoading: boolean) => void;
}

export default function Avitor({ setIsLoading }: AvitorProps) {
  const dispatch = useAppDispatch();
  const isMenuOpen = useAppSelector((state) => state.menu.isOpen);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleClick = () => {
    console.log("Clicked");
    if (isMenuOpen) {
      dispatch(closeMenu());
    }
  };

  return (
    <div className="h-[200px] w-full relative border border-[#6666664b] rounded-2xl lg:h-full">
      <iframe
        id="iframeID"
        src="https://elaborate-monstera-c8852a.netlify.app"
        className="h-full w-full rounded-2xl"
        onLoad={handleLoad}
        style={{
          overflow: "hidden",
        }}
      ></iframe>
      <div className="absolute inset-0 z-10" onClick={handleClick}></div>
    </div>
  );
}
