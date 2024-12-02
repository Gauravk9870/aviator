'use server'

import { config } from "../config"


export async function placeBet(userId: string, amount: number, token: string) {
    try {
        const response = await fetch(`${config.server}/api/aviator/place-bet`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify({ userId, amount }),
        })

        const data = await response.json()

        if (data.status) {
            return { success: true, bet: data.bet }
        } else {
            return { success: false, error: data.message, statusCode: data.statusCode }
        }
    } catch (error) {
        console.error('Error placing bet:', error)
        return { success: false, error: 'An unexpected error occurred' }
    }
}

export async function cashOut(  
    betId: string,
    userId: string,
    currentMultiplier: number,
    sectionId: string,
    token: string) {
    try {
        const response = await fetch(`${config.server}/api/aviator/cash-out`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify({ betId, userId, currentMultiplier, sectionId }),
        })

        const data = await response.json()

        if (data.status) {
            return { success: true, data: data.data }
        } else {
            return { success: false, error: data.message, statusCode: data.statusCode }
        }

    } catch (error) {
        console.error('Error cashing out:', error)
        return { success: false, error: 'An unexpected error occurred' }
    }
}