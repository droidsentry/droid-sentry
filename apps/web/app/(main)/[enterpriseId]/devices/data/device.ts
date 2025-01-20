"use server";

import { createAndroidManagementClient } from "@/actions/emm/client";
import { createClient } from "@/lib/supabase/server";
import { Json } from "@/types/database";
import { revalidatePath } from "next/cache";
import { selectDevicesTableFields } from "./select-device-fields";

type getDevicesDataProps = {
  enterpriseId: string;
  firstSize?: number;
  maxDeviceSize?: number;
};

/**
 * デバイスを取得
 * @param enterpriseName
 * @returns devices
 * 最大で100端末まで取得
 */
export const getDevicesData = async ({
  enterpriseId,
  firstSize = 0,
  maxDeviceSize = 99,
}: getDevicesDataProps) => {
  const supabase = await createClient();
  const { data: devices, error } = await supabase
    .from("devices")
    .select(selectDevicesTableFields)
    .eq("enterprise_id", enterpriseId)
    .order("updated_at", { ascending: true })
    .range(firstSize, maxDeviceSize);
  // console.log("devices", devices);

  // エラーが発生した場合の処理
  if (error) {
    console.error("Database query error:", error);
    throw new Error(`Failed to fetch devices: ${error.message}`);
  }

  if (!devices) {
    throw new Error("Failed to fetch devices from database");
  }

  return devices;
};

export const syncDeviceInfoFromDB = async ({
  deviceIdentifier,
  enterpriseId,
}: {
  deviceIdentifier: string;
  enterpriseId: string;
}) => {
  const androidmanagement = await createAndroidManagementClient();
  const name = `enterprises/${enterpriseId}/devices/${deviceIdentifier}`;
  await androidmanagement.enterprises.devices
    .get({
      name,
    })
    .then(async (response) => {
      const supabase = await createClient();
      const { error } = await supabase
        .from("devices")
        .update({ device_data: response.data as Json })
        .match({
          enterprise_id: enterpriseId,
          device_identifier: deviceIdentifier,
        });
      if (error) {
        throw new Error("Failed to update device in database");
      }
    })
    .catch((error) => {
      // 404エラーの場合は、デバイスが存在しないか、デバイスが削除された可能性がある
      if (error.response.status === 404) {
        console.error(error.message);
        throw error.message;
      }
      throw new Error("Failed to fetch device from Google EMM");
    });

  revalidatePath(`/${enterpriseId}/devices`);
};
