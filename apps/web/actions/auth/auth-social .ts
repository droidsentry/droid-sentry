"use server";

import { currentBaseUrl } from "@/lib/base-url/server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const host =
  process.env.NODE_ENV === "production" //本番環境にデプロイされていれば、本番とみなす
    ? "https://sample-site-pearl.vercel.app/" // 本番環境の URL
    : "http://localhost:3000";

export const signInWithGithub = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${host}/api/auth/callback`,
    },
  });

  if (data.url) {
    redirect(data.url);
  }
};

export const signInWithGoogle = async () => {
  const baseUrl = currentBaseUrl();
  console.log("baseUrl", baseUrl);
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
  const supabase = await createClient();
  const { data } = await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      redirectTo: `${host}/api/auth/callback`,
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
