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
            return { success: false, error: data.error }
        }
    } catch (error) {
        console.error('Error placing bet:', error)
        return { success: false, error: 'An unexpected error occurred' }
    }
}

