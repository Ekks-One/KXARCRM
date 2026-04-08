"use client";

import React, { useState } from "react";
import { supabase } from "@/app/server/supabaseClient";
import SignUpModal from "@/components/SignUpModal";

export default function SignUpPage() {
  const [loginStatus, setLoginStatus] = useState("Pending");

  async function signUp(fullName: string, email: string, password: string, confirmPassword: string) {
    console.log("FULL NAME:", fullName);
    console.log("EMAIL:", email);

    if (password !== confirmPassword) {
      setLoginStatus("Passwords do not match");
      return {error: { message: "Passwords don't match"}};
    }

    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    console.log("SIGNUP DATA:", data);
    console.log("SIGNUP ERROR:", error);
    console.log("USER METADATA:", data?.user?.user_metadata);

    if (error) {
      setLoginStatus(error.message);
      return { error: { message: error.message } };
    }

    setLoginStatus("Signed up!");
    return {};
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col gap-4 items-center">
        <p>Status: {loginStatus}</p>
        <SignUpModal onSignUpSubmit={signUp} triggerText="Sign up" />
      </div>
    </div>
  );
}