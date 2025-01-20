"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export const deleteApp = async (pathname: string, appId: string) => {
  const supabase = await createClient();
  const { error } = await supabase.from("apps").delete().eq("app_id", appId);
  if (error) {
    throw new Error(error.message);
  }
  console.log("pathname", pathname);
  revalidatePath(pathname);
};

/**
 * 選択したアプリを削除
 * @param appNames
 * @returns
 */
export const deleteSelectedApps = async (
  enterpriseId: string,
  appIds: string[]
) => {
  const supabase = await createClient();
  const { error } = await supabase.from("apps").delete().in("app_id", appIds);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath(`${enterpriseId}/apps`);
};
