"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  openMenu,
  setTransitioning,
  closeMenu,
} from "@/lib/features/menuSlice";
import { RootState } from "@/lib/store";

import Currency from "./Currency";
import { useAudio } from "@/lib/audioContext";
import { fetchBalance } from "@/lib/features/currencySlice";
import { useRouter, useSearchParams } from "next/navigation";

const useMenu = () => {
  const dispatch = useAppDispatch();
  const { isOpen, isTransitioning } = useAppSelector((state) => state.menu);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleMenu = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (isTransitioning) return;

      dispatch(setTransitioning(true));

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (isOpen) {
        dispatch(closeMenu());
      } else {
        dispatch(openMenu());
      }

      timeoutRef.current = setTimeout(() => {
        dispatch(setTransitioning(false));
      }, 300); // Adjust this value if needed
    },
    [dispatch, isOpen, isTransitioning]
  );

  const handleCloseMenu = useCallback(() => {
    if (isTransitioning) return;

    dispatch(setTransitioning(true));
    dispatch(closeMenu());

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      dispatch(setTransitioning(false));
    }, 300); // Adjust this value if needed
  }, [dispatch, isTransitioning]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        handleCloseMenu();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen, handleCloseMenu]);

  return { isOpen, toggleMenu, menuRef, triggerRef, handleCloseMenu };
};

export default function Navbar() {
  const { isOpen, toggleMenu, menuRef, triggerRef, handleCloseMenu } =
    useMenu();
  const { soundEnabled, musicEnabled, setSoundEnabled, setMusicEnabled } =
    useAudio();

  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showGameRules, setShowGameRules] = useState(false);
  const [showProvablyFairSettings, setShowProvablyFairSettings] =
    useState(false);
  const [showGameLimits, setShowGameLimits] = useState(false);
  const [showChangeAvatar, setShowChangeAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [returnURL, setReturnURL] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { balance } = useAppSelector((state) => state.currency);
  const gameLogo = useAppSelector((state: RootState) => state.aviator.gameLogo);
const userId=useAppSelector((state: RootState) => state.aviator.user)
const userEmail=useAppSelector((state: RootState) => state.aviator.userEmail);
const isConnected = useAppSelector((state: RootState) => state.aviator.isConnected);

  const parseReturnURL = useCallback((url: string | null) => {
    if (!url) return null;
    try {
      return new URL(url).toString();
    } catch (error) {
      console.error("Error parsing return URL:", error);
      return null;
    }
  }, []);

  useEffect(() => {
    if(!isConnected)return
    dispatch(fetchBalance(`${userId}`));
  }, [dispatch,isConnected]);

  useEffect(() => {
    const savedAvatar = localStorage.getItem("selectedAvatar");
    if (savedAvatar) {
      setAvatarUrl(savedAvatar);
    }

    const return_url = searchParams.get("return_url");
    const parsedReturnURL = parseReturnURL(return_url);
    setReturnURL(parsedReturnURL);
  }, [searchParams, parseReturnURL]);

  const toggleHowToPlay = () => setShowHowToPlay((prev) => !prev);
  const toggleGameRules = () => setShowGameRules((prev) => !prev);
  const toggleProvablyFairSettings = () =>
    setShowProvablyFairSettings((prev) => !prev);
  const toggleGameLimits = () => setShowGameLimits((prev) => !prev);
  const toggleChangeAvatar = () => setShowChangeAvatar((prev) => !prev);

  const handleAvatarSelect = (url: string) => {
    setAvatarUrl(url);
    localStorage.setItem("selectedAvatar", url);
    setShowChangeAvatar(false);
  };

  const handleMyBetHistory = () => {
    dispatch(setActiveTab("my-bets"));
    console.log("Active tab set to 'my-bets'");
  };

  const handleHomeClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (returnURL) {
        router.push(returnURL);
      }
    },
    [returnURL, router]
  );


  

  const menuItems = [
    {
      icon: <Volume2 size={18} />,
      label: "Sound",
      toggle: true,
      state: soundEnabled,
      setState: (checked: boolean) => {
        setSoundEnabled(checked);
      },
    },
    {
      icon: <Music size={18} />,
      label: "Music",
      toggle: true,
      state: musicEnabled,
      setState: (checked: boolean) => {
        setMusicEnabled(checked);
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
        <span className="text-2xl font-black text-red-600 italic flex items-center gap-2">
            {gameLogo && (
              <img src={gameLogo} alt="Game Logo" className="h-8 w-auto" />
            )}
          
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
            <span className="text-base font-bold text-[#28a909]">
              {balance}
            </span>
            <Currency />
          </div>
          <div className="flex items-center justify-center border-l-2 border-[#464648]">
            <Menubar className="h-auto w-auto cursor-pointer border-none bg-transparent p-0 data-[state=open]:bg-transparent">
              <MenubarMenu>
                <MenubarTrigger
                  ref={triggerRef}
                  onClick={toggleMenu}
                  className="bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent"
                >
                  <Menu size={20} className="text-[#999999]" />
                </MenubarTrigger>
                {isOpen && (
                  <MenubarContent
                    ref={menuRef}
                    align="end"
                    className="min-w-[320px] border-none bg-[#2c2d30] p-0 text-white"
                    onCloseAutoFocus={(event) => {
                      event.preventDefault();
                      handleCloseMenu();
                    }}
                  >
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
                          onSelect={item.toggle ? undefined : item.onSelect}
                        >
                          <div className="flex items-center">
                            <span className="mr-2 text-[#83878e]">
                              {item.icon}
                            </span>
                            {item.label}
                          </div>
                          {item.toggle && (
                            <div onClick={(e) => e.stopPropagation()}>
                              <Switch
                                checked={item.state}
                                onCheckedChange={(checked) =>
                                  item.setState(checked)
                                }
                                className="ml-2 border-2 border-gray-600 bg-transparent data-[state=checked]:border-[#60ae05] data-[state=checked]:bg-[#229607] data-[state=unchecked]:bg-transparent"
                              />
                            </div>
                          )}
                        </MenubarItem>
                        {item.isLastToggle && <div className="h-4"></div>}
                        {index < menuItems.length - 1 && (
                          <MenubarSeparator className="m-0 h-[1px] bg-gray-700 p-0" />
                        )}
                      </React.Fragment>
                    ))}
                    <MenubarSeparator className="m-0 h-[1px] bg-gray-700 p-0" />

                    {returnURL && (
                      <MenubarItem className="flex items-center justify-center bg-[#2c2d30] py-3 px-3 hover:bg-[#2c2d30] focus:bg-[#2c2d30] focus:text-white cursor-pointer">
                        <div
                          onClick={handleHomeClick}
                          className="flex items-center gap-1"
                        >
                          <Home size={16} className="text-[#83878e]" />
                          <span className="text-xs text-[#9ea0a3]">Home</span>
                        </div>
                      </MenubarItem>
                    )}
                  </MenubarContent>
                )}
              </MenubarMenu>
            </Menubar>
          </div>
        </div>
      </div>

      {showGameLimits && <GameLimitsPopup onClose={toggleGameLimits} />}
      {showHowToPlay && <HowToPlayPopup onClose={toggleHowToPlay} />}
      {showGameRules && <GameRulesPopup onClose={toggleGameRules} />}
      {showProvablyFairSettings && (
        <ProvablyFairSettingsPopup onClose={toggleProvablyFairSettings} />
      )}
      {showChangeAvatar && (
        <ChangeAvatarPopup
          onClose={toggleChangeAvatar}
          onAvatarSelect={handleAvatarSelect}
          selectedAvatarUrl={avatarUrl}
          userEmail={`${userEmail}`}
        />
      )}
    </div>
  );
}
