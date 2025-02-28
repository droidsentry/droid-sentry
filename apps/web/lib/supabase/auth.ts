import "server-only";

import { createClient } from "./server";

export const checkSupabaseAuth = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
