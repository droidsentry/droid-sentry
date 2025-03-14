"use server";

import { createClient } from "@/lib/supabase/server";
import { createAndroidManagementClient } from "../../../../../lib/emm/client";
import { saveApp } from "../actions/apps";
import { revalidatePath } from "next/cache";

/**
 * アプリ情報を取得する
 * @param enterpriseId
 * @param packageName
 * @param appType
 * @returns
 */
export const getAppData = async ({
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
  const androidmanagement = await createAndroidManagementClient(); //jp-JP
  const name = `enterprises/${enterpriseId}/applications/${packageName}`;
  const { data: appData } = await androidmanagement.enterprises.applications
    .get({
      // The preferred language for localized application info, as a BCP47 tag (e.g. "en-US", "de"). If not specified the default language of the application will be used.
      languageCode: "JP",
      // The name of the application in the form enterprises/{enterpriseId\}/applications/{package_name\}.
      name,
    })
    .catch((error) => {
      console.error("Error getAppData:", error.message);
      throw new Error(error.message);
    });
  if (!appData) {
    throw new Error("Get getAppData failed");
  }
  // console.log("Get getAppData:", appData);

  const saveData = await saveApp({ appData, enterpriseId, appType });

  revalidatePath(pathname);
  return saveData;
};
