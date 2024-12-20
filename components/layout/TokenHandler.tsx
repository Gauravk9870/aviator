"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import jwt, { JwtPayload } from "jsonwebtoken"; //
import { setEmail, setToken, setUser, setUserName } from "@/lib/features/aviatorSlice";

interface DecodedToken extends JwtPayload {
  email: string; 
}

export default function TokenHandler() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get("token");
    const user = searchParams.get("user");

    if (token) {
      try {
        const decodedToken = jwt.decode(token) as DecodedToken;
        const userEmail = decodedToken?.userEmail;
        const userName=decodedToken?.userName;
        dispatch(setToken(token));
        if (userEmail) {
          dispatch(setEmail(userEmail));
        }else if(userName){
          dispatch(setUserName(userName))
        }
      } catch (error) {
        console.error("Failed to decode token", error);
      }
    }
    if (user) {
      dispatch(setUser(user)); 
    }
  }, [searchParams, dispatch]);

  return null;
}
