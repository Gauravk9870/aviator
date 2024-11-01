'use client'

import {useAppSelector } from "@/lib/hooks";


export default function Currency() {
    const { current: currentCurrency } = useAppSelector((state) => state.currency);
    return <span className="text-xs text-[#9b9c9e]">{currentCurrency}</span>
}