'use client'

import React, { createContext, useContext, useRef, useState, useEffect } from "react"

declare global {
    interface Window {
        webkitAudioContext: typeof AudioContext
    }
}

interface AudioContextType {
    playWelcome: () => void
    playStarted: () => void
    playCrashed: () => void
    stopAll: () => void
    setVolume: (volume: number) => void
    volume: number
}

const AudioContextValue = createContext<AudioContextType | undefined>(undefined)

export const useAudio = () => {
    const context = useContext(AudioContextValue)
    if (context === undefined) {
        throw new Error('useAudio must be used within an AudioProvider')
    }
    return context
}

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [volume, setVolume] = useState(1.0)
    const welcomeRef = useRef<HTMLAudioElement | null>(null)
    const startedRef = useRef<HTMLAudioElement | null>(null)
    const crashedRef = useRef<HTMLAudioElement | null>(null)
    const audioContextRef = useRef<AudioContext | null>(null)
    const reducedVolume = 0.5

    useEffect(() => {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext
        audioContextRef.current = new AudioContextClass()

        welcomeRef.current = new Audio('/background.ogg')
        startedRef.current = new Audio('/game-start.ogg')
        crashedRef.current = new Audio('/plane-crash.ogg')

        const connectAudioElement = (audioElement: HTMLAudioElement) => {
            if (audioContextRef.current) {
                const source = audioContextRef.current.createMediaElementSource(audioElement)
                source.connect(audioContextRef.current.destination)
            }
        }

        connectAudioElement(welcomeRef.current)
        connectAudioElement(startedRef.current)
        connectAudioElement(crashedRef.current)

        return () => {
            [welcomeRef, startedRef, crashedRef].forEach(ref => {
                if (ref.current) {
                    ref.current.pause()
                    ref.current.currentTime = 0
                }
            })
            if (audioContextRef.current) {
                audioContextRef.current.close()
            }
        }
    }, [])

    useEffect(() => {
        [welcomeRef, startedRef, crashedRef].forEach(ref => {
            if (ref.current) {
                ref.current.volume = volume
            }
        })
    }, [volume])

    const playAudio = async (audioRef: React.RefObject<HTMLAudioElement>, lowerOthers: boolean = false) => {
        if (audioRef.current) {
            if (lowerOthers) {
                adjustOtherVolumes(audioRef, reducedVolume)
            }
            audioRef.current.currentTime = 0
            try {
                await audioRef.current.play()
                audioRef.current.onended = () => restoreVolumes()
            } catch (error) {
                console.error("Error playing audio:", error)
                restoreVolumes() // Restore volumes even if there's an error
            }
        }
    }

    const stopAudio = (audioRef: React.RefObject<HTMLAudioElement>) => {
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
        }
        restoreVolumes()
    }

    const adjustOtherVolumes = (activeAudioRef: React.RefObject<HTMLAudioElement>, newVolume: number) => {
        [welcomeRef, startedRef, crashedRef].forEach(ref => {
            if (ref !== activeAudioRef && ref.current) {
                ref.current.volume = newVolume
            }
        })
    }

    const restoreVolumes = () => {
        [welcomeRef, startedRef, crashedRef].forEach(ref => {
            if (ref.current) {
                ref.current.volume = volume
            }
        })
    }

    const playWelcome = () => playAudio(welcomeRef)
    const playStarted = () => playAudio(startedRef, true)
    const playCrashed = () => {
        stopAudio(startedRef)  // Stop any started audio if playing
        playAudio(crashedRef, true)
    }
    const stopAll = () => {
        [welcomeRef, startedRef, crashedRef].forEach(stopAudio)
        restoreVolumes()
    }
    const updateVolume = (newVolume: number) => setVolume(Math.max(0, Math.min(1, newVolume)))

    return (
        <AudioContextValue.Provider value={{
            playWelcome,
            playStarted,
            playCrashed,
            stopAll,
            setVolume: updateVolume,
            volume
        }}>
            {children}
        </AudioContextValue.Provider>
    )
}
