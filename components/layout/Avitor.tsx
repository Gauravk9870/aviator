// Avitor.tsx
"use client";

import { closeMenu, setTransitioning } from "@/lib/features/menuSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useCallback } from "react";

// Define the prop types for Avitor
interface AvitorProps {
  setIsLoading: (isLoading: boolean) => void;
}

export default function Avitor({ setIsLoading }: AvitorProps) {
  const dispatch = useAppDispatch();
  const { isOpen, isTransitioning } = useAppSelector((state) => state.menu);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const toggleMenu = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      console.log("Toggling menu");

      if (isTransitioning) return;

      dispatch(setTransitioning(true));

      if (isOpen) {
        dispatch(closeMenu());
      }

      setTransitioning(false);
    },
    [dispatch, isOpen, isTransitioning]
  );
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
      <div className="absolute inset-0 z-10" onClick={toggleMenu}></div>
    </div>
  );
}
