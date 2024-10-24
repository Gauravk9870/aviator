"use client";

import React, { useState } from "react";
import {
  Info,
  Menu,
  Volume2,
  Music,
  Play,
  Star,
  History,
  Lock,
  HelpCircle,
  FileText,
  Shield,
  CircleUser,
} from "lucide-react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
  MenubarSeparator,
} from "@/components/ui/menubar";
import { Switch } from "@/components/ui/switch";
import HowToPlayPopup from "./HowToPlayPopup";

const Navbar = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const toggleHowToPlay = () => setShowHowToPlay((prev) => !prev);

  const menuItems = [
    {
      icon: <Volume2 size={18} stroke="#83878e" />,
      label: "Sound",
      toggle: true,
      state: soundEnabled,
      setState: setSoundEnabled,
    },
    {
      icon: <Music size={18} stroke="#83878e" />,
      label: "Music",
      toggle: true,
      state: musicEnabled,
      setState: setMusicEnabled,
    },
    {
      icon: <Play size={18} stroke="#83878e" />,
      label: "Animation",
      toggle: true,
      state: animationEnabled,
      setState: setAnimationEnabled,
      isLastToggle: true,
    },
    { icon: <Star size={18} stroke="#83878e" />, label: "Free Bets" },
    { icon: <History size={18} stroke="#83878e" />, label: "My Bet History" },
    { icon: <Lock size={18} stroke="#83878e" />, label: "Game Limits" },
    { icon: <HelpCircle size={18} stroke="#83878e" />, label: "How To Play" },
    { icon: <FileText size={18} stroke="#83878e" />, label: "Game Rules" },
    {
      icon: <Shield size={18} stroke="#83878e" />,
      label: "Provably Fair Settings",
      isLastToggle: true,
    },
  ];

  return (
    <div className="flex justify-between bg-[#1b1c1d] p-2 text-white">
      <div className="flex items-center gap-4">
        <span className="text-2xl font-black text-red-600 font-style: italic">Aviator</span>

        <button
          onClick={toggleHowToPlay}
          className="hidden items-center gap-1 rounded-3xl bg-[#e69308] px-2 py-1 text-sm text-[#5f3816] transition-opacity duration-300 sm:flex"
        >
          <Info size={16} stroke="#5f3816" />
          <span>How to play?</span>
        </button>

        <button
          onClick={toggleHowToPlay}
          className="flex transition-opacity duration-300 sm:hidden"
        >
          <Info size={16} stroke="#fff" />
        </button>
      </div>
      <div className="flex items-center">
        <div className="px-3">
          <span className="text-base font-bold text-[#28a909]"> 3,000.00 </span>
          <span className="text-xs text-[#9b9c9e]">USD</span>
        </div>
        <div className="flex items-center justify-center border-l-2 border-[#464648]">
          <Menubar className="h-auto w-auto cursor-pointer border-none bg-transparent p-0 data-[state=open]:bg-transparent">
            <MenubarMenu>
              <MenubarTrigger className="bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent">
                <Menu size={20} stroke="#999999" />
              </MenubarTrigger>
              <MenubarContent className="min-w-[320px] border-none bg-[#2c2d30] p-0 text-white">
                <div className="flex items-center justify-between p-2 ">
                  <div className="flex items-center p-1">
                    <div className="mr-2 h-8 w-8 rounded-full bg-gray-700"></div>
                    <div className="text-sm font-semibold">d***2</div>
                  </div>
                  <button className="flex cursor-pointer items-center justify-center gap-1 rounded-full border border-[#414148] bg-[#252528] px-4 py-1.5 text-xs text-[#83878e]">
                    <CircleUser size={22} stroke="#83878e" strokeWidth={1} />
                    <span className="leading-tight">
                      Change <br /> Avatar
                    </span>
                  </button>
                </div>
                {menuItems.map((item, index) => (
                  <React.Fragment key={index}>
                    <MenubarItem
                      className="flex items-center justify-between bg-[#1b1c1d] py-2 px-3 hover:bg-[#1b1c1d] focus:bg-[#1b1c1d] focus:text-white"
                      onSelect={(event) => {
                        if (item.toggle) {
                          event.preventDefault();
                        }
                      }}
                    >
                      <div className="flex items-center">
                        <span className="mr-2">{item.icon}</span>
                        {item.label}
                      </div>
                      {item.toggle && (
                        <Switch
                          checked={item.state}
                          onCheckedChange={(checked) => {
                            item.setState(checked);
                          }}
                          className="ml-2 border-2 border-gray-600 bg-transparent data-[state=checked]:border-[#60ae05] data-[state=checked]:bg-[#229607] data-[state=unchecked]:bg-transparent"
                        />
                      )}
                    </MenubarItem>
                    {item.isLastToggle && (
                      <>
                        <div className="h-2"></div>
                        <div className="h-2"></div>
                      </>
                    )}
                    {index < menuItems.length - 1 && (
                      <MenubarSeparator className="m-0 h-[1px] bg-gray-700 p-0" />
                    )}
                  </React.Fragment>
                ))}
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>
      {showHowToPlay && <HowToPlayPopup onClose={toggleHowToPlay} />}
    </div>
  );
};

export default Navbar;