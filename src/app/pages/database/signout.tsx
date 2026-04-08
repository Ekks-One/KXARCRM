'use client'
import {supabase} from "@/app/server/supabaseClient"
import type { MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link"

export default function SignOut() {
  const signOut = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const { error } = await supabase.auth.signOut();

    if(error) {
      console.error('Error Signing Out');
    }
  };

  return (
    <>
      <Link href="/">
        <Button style={{ width: "100%" }} onClick={signOut}>Sign Out</Button>
      </Link>
    </>
  );
}
