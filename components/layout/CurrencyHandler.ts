'use client'

import { setCurrency } from "@/lib/features/currencySlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function CurrencyHandler() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { current: currentCurrency, isInitialized } = useAppSelector((state) => state.currency);

    useEffect(() => {
        const currencyParam = searchParams.get('currency')
        if (currencyParam) {
            if (!isInitialized || currencyParam !== currentCurrency) {
                dispatch(setCurrency(currencyParam))
            }
        } else {
            // If no currency parameter is present, set the default
            const newSearchParams = new URLSearchParams(searchParams.toString())
            newSearchParams.set('currency', currentCurrency)
            router.replace(`?${newSearchParams.toString()}`, { scroll: false })
        }
    }, [searchParams, currentCurrency, isInitialized, dispatch, router])

    return null; // This component doesn't render anything
}