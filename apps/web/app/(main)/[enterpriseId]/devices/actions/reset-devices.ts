"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { deleteManagedDevices } from "../lib/delete-device";

/**
 * 選択したデバイスを削除
 * @param deviceName デバイス名
 * @param wipeDataFlags データ削除フラグ
 */
export const resetDevices = async ({
  enterpriseId,
  deviceIdentifiers,
  wipeDataFlags,
}: {
  enterpriseId: string;
  deviceIdentifiers: string[];
  wipeDataFlags: string[];
}) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("ユーザーが認証されていません");

  // Google EMM APIでデバイスを削除
  await deleteManagedDevices({
    enterpriseId,
    deviceIdentifiers,
    wipeDataFlags,
  }).catch((error) => {
    console.error("Error Delete device:", error.message);
  });
  revalidatePath(`/${enterpriseId}/devices`);
};
