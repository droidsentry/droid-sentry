"use server";

import { getBaseURL } from "@/lib/base-url/client";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const signInWithGithub = async () => {
  const baseUrl = getBaseURL();
  // console.log("baseUrl", baseUrl);
  const supabase = await createClient();
  const { data } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${baseUrl}/api/auth/callback`,
    },
  });

  if (data.url) {
    // console.log("data.url", data.url);
    redirect(data.url);
  }
};

export const signInWithGoogle = async () => {
  const baseUrl = getBaseURL();
  const supabase = await createClient();
  const { data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${baseUrl}/api/auth/callback`,
    },
  });

  if (data.url) {
    redirect(data.url);
  }
};

export const signInWithDiscord = async () => {
  const baseUrl = getBaseURL();
  const supabase = await createClient();
  const { data } = await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      redirectTo: `${baseUrl}/api/auth/callback`,
    },
  });

  if (data.url) {
    redirect(data.url);
  }
};

export const signOut = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
};
