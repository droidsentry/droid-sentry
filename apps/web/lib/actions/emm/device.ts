"use server";

import { createClient } from "@/lib/supabase/server";
import { checkServiceLimit } from "@/lib/service";
import { createAndroidManagementClient } from "@/lib/emm/client";
import { SERVICE_LIMIT_CONFIG } from "@/lib/data/service";

/**
 * エンロールメントトークンを作成
 * @param parent エンタープライズID
 * @returns エンロールメントトークン
 * 参考ドキュメント：https://developers.google.com/android/management/reference/rest/v1/enterprises.enrollmentTokens?hl=ja
 *
 */
export const createDeviceEnrollmentTokenWithQRCode = async (
  enterpriseId: string
) => {
  const parent = `enterprises/${enterpriseId}`;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not found");
  }

  // サービス上限を確認する
  const limitKey = "max_devices_kitting_per_user";
  const isMaxDevicesKittingPerUser = await checkServiceLimit(
    enterpriseId,
    limitKey
  );
  if (!isMaxDevicesKittingPerUser) {
    const config = SERVICE_LIMIT_CONFIG[limitKey];
    throw new Error(config.errorMessage);
  }

  const androidmanagement = await createAndroidManagementClient();
  const { data } = await androidmanagement.enterprises.enrollmentTokens
    .create({
      parent,
      requestBody: {
        // additionalData: "登録トークンに関連付けられた任意のデータ",
        allowPersonalUsage: "ALLOW_PERSONAL_USAGE_UNSPECIFIED",
        //   "duration": "my_duration",
        oneTimeOnly: false,
        // policyName: `${parent}/policies/default`,
      },
    })
    .catch((error) => {
      console.error("Error creating enrollment token", error.message);
      throw new Error(error.message);
    });
  // console.log("enrollment token data", data);
  if (!data.qrCode) {
    throw new Error("QRコードが生成されませんでした");
  }

  return data.qrCode;
};
