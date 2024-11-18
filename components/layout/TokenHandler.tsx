"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "@/lib/features/aviatorSlice";

export default function TokenHandler() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get("token");
    const user = searchParams.get("user");

    if (token) {
      dispatch(setToken(token));
    }

    if (user) {
      dispatch(setUser(user));
    }
  }, [searchParams, dispatch]);

  return null;
}
