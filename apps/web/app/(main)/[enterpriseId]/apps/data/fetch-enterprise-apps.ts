"use server";

import { createClient } from "@/lib/supabase/server";
import { AppType } from "@/app/types/apps";
import { selectAppFields } from "./select-app-fields";

export const getApps = async (enterpriseId: string, appType?: AppType) => {
  //10秒待機

  const supabase = await createClient();
  // 認証
  const user = supabase.auth.getUser();
  if (!user) {
    throw new Error("Not authenticated");
  }

  /// update_atで降順に並び替え
  let query = supabase
    .from("apps")
    .select(selectAppFields)
    .eq("enterprise_id", enterpriseId)
    .order("updated_at", { ascending: false });

  if (appType) {
    query = query.eq("app_type", appType);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  return data;
};
