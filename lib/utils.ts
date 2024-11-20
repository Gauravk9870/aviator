import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimestamp(timestamp: string): { time: string; date: string } {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);

  return {
    time: `${hours}:${minutes}`,
    date: `${day}-${month}-${year}`
  };
}

const exchangeRates: { [key: string]: number } = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.73,
  JPY: 110.14
}

export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
  const fromRate = exchangeRates[fromCurrency]
  const toRate = exchangeRates[toCurrency]

  if (!fromRate || !toRate) {
    throw new Error('Invalid currency')
  }

  return (amount / fromRate) * toRate
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
export type TopBet = {
  id?: string;
  crashPoint?: number;
  date?: string;
  userImage?: string;
  userName?: string;
  betAmount?: number;
  cashOutPoint?: number;
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

export const bets: Bet[] = [
  {
    id: "1",
    avatar: "/placeholder.svg?height=32&width=32",
    user: "d***3",
    amount: 100,
    x: 0,
    cashedOut: 0,
    timestamp: "2024-10-25T14:25:10Z",
  },
  {
    id: "2",
    avatar: "/placeholder.svg?height=32&width=32",
    user: "d***4",
    amount: 100,
    x: 2.45,
    cashedOut: 124,
    timestamp: "2024-10-25T14:26:10Z",
  },
  {
    id: "3",
    avatar: "/placeholder.svg?height=32&width=32",
    user: "d***5",
    amount: 150,
    x: 1.75,
    cashedOut: 0,
    timestamp: "2024-10-25T14:27:10Z",
  },
  {
    id: "4",
    avatar: "/placeholder.svg?height=32&width=32",
    user: "d***6",
    amount: 200,
    x: 0,
    cashedOut: 0,
    timestamp: "2024-10-25T14:28:10Z",
  },
  {
    id: "5",
    avatar: "/placeholder.svg?height=32&width=32",
    user: "d***7",
    amount: 50,
    x: 1.9,
    cashedOut: 95,
    timestamp: "2024-10-25T14:29:10Z",
  },
  {
    id: "6",
    avatar: "/placeholder.svg?height=32&width=32",
    user: "d***8",
    amount: 75,
    x: 0,
    cashedOut: 0,
    timestamp: "2024-10-25T14:30:10Z",
  },
  {
    id: "7",
    avatar: "/placeholder.svg?height=32&width=32",
    user: "d***9",
    amount: 120,
    x: 1.85,
    cashedOut: 222,
    timestamp: "2024-10-25T14:31:10Z",
  },
  {
    id: "8",
    avatar: "/placeholder.svg?height=32&width=32",
    user: "d***10",
    amount: 90,
    x: 2.3,
    cashedOut: 0,
    timestamp: "2024-10-25T14:32:10Z",
  },
  {
    id: "9",
    avatar: "/placeholder.svg?height=32&width=32",
    user: "d***11",
    amount: 110,
    x: 0,
    cashedOut: 0,
    timestamp: "2024-10-25T14:33:10Z",
  },
  {
    id: "10",
    avatar: "/placeholder.svg?height=32&width=32",
    user: "d***12",
    amount: 130,
    x: 2.15,
    cashedOut: 279,
    timestamp: "2024-10-25T14:34:10Z",
  },
  {
    id: "11",
    avatar: "/placeholder.svg?height=32&width=32",
    user: "d***13",
    amount: 140,
    x: 0,
    cashedOut: 0,
    timestamp: "2024-10-25T14:35:10Z",
  },
  {
    id: "12",
    avatar: "/placeholder.svg?height=32&width=32",
    user: "d***14",
    amount: 160,
    x: 0,
    cashedOut: 0,
    timestamp: "2024-10-25T14:36:10Z",
  },
  {
    id: "13",
    avatar: "/placeholder.svg?height=32&width=32",
    user: "d***15",
    amount: 180,
    x: 1.5,
    cashedOut: 270,
    timestamp: "2024-10-25T14:37:10Z",
  },
  {
    id: "14",
    avatar: "/placeholder.svg?height=32&width=32",
    user: "d***16",
    amount: 90,
    x: 0,
    cashedOut: 0,
    timestamp: "2024-10-25T14:38:10Z",
  },
  {
    id: "15",
    avatar: "/placeholder.svg?height=32&width=32",
    user: "d***17",
    amount: 70,
    x: 1.25,
    cashedOut: 87,
    timestamp: "2024-10-25T14:39:10Z",
  },
  {
    id: "16",
    avatar: "/placeholder.svg?height=32&width=32",
    user: "d***18",
    amount: 300,
    x: 0,
    cashedOut: 0,
    timestamp: "2024-10-25T14:40:10Z",
  },
  {
    id: "17",
    avatar: "/placeholder.svg?height=32&width=32",
    user: "d***19",
    amount: 85,
    x: 1.95,
    cashedOut: 166,
    timestamp: "2024-10-25T14:41:10Z",
  },
  {
    id: "18",
    avatar: "/placeholder.svg?height=32&width=32",
    user: "d***20",
    amount: 190,
    x: 2.1,
    cashedOut: 399,
    timestamp: "2024-10-25T14:42:10Z",
  },
  {
    id: "19",
    avatar: "/placeholder.svg?height=32&width=32",
    user: "d***21",
    amount: 105,
    x: 0,
    cashedOut: 0,
    timestamp: "2024-10-25T14:43:10Z",
  },
  {
    id: "20",
    avatar: "/placeholder.svg?height=32&width=32",
    user: "d***22",
    amount: 60,
    x: 1.8,
    cashedOut: 108,
    timestamp: "2024-10-25T14:44:10Z",
  },

  // Continue similarly for the remaining 30 entries
];
