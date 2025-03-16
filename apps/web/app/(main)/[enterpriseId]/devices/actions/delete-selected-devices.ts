"use server";

import { DeviceTableType } from "@/app/types/device";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { deleteManagedDevices, deleteSyncDevices } from "../lib/delete-device";

/**
 * 選択したデバイスを削除
 * @param deviceName デバイス名
 * @param wipeDataFlags データ削除フラグ
 */
export const deleteSelectedDevices = async ({
  enterpriseId,
  devices,
  wipeDataFlags,
}: {
  enterpriseId: string;
  devices: DeviceTableType[];
  wipeDataFlags: string[];
}) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("ユーザーが認証されていません");

  const deleteDevices = await deleteManagedDevices({
    enterpriseId,
    devices,
    wipeDataFlags,
  }).catch((error) => {
    console.error("Error Delete managed device:", error.message);
    throw new Error(error.message);
  });

  await deleteSyncDevices(enterpriseId, deleteDevices).catch((error) => {
    console.error("Error Delete sync device:", error.message);
    throw new Error(error.message);
  });

  revalidatePath(`/${enterpriseId}/devices`);
};
