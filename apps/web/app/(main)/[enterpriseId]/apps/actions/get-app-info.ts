"use server";

import { SheetAppInfo } from "@/app/types/apps";
import { createClient } from "@/lib/supabase/server";

/**
 * Sheetコンポーネントで使用するアプリケーション情報を取得する
 * @param appName
 * @returns SheetAppInfo
 */
export const getSheetAppInfo = async (appId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("apps")
    .select(
      `
      appId:app_id,
      appData:app_data,
      appType:app_type
      `
    )
    .eq("app_id", appId)
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return data as SheetAppInfo;
};
