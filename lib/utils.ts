import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimestamp(timestamp: string): {
  time: string;
  date: string;
} {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);

  return {
    time: `${hours}:${minutes}`,
    date: `${day}-${month}-${year}`,
  };
}

const exchangeRates: { [key: string]: number } = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.73,
  JPY: 110.14,
};

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  const fromRate = exchangeRates[fromCurrency];
  const toRate = exchangeRates[toCurrency];

  if (!fromRate || !toRate) {
    throw new Error("Invalid currency");
  }

  return (amount / fromRate) * toRate;
}

export type Bet = {
  id: string;
  user: string;
  avatar: string;
  amount: number;
  cashedOut: number;
  x: number;
  timestamp: string;
};
export type MyBet = {
  _id: string;
  amount: number;
  cashedOut: boolean;
  cashOutMultiplier: number;
  createdAt: string;
};

export type TopBet = {
  id?: string;
  crashPoint?: number;
  date?: string;
  userImage?: string;
  userName?: string;
  betAmount?: number;
  cashOutPoint?: number;
  sessionCrashPoint?: number;
  winAmount?: number;
  x?: string;
};
export type ActiveSessionBet = {
  _id: string;
  userId: string;
  amount: number;
  sessionId: string;
  cashedOut: boolean;
  cashOutMultiplier: number;
  userName: string;
  userImage: string;
  createdAt: string;
  __v: number;
};
