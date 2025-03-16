import "server-only";

import { createAndroidManagementClient } from "@/lib/emm/client";
import { createClient } from "@/lib/supabase/server";
import { DeviceTableType } from "@/app/types/device";
/**
 * デバイスを削除
 * Google EMM APIでデバイスを削除
 * データベースのデータは削除しない
 */
export const deleteManagedDevice = async ({
  enterpriseId,
  deviceId,
  wipeDataFlags,
  wipeReasonMessage,
}: {
  enterpriseId: string;
  deviceId: string;
  wipeDataFlags: string[];
  wipeReasonMessage?: string;
}) => {
  const name = `enterprises/${enterpriseId}/devices/${deviceId}`;

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
  devices,
  wipeDataFlags,
  wipeReasonMessage,
}: {
  enterpriseId: string;
  devices: DeviceTableType[];
  wipeDataFlags: string[];
  wipeReasonMessage?: string;
}) => {
  const results = await Promise.all(
    devices.map(async (device) => {
      const { deviceId } = device;
      await deleteManagedDevice({
        enterpriseId,
        deviceId,
        wipeDataFlags,
        wipeReasonMessage,
      });
      return deviceId;
    })
  );
  return results;
};

/**
 * データベースのデバイスデータを削除
 */
export const deleteSyncDevices = async (
  enterpriseId: string,
  Ids: string[]
) => {
  const supabase = await createClient();
  const { error, count } = await supabase
    .from("devices")
    .delete({ count: "exact" }) // 削除件数を取得
    .eq("enterprise_id", enterpriseId)
    .in("id", Ids);

  if (error) {
    console.error("Error Delete DB device:", error.message);
    throw new Error(error.message);
  }
  console.log(`${count}件のデバイスを削除しました`);
};
