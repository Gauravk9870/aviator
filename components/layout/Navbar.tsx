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
} from "lucide-react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Switch } from "../ui/switch";
import HowToPlayPopup from "./HowToPlayPopup";

const Navbar = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const toggleHowToPlay = () => setShowHowToPlay((prev) => !prev);

  const menuItems = [
    {
      icon: <Volume2 size={18} />,
      label: "Sound",
      toggle: true,
      state: soundEnabled,
      setState: setSoundEnabled,
    },
    {
      icon: <Music size={18} />,
      label: "Music",
      toggle: true,
      state: musicEnabled,
      setState: setMusicEnabled,
    },
    {
      icon: <Play size={18} />,
      label: "Animation",
      toggle: true,
      state: animationEnabled,
      setState: setAnimationEnabled,
    },
    { icon: <Star size={18} />, label: "Free Bets" },
    { icon: <History size={18} />, label: "My Bet History" },
    { icon: <Lock size={18} />, label: "Game Limits" },
    { icon: <HelpCircle size={18} />, label: "How To Play" },
    { icon: <FileText size={18} />, label: "Game Rules" },
    { icon: <Shield size={18} />, label: "Provably Fair Settings" },
  ];

  return (
    <div className="p-2 flex justify-between bg-[#1b1c1d] text-white">
      <div className="flex items-center gap-4">
        <span className="text-red-600 text-2xl font-black">Avitor</span>

        <button
          onClick={toggleHowToPlay}
          className="hidden bg-[#e69308] sm:flex items-center rounded-3xl px-2 py-1 gap-1 transition-opacity duration-300"
        >
          <Info size={16} stroke="#5f3816" />
          <span className="text-sm text-[#5f3816]">How to play?</span>
        </button>

        <button
          onClick={toggleHowToPlay}
          className="flex sm:hidden transition-opacity duration-300"
        >
          <Info size={16} stroke="#fff" />
        </button>
      </div>
      <div className="flex items-center">
        <div className="px-3">
          <span className="text-base text-[#28a909] font-bold"> 3,000.00 </span>
          <span className="text-xs text-[#9b9c9e]">USD</span>
        </div>
        <div className="border-l-2 border-[#464648] flex items-center justify-center">
          <Menubar className="bg-transparent p-0 h-auto w-auto border-none cursor-pointer data-[state=open]:bg-transparent">
            <MenubarMenu>
              <MenubarTrigger className="bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent">
                <Menu size={20} stroke="#999999" />
              </MenubarTrigger>
              <MenubarContent className="bg-gray-900 text-white border border-gray-700 min-w-[200px]">
                <div className="flex items-center p-2 mb-2 border-b border-gray-700">
                  <div className="w-8 h-8 bg-gray-700 rounded-full mr-2"></div>
                  <div className="text-sm font-semibold">d***2</div>
                </div>
                {menuItems.map((item, index) => (
                  <React.Fragment key={index}>
                    <MenubarItem className="flex items-center justify-between px-2 py-1 hover:bg-gray-800 focus:bg-gray-800 focus:text-white">
                      <div className="flex items-center">
                        <span className="mr-2">{item.icon}</span>
                        {item.label}
                      </div>
                      {item.toggle && (
                        <Switch
                          checked={item.state}
                          onCheckedChange={item.setState}
                          className="ml-2 bg-transparent border-2 border-gray-600 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                        />
                      )}
                    </MenubarItem>
                    {index < menuItems.length - 1 && (
                      <MenubarSeparator className="bg-gray-700" />
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
