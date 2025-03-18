"use server";

import { createClient } from "@/lib/supabase/server";
import { selectAppFields } from "../../../app/(main)/[enterpriseId]/apps/data/select-app-fields";
import { createAndroidManagementClient } from "@/lib/emm/client";
import { saveApp } from "../../../app/(main)/[enterpriseId]/apps/lib/apps";
import { revalidatePath } from "next/cache";
import { AppDetails, AppType } from "@/lib/types/apps";

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

/**
 * アプリの詳細情報を取得
 * @param appId アプリID
 * @returns アプリの詳細情報
 */
export const getAppDetailInfo = async (appId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("apps")
    .select(
      `
      appId:app_id,
      appDetails:app_details   ,
      appType:app_type
      `
    )
    .eq("app_id", appId)
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return data as typeof data & { appDetails: AppDetails };
};

export const getAndSaveAppDetailFromGoogle = async ({
  enterpriseId,
  packageName,
  appType,
  pathname,
}: {
  enterpriseId: string;
  packageName: string;
  appType: string;
  pathname: string;
}) => {
  // 認証
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not found");
  }
  const androidmanagement = await createAndroidManagementClient();
  const name = `enterprises/${enterpriseId}/applications/${packageName}`;
  const { data: appDetails } = await androidmanagement.enterprises.applications
    .get({
      // The preferred language for localized application info, as a BCP47 tag (e.g. "en-US", "de"). If not specified the default language of the application will be used.
      languageCode: "JP",
      // The name of the application in the form enterprises/{enterpriseId\}/applications/{package_name\}.
      name,
    })
    .catch((error) => {
      console.error("Error getAndSaveAppDetailForGoogle:", error.message);
      throw new Error(error.message);
    });
  if (!appDetails) {
    throw new Error("Get getAndSaveAppDetailForGoogle failed");
  }

  const saveData = await saveApp({ appDetails, enterpriseId, appType });

  revalidatePath(pathname);
  return saveData;
};

/**
 * アプリを削除
 * @param pathname パス名
 * @param appId アプリID
 */
export const deleteApp = async (pathname: string, appId: string) => {
  const supabase = await createClient();
  const { error } = await supabase.from("apps").delete().eq("app_id", appId);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath(pathname);
};

/**
 * 選択したアプリを削除
 * @param appNames
 * @returns
 */
export const deleteApps = async (enterpriseId: string, appIds: string[]) => {
  const supabase = await createClient();
  const { error } = await supabase.from("apps").delete().in("app_id", appIds);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath(`${enterpriseId}/apps`);
};
