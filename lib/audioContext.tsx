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
  const [isMusicPlaying, setIsMusicPlaying] = useState(false); // Track if music is playing
  const [playingOnHide, setPlayingOnHide] = useState(false); // Track if music was playing before visibility change

  const welcomeRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef<HTMLAudioElement | null>(null);
  const crashedRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio elements
    welcomeRef.current = new Audio("/background.ogg");
    welcomeRef.current.loop = true; // Enable looping for background music

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
    // Handle background music play/pause based on `musicEnabled` and `isMusicPlaying`
    if (musicEnabled) {
      if (isMusicPlaying) {
        welcomeRef.current?.play();
      }
    } else {
      welcomeRef.current?.pause();
    }
  }, [musicEnabled, isMusicPlaying]);

  useEffect(() => {
    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause audio and track if it was playing before hiding
        setPlayingOnHide(!welcomeRef.current?.paused);
        welcomeRef.current?.pause();
      } else {
        // Resume playing if it was playing before hiding
        if (playingOnHide && musicEnabled) {
          welcomeRef.current?.play();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [playingOnHide, musicEnabled]);

  const playAudio = async (audioRef: React.RefObject<HTMLAudioElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      try {
        await audioRef.current.play();
      } catch (error) {
        console.error("Error playing audio:", error);
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
      setIsMusicPlaying(true);
      playAudio(welcomeRef);
    }
  };

  const playStarted = () => {
    if (soundEnabled && startedRef.current) {
      // Ensure sound only plays if enabled
      playAudio(startedRef);
    }
  };

  const playCrashed = () => {
    if (soundEnabled && crashedRef.current) {
      // Ensure sound only plays if enabled
      stopAudio(startedRef); // Stop any playing sounds
      playAudio(crashedRef);
    }
  };

  const setSoundEnabledWithLog = (enabled: boolean) => {
    console.log("Sound toggled:", enabled ? "Enabled" : "Disabled");
    setSoundEnabled(enabled);

    if (!enabled) {
      // Stop any active sounds if sound is disabled
      stopAudio(startedRef);
      stopAudio(crashedRef);
    }
  };

  const setMusicEnabledWithLog = (enabled: boolean) => {
    console.log("Music toggled:", enabled ? "Enabled" : "Disabled");
    setMusicEnabled(enabled);
    if (enabled) {
      setIsMusicPlaying(true); // Resume playing if enabled
    } else {
      setIsMusicPlaying(false); // Pause the music if disabled
    }
  };

  return (
    <AudioContextValue.Provider
      value={{
        playWelcome,
        playStarted,
        playCrashed,
        stopAll: () => {
          // Ensure both sound and music stop when stopAll is called
          [welcomeRef, startedRef, crashedRef].forEach(stopAudio);
          setIsMusicPlaying(false);
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
