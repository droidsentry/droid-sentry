import "server-only";

import { createAndroidManagementClient } from "@/actions/emm/client";
import { createClient } from "@/lib/supabase/server";
/**
 * デバイスを削除
 * Google EMM APIでデバイスを削除
 * データベースのデータは削除しない
 */
export const deleteManagedDevice = async ({
  enterpriseId,
  deviceIdentifier,
  wipeDataFlags,
  wipeReasonMessage,
}: {
  enterpriseId: string;
  deviceIdentifier: string;
  wipeDataFlags: string[];
  wipeReasonMessage?: string;
}) => {
  const name = `enterprises/${enterpriseId}/devices/${deviceIdentifier}`;

  const androidmanagement = await createAndroidManagementClient();
  await androidmanagement.enterprises.devices
    .delete({
      name,
      wipeDataFlags,
      wipeReasonMessage,
    })
    .catch((error) => {
      console.error("Error Delete Google device:", error.message, name);
      // throw new Error(error.message);
    });
};
/**
 * 複数のデバイスを削除
 * Google EMM APIでデバイスを削除
 * データベースのデータは削除しない
 */
export const deleteManagedDevices = async ({
  enterpriseId,
  deviceIdentifiers,
  wipeDataFlags,
  wipeReasonMessage,
}: {
  enterpriseId: string;
  deviceIdentifiers: string[];
  wipeDataFlags: string[];
  wipeReasonMessage?: string;
}) => {
  const results = await Promise.all(
    deviceIdentifiers.map(async (deviceIdentifier) => {
      await deleteManagedDevice({
        enterpriseId,
        deviceIdentifier,
        wipeDataFlags,
        wipeReasonMessage,
      });
      return deviceIdentifier;
    })
  );
  return results;
};

/**
 * データベースのデバイスデータを削除
 */
export const deleteSynceDevices = async ({
  enterpriseId,
  deviceIdentifiers,
}: {
  enterpriseId: string;
  deviceIdentifiers: string[];
}) => {
  const supabase = await createClient();
  const { error, count } = await supabase
    .from("devices")
    .delete({ count: "exact" }) // 削除件数を取得
    .eq("enterprise_id", enterpriseId)
    .in("device_identifier", deviceIdentifiers);

  if (error) {
    console.error("Error Delete DB device:", error.message);
    throw new Error(error.message);
  }
  console.log(`${count}件のデバイスを削除しました`);
};
