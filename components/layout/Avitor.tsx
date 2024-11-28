"use client";

import { closeMenu, setTransitioning } from "@/lib/features/menuSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useCallback } from "react";

export default function Avitor() {
  const dispatch = useAppDispatch();
  const { isTransitioning } = useAppSelector((state) => state.menu);

  const toggleMenu = useCallback(() => {
    if (isTransitioning) return;
    dispatch(setTransitioning(true));
    dispatch(closeMenu());
    dispatch(setTransitioning(false));
  }, [dispatch, isTransitioning]);

  return (
    <div className="h-[200px] w-full relative border border-[#6666664b] rounded-2xl lg:h-full">
      <iframe
        id="iframeID"
        src="https://elaborate-monstera-c8852a.netlify.app/"
        className="h-full w-full rounded-2xl"
        style={{
          overflow: "hidden",
        }}
      ></iframe>
      <div className="absolute inset-0 z-10" onClick={toggleMenu}></div>
    </div>
  );
}
