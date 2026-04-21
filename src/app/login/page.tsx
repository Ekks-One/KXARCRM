'use client';

import {supabase} from "@/app/server/supabaseClient"
import React from 'react'
import Login from "@/components/Login"
import {useState} from "react"
import { useRouter } from "next/navigation";

export default function Home() {
  const [loginStatus, setLoginStatus] = useState('Pending');

  const router = useRouter();

  async function signIn(email: string, password: string) {
    // Calls supabase auth function to sign in
    const {data, error} = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    })

    if (error) {
      setLoginStatus(error.message);
      return;
    }

    // If user is returned then sign in was successful, update status and redirect user
    if (data.user) {
      setLoginStatus("Valid Email and Password, signing in");
      router.push("/pages/dashboard");
      return;
    }
    // If no user returned, sign in failed, update status
    else
      setLoginStatus("Invalid Email or Password")
  }

  return (
    <div>
      <p>Status: {loginStatus}</p>
      <Login onLoginSubmit={signIn} />
    </div>
  );
}
