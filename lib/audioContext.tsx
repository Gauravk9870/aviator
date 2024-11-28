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
  playCashout: () => void;
  stopAll: () => void;
  setVolume: (volume: number) => void;
  volume: number;
  isMusicPlaying: boolean;
  setIsMusicPlaying: (playing: boolean) => void;
  isSoundEnabled: boolean;
  setIsSoundEnabled: (enable: boolean) => void;
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
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [playingOnHide, setPlayingOnHide] = useState(false);

  const isSoundEnabledRef = useRef(isSoundEnabled);

  const welcomeRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef<HTMLAudioElement | null>(null);
  const crashedRef = useRef<HTMLAudioElement | null>(null);
  const cashoutRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    welcomeRef.current = new Audio("/background.ogg");
    welcomeRef.current.loop = true;
    startedRef.current = new Audio("/game-start.ogg");
    crashedRef.current = new Audio("/plane-crash.ogg");
    cashoutRef.current = new Audio("/cashout.ogg");

    // Preload audio
    const preloadAudio = (audio: HTMLAudioElement) => {
      audio.load();
      audio.volume = volume;
    };

    [welcomeRef, startedRef, crashedRef].forEach((ref) => {
      if (ref.current) preloadAudio(ref.current);
    });

    return () => {
      [welcomeRef, startedRef, crashedRef, cashoutRef].forEach((ref) => {
        if (ref.current) {
          ref.current.pause();
          ref.current.src = "";
        }
      });
    };
  }, []);

  useEffect(() => {
    // Update volume across all audio elements when it changes
    [welcomeRef, startedRef, crashedRef, cashoutRef].forEach((ref) => {
      if (ref.current) ref.current.volume = volume;
    });
  }, [volume]);

  useEffect(() => {
    // Handle background music play/pause based on `isMusicPlaying`
    if (isMusicPlaying && welcomeRef.current) {
      welcomeRef.current
        .play()
        .catch((error) => console.error("Error playing welcome audio:", error));
    } else if (welcomeRef.current) {
      welcomeRef.current.pause();
    }
  }, [isMusicPlaying]);

  useEffect(() => {
    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setPlayingOnHide(isMusicPlaying);
        welcomeRef.current?.pause();
      } else if (playingOnHide) {
        setIsMusicPlaying(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isMusicPlaying, playingOnHide]);

  const playAudio = async (audioRef: React.RefObject<HTMLAudioElement>) => {
    if (audioRef.current && audioRef.current.readyState >= 2) {
      audioRef.current.currentTime = 0;
      try {
        await audioRef.current.play();
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            console.log("Audio playback was aborted");
          } else {
            console.error("Error playing audio:", error);
          }
        }
      }
    } else {
      console.warn("Audio not ready to play");
    }
  };

  const stopAudio = (audioRef: React.RefObject<HTMLAudioElement>) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const playWelcome = async () => {
    console.log("PLAY WELCOME: isMusicPlaying:", isMusicPlaying);
    if (isMusicPlaying && welcomeRef.current) {
      try {
        await playAudio(welcomeRef);
        setIsMusicPlaying(true);
      } catch (error) {
        console.error("Error in playWelcome:", error);
      }
    }
  };

  const playStarted = async () => {
    console.log("PLAY STARTED: isSoundEnabled:", isSoundEnabledRef.current);
    if (isSoundEnabledRef.current && startedRef.current) {
      // Lower the volume of other audio elements
      [welcomeRef, crashedRef].forEach((ref) => {
        if (ref.current) {
          ref.current.volume = volume * 0.3; // Reduce to 30% of the current volume
        }
      });

      // Set playStarted audio to full volume
      if (startedRef.current) {
        startedRef.current.volume = volume; // Max volume
      }

      try {
        await playAudio(startedRef);

        // Restore volumes of other audios after the playStarted audio ends
        startedRef.current.onended = () => {
          [welcomeRef, crashedRef].forEach((ref) => {
            if (ref.current) {
              ref.current.volume = volume; // Restore to the original volume
            }
          });
        };
      } catch (error) {
        console.error("Error in playStarted:", error);
      }
    } else {
      console.log(
        "Sound is disabled or audio not ready. Not playing started sound."
      );
    }
  };

  const playCrashed = async () => {
    console.log("PLAY CRASHED: isSoundEnabled:", isSoundEnabledRef.current);
    if (isSoundEnabledRef.current && crashedRef.current) {
      try {
        await playAudio(crashedRef);
      } catch (error) {
        console.error("Error in playCrashed:", error);
      }
    } else {
      console.log(
        "Sound is disabled or audio not ready. Not playing crashed sound."
      );
    }
  };

  const playCashout = async () => {
    console.log("PLAY Cashout: isSoundEnabled:", isSoundEnabledRef.current);
    if (isSoundEnabledRef.current && cashoutRef.current) {
      // Lower the volume of other audio elements
      [welcomeRef, crashedRef, startedRef].forEach((ref) => {
        if (ref.current) {
          ref.current.volume = volume * 0.3; // Reduce to 30% of the current volume
        }
      });

      // Set playStarted audio to full volume
      if (cashoutRef.current) {
        cashoutRef.current.volume = volume; // Max volume
      }

      try {
        await playAudio(cashoutRef);

        // Restore volumes of other audios after the playStarted audio ends
        cashoutRef.current.onended = () => {
          [welcomeRef, crashedRef, startedRef].forEach((ref) => {
            if (ref.current) {
              ref.current.volume = volume; // Restore to the original volume
            }
          });
        };
      } catch (error) {
        console.error("Error in playCashout:", error);
      }
    } else {
      console.log(
        "Sound is disabled or audio not ready. Not playing cashout sound."
      );
    }
  };

  return (
    <AudioContextValue.Provider
      value={{
        playWelcome,
        playStarted,
        playCrashed,
        playCashout,
        stopAll: () => {
          [welcomeRef, startedRef, crashedRef].forEach(stopAudio);
          setIsMusicPlaying(false);
        },
        setVolume,
        volume,
        isMusicPlaying,
        setIsMusicPlaying,
        isSoundEnabled,
        setIsSoundEnabled: (enabled: boolean) => {
          setIsSoundEnabled(enabled);
          console.log("Sound enabled changed to:", enabled);
          // Immediately update the ref to ensure synchronous access
          isSoundEnabledRef.current = enabled;
        },
      }}
    >
      {children}
    </AudioContextValue.Provider>
  );
};
