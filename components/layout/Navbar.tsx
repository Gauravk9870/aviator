"use client";

import React, { useState, useEffect } from "react";
import {
  Volume2,
  Music,
  History,
  Lock,
  HelpCircle,
  FileText,
  Shield,
  CircleUser,
  Menu,
  Home,
  Info,
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
import GameRulesPopup from "./GameRulesPopup";
import ProvablyFairSettingsPopup from "./ProvablyFairSettingsPopup";
import GameLimitsPopup from "./GameLimitsPopup";
import ChangeAvatarPopup from "./ChangeAvatarPopup"; // Importing the ChangeAvatarPopup
import { setActiveTab } from "@/lib/features/tabsSlice";
import { useDispatch } from "react-redux";

export default function Navbar() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showGameRules, setShowGameRules] = useState(false);
  const [showProvablyFairSettings, setShowProvablyFairSettings] =
    useState(false);
  const [showGameLimits, setShowGameLimits] = useState(false);
  const [showChangeAvatar, setShowChangeAvatar] = useState(false);
  const [showHomeButton, setShowHomeButton] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // Load avatar from localStorage when component mounts
    const savedAvatar = localStorage.getItem("selectedAvatar");
    if (savedAvatar) {
      setAvatarUrl(savedAvatar);
    }

    // Check for 'return_url' in the URL
    const params = new URLSearchParams(window.location.search);
    const returnUrl = params.get("return_url");

    if (returnUrl === "https://spribe.co/games") {
      setShowHomeButton(true); // Show "Home" button only if URL matches
    }
  }, []);

  const toggleHowToPlay = () => setShowHowToPlay((prev) => !prev);

  const toggleGameRules = () => setShowGameRules((prev) => !prev);

  const toggleProvablyFairSettings = () =>
    setShowProvablyFairSettings((prev) => !prev);

  const toggleGameLimits = () => setShowGameLimits((prev) => !prev);

  const toggleChangeAvatar = () => setShowChangeAvatar((prev) => !prev);

  const sendMessageToIframe = (data: { type: string; enabled: boolean }) => {
    const iframe = document.getElementById("iframeID") as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(data, "*");
    }
  };

  const handleAvatarSelect = (url: string) => {
    setAvatarUrl(url); // Update avatar in state
    localStorage.setItem("selectedAvatar", url); // Save avatar in localStorage
    setShowChangeAvatar(false); // Close the avatar popup
  };

  const handleMyBetHistory = () => {
    dispatch(setActiveTab("my-bets"));
    console.log("Active tab set to 'my-bets'");
  };

  const menuItems = [
    {
      icon: <Volume2 size={18} />,
      label: "Sound",
      toggle: true,
      state: soundEnabled,
      setState: (checked: boolean) => {
        setSoundEnabled(checked);
        sendMessageToIframe({ type: "sound-toggle", enabled: checked });
      },
    },
    {
      icon: <Music size={18} />,
      label: "Music",
      toggle: true,
      state: musicEnabled,
      setState: (checked: boolean) => {
        setMusicEnabled(checked);
        sendMessageToIframe({ type: "bgMusic-toggle", enabled: checked });
      },
      isLastToggle: true,
    },
    {
      icon: <History size={18} />,
      label: "My Bet History",
      onSelect: handleMyBetHistory,
    },
    {
      icon: <Lock size={18} />,
      label: "Game Limits",
      onSelect: toggleGameLimits,
    },
    {
      icon: <HelpCircle size={18} />,
      label: "How To Play",
      onSelect: toggleHowToPlay,
    },
    {
      icon: <FileText size={18} />,
      label: "Game Rules",
      onSelect: toggleGameRules,
    },
    {
      icon: <Shield size={18} />,
      label: "Provably Fair Settings",
      onSelect: toggleProvablyFairSettings,
    },
  ];

  return (
    <div className="flex flex-col bg-[#1b1c1d] p-1 text-white">
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-black text-red-600 italic">
            Aviator
          </span>
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
            <span className="text-base font-bold text-[#28a909]">3,000.00</span>
            <span className="text-xs text-[#9b9c9e]">USD</span>
          </div>
          <div className="flex items-center justify-center border-l-2 border-[#464648]">
            <Menubar className="h-auto w-auto cursor-pointer border-none bg-transparent p-0 data-[state=open]:bg-transparent">
              <MenubarMenu>
                <MenubarTrigger className="bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent">
                  <Menu size={20} className="text-[#999999]" />
                </MenubarTrigger>
                <MenubarContent className="min-w-[320px] border-none bg-[#2c2d30] p-0 text-white">
                  <div className="flex items-center justify-between p-2">
                    <div className="flex items-center p-1">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="User Avatar"
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <div className="mr-2 h-8 w-8 rounded-full bg-gray-700"></div>
                      )}
                      <div className="text-sm font-semibold">d***8</div>
                    </div>
                    <button
                      className="flex cursor-pointer items-center justify-center gap-1 rounded-full border border-[#414148] bg-[#252528] px-4 py-1.5 text-xs text-[#83878e]"
                      onClick={toggleChangeAvatar}
                    >
                      <CircleUser size={22} strokeWidth={1} />
                      <span className="leading-tight">
                        Change <br /> Avatar
                      </span>
                    </button>
                  </div>
                  {menuItems.map((item, index) => (
                    <React.Fragment key={index}>
                      <MenubarItem
                        className="flex items-center justify-between bg-[#1b1c1d] py-3 px-3 hover:bg-[#1b1c1d] focus:bg-[#1b1c1d] focus:text-white"
                        onSelect={item.onSelect}
                      >
                        <div className="flex items-center">
                          <span className="mr-2 text-[#83878e]">
                            {item.icon}
                          </span>
                          {item.label}
                        </div>
                        {item.toggle && (
                          <Switch
                            checked={item.state}
                            onCheckedChange={(checked) =>
                              item.setState(checked)
                            }
                            className="ml-2 border-2 border-gray-600 bg-transparent data-[state=checked]:border-[#60ae05] data-[state=checked]:bg-[#229607] data-[state=unchecked]:bg-transparent"
                          />
                        )}
                      </MenubarItem>
                      {item.isLastToggle && <div className="h-4"></div>}
                      {index < menuItems.length - 1 && (
                        <MenubarSeparator className="m-0 h-[1px] bg-gray-700 p-0" />
                      )}
                    </React.Fragment>
                  ))}
                  <MenubarSeparator className="m-0 h-[1px] bg-gray-700 p-0" />

                  {/* Conditionally Render the "Home" Button */}
                  {showHomeButton && (
                    <MenubarItem className="flex items-center justify-center bg-[#2c2d30] py-3 px-3 hover:bg-[#2c2d30] focus:bg-[#2c2d30] focus:text-white cursor-pointer">
                      <div className="flex items-center gap-1">
                        <Home size={16} className="text-[#83878e]" />
                        <span className="text-xs text-[#9ea0a3]">Home</span>
                      </div>
                    </MenubarItem>
                  )}
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </div>
      </div>

      {/* Popups */}
      {showGameLimits && <GameLimitsPopup onClose={toggleGameLimits} />}
      {showHowToPlay && <HowToPlayPopup onClose={toggleHowToPlay} />}
      {showGameRules && <GameRulesPopup onClose={toggleGameRules} />}
      {showProvablyFairSettings && (
        <ProvablyFairSettingsPopup onClose={toggleProvablyFairSettings} />
      )}
      {showChangeAvatar && (
        <ChangeAvatarPopup
          onClose={toggleChangeAvatar}
          onAvatarSelect={handleAvatarSelect} // Pass the avatar select handler
          selectedAvatarUrl={avatarUrl} // Pass the current avatar URL here
        />
      )}
    </div>
  );
}
