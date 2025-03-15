"use server";

import { createClient } from "@/lib/supabase/server";
import { createAndroidManagementClient } from "../../../../../lib/emm/client";
import { IframeType } from "@/app/types/apps";
import { getBaseURL } from "@/lib/base-url";

/**
 * Android Management API
 * @param enterpriseName
 * @param tokenType
 * @returns Android Management Web Token
 * APIドキュメント: https://developers.google.com/android/management/reference/rest/v1/enterprises.webTokens/create?hl=ja
 * ライブラリドキュメント: https://googleapis.dev/nodejs/googleapis/latest/androidmanagement/classes/Resource$Enterprises$Webtokens.html#create
 */
export const getWebToken = async ({
  enterpriseId,
  tokenType,
  currentUrl,
}: {
  enterpriseId: string;
  tokenType: IframeType;
  currentUrl?: string;
}) => {
  // 認証
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not found");
  }
  const parentFrameUrl = getBaseURL(currentUrl);

  // トークンタイプに基づいて iframeFeatures を設定
  const iframeFeatures = (() => {
    switch (tokenType) {
      case "PLAY_SEARCH":
        return ["PLAY_SEARCH", "STORE_BUILDER"];
      case "PRIVATE_APPS":
        return ["PRIVATE_APPS", "STORE_BUILDER"];
      case "WEB_APPS":
        return ["WEB_APPS", "STORE_BUILDER"];
      case "MANAGED_CONFIGURATIONS":
        return ["MANAGED_CONFIGURATIONS"];
      case "ZERO_TOUCH_CUSTOMER_MANAGEMENT":
        return ["ZERO_TOUCH_CUSTOMER_MANAGEMENT"];
      default:
        return ["STORE_BUILDER"];
    }
  })();

  const androidmanagement = await createAndroidManagementClient();
  const parent = `enterprises/${enterpriseId}`;
  const { data: value } = await androidmanagement.enterprises.webTokens
    .create({
      parent,
      requestBody: {
        enabledFeatures: iframeFeatures,
        parentFrameUrl,
        // parentFrameUrl: process.env.HOST,
      },
    })
    .catch((error) => {
      console.error("Error get AndroidManagementWebToken:", error.message);
      throw new Error(error.message);
    });
  if (!value) {
    throw new Error("Get AndroidManagementWebToken failed");
  }
  // console.log("Get AndroidManagementWebToken:", value);

  return value;
};
