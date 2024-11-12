'use client'

import React, { createContext, useContext, useEffect, useState } from "react"
import { config } from "@/lib/config"
import { useAppDispatch } from "@/lib/hooks"
import {
    placeBet,
    resetGame,
    setConnectionStatus,
    setCurrentMultiplier,
    setGameCrashed,
    setGameStarted,
    setSessionId,
    updateBet,
} from "@/lib/features/aviatorSlice"
import { useAudio } from "@/lib/audioContext"

interface PendingBet {
    userId: string
    amount: number
    sectionId: string
}

interface SocketContextType {
    socket: WebSocket | null
    setPendingBet: React.Dispatch<React.SetStateAction<PendingBet | null>>
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export const useSocket = (): SocketContextType => {
    const context = useContext(SocketContext)
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider")
    }
    return context
}
const sendMessageToIframe = (data: { type: string; data: string | number}) => {
    const iframe = document.getElementById("iframeID") as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(data, "*");
    }
  };
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch()
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const [pendingBet, setPendingBet] = useState<PendingBet | null>(null)
    const { playWelcome, playStarted, playCrashed, stopAll } = useAudio()

    useEffect(() => {
        const ws = new WebSocket(`${config.ws}`)

        ws.onopen = () => {
            console.log("Connected to Aviator WebSocket")
            dispatch(setConnectionStatus(true))
            ws.send(JSON.stringify({ type: "SUBSCRIBE", gameType: "aviator" }));
            playWelcome()

        }

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data)
            // console.log("Received message from Aviator WebSocket:", data)

            switch (true) {
                case data.message === "Welcome to Aviator!":
                    console.log(data.message)
                    break

                case data.multiplier === "Started":
                    console.log("Game started")
                    dispatch(setGameStarted())
                    sendMessageToIframe({ type: "Start", data: data.multiplier });
                    playStarted()
                    if (pendingBet) {
                        dispatch(placeBet({ ...pendingBet, socket: ws }))
                        setPendingBet(null)
                    }
                    break

                case data.multiplier === "sessionId":
                    console.log("Session ID:", data.sessionId)
                    dispatch(setSessionId(data.sessionId))
                    dispatch(resetGame())
                    if (pendingBet) {
                        dispatch(placeBet({ ...pendingBet, socket: ws }))
                        setPendingBet(null)
                    }
                    break

                case data.multiplier === "Crashed":
                    dispatch(setGameCrashed(data.finalMultiplier))
                    playCrashed()
                    sendMessageToIframe({ type: "Crashed", data: data.multiplier });
                    break

                case typeof data.multiplier === 'string' && !isNaN(parseFloat(data.multiplier)):
                    dispatch(setCurrentMultiplier(parseFloat(data.multiplier)))
                    sendMessageToIframe({ type: "multiplier", data: data.multiplier });
                    
                    break

                case data.type === "BETS":
                    dispatch(updateBet(data.data))
                    break

                default:
                    console.log("Unhandled message type:", data)
            }
        }

        ws.onclose = () => {
            console.log("Disconnected from Aviator WebSocket")
            dispatch(setConnectionStatus(false))
            stopAll()
        }

        setSocket(ws)

        return () => {
            ws.close()
        }
    }, [dispatch, pendingBet, playWelcome, playStarted, playCrashed, stopAll])

    useEffect(() => {
        if (pendingBet && socket && socket.readyState === WebSocket.OPEN) {
            dispatch(placeBet({ ...pendingBet, socket }))
            setPendingBet(null)
        }
    }, [pendingBet, socket, dispatch])

    return (
        <SocketContext.Provider value={{ socket, setPendingBet }}>{children}</SocketContext.Provider>
    )
}
