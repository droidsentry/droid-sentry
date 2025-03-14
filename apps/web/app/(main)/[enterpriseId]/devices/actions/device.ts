"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { selectDevicesTableFields } from "../data/select-device-fields";
import { syncDeviceInfo } from "../lib/device";

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
    // .select("*")
    .select(selectDevicesTableFields)
    .eq("enterprise_id", enterpriseId)
    .order("updated_at", { ascending: false })
    .range(firstSize, maxDeviceSize);

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
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not found");
  }
  await syncDeviceInfo(enterpriseId, deviceIdentifier).then(() => {
    revalidatePath(`/${enterpriseId}/devices`);
  });
};
