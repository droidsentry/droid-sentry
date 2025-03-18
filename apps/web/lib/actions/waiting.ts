"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export const isWaitingUserEamilUnique = async (email: string) => {
  const supabaseAdmin = createAdminClient();
  const { data } = await supabaseAdmin
    .from("waiting_users")
    .select("email")
    .eq("email", email)
    .single();
  return !data;
};

export const isWaitingUsernameUnique = async (userName: string) => {
  const supabaseAdmin = createAdminClient();
  const { data } = await supabaseAdmin
    .from("waiting_users")
    .select("username")
    .eq("username", userName)
    .single();
  return !data;
};
