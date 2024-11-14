"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";

interface AudioContextType {
  playWelcome: () => void;
  playStarted: () => void;
  playCrashed: () => void;
  stopAll: () => void;
  setVolume: (volume: number) => void;
  volume: number;
  setSoundEnabled: (enabled: boolean) => void;
  setMusicEnabled: (enabled: boolean) => void;
  soundEnabled: boolean;
  musicEnabled: boolean;
}

const AudioContextValue = createContext<AudioContextType | undefined>(
  undefined
);

export const useAudio = () => {
  const context = useContext(AudioContextValue);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [volume, setVolume] = useState(1.0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);

  const welcomeRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef<HTMLAudioElement | null>(null);
  const crashedRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio elements
    welcomeRef.current = new Audio("/background.ogg");
    startedRef.current = new Audio("/game-start.ogg");
    crashedRef.current = new Audio("/plane-crash.ogg");

    return () => {
      [welcomeRef, startedRef, crashedRef].forEach((ref) => {
        if (ref.current) {
          ref.current.pause();
          ref.current.currentTime = 0;
        }
      });
    };
  }, []);

  useEffect(() => {
    // Update volume across all audio elements when it changes
    [welcomeRef, startedRef, crashedRef].forEach((ref) => {
      if (ref.current) {
        ref.current.volume = volume;
      }
    });
  }, [volume]);

  useEffect(() => {
    // Automatically play or stop background music based on `musicEnabled`
    if (musicEnabled) {
      playWelcome(); // Start music if enabled
    } else if (welcomeRef.current) {
      welcomeRef.current.pause(); // Stop music if disabled
      welcomeRef.current.currentTime = 0;
    }
  }, [musicEnabled]); // Triggered each time `musicEnabled` changes

  useEffect(() => {
    // Stop all sound effects if `soundEnabled` is disabled
    if (!soundEnabled) {
      stopAudio(startedRef); // Stop game start sound
      stopAudio(crashedRef); // Stop crash sound
    }
  }, [soundEnabled]); // Triggered each time `soundEnabled` changes

  const playAudio = async (
    audioRef: React.RefObject<HTMLAudioElement>,
    isSound: boolean
  ) => {
    if ((isSound && soundEnabled) || (!isSound && musicEnabled)) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        try {
          await audioRef.current.play();
        } catch (error) {
          console.error("Error playing audio:", error);
        }
      }
    }
  };

  const stopAudio = (audioRef: React.RefObject<HTMLAudioElement>) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const playWelcome = () => {
    if (musicEnabled && welcomeRef.current) {
      playAudio(welcomeRef, false);
    }
  };
  const playStarted = () => {
    if (soundEnabled) playAudio(startedRef, true);
  };
  const playCrashed = () => {
    if (soundEnabled) {
      stopAudio(startedRef);
      playAudio(crashedRef, true);
    }
  };

  const setSoundEnabledWithLog = (enabled: boolean) => {
    console.log("Sound toggled:", enabled ? "Enabled" : "Disabled");
    setSoundEnabled(enabled);
  };

  const setMusicEnabledWithLog = (enabled: boolean) => {
    console.log("Music toggled:", enabled ? "Enabled" : "Disabled");
    setMusicEnabled(enabled);
  };

  return (
    <AudioContextValue.Provider
      value={{
        playWelcome,
        playStarted,
        playCrashed,
        stopAll: () => {
          [welcomeRef, startedRef, crashedRef].forEach(stopAudio);
        },
        setVolume,
        volume,
        setSoundEnabled: setSoundEnabledWithLog,
        setMusicEnabled: setMusicEnabledWithLog,
        soundEnabled,
        musicEnabled,
      }}
    >
      {children}
    </AudioContextValue.Provider>
  );
};
