"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { deleteManagedDevice } from "./delete-device";

/**
 * 選択したデバイスを削除
 * @param deviceNames
 * @returns
 */
export const deleteSelectedDevices = async ({
  enterpriseId,
  deviceIdentifiers,
  wipeDataFlags = ["WIPE_DATA_FLAG_UNSPECIFIED"],
}: {
  enterpriseId: string;
  deviceIdentifiers: string[];
  wipeDataFlags: string[];
}) => {
  // 認証
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("ユーザーが認証されていません");
  }
  // 一台づつ、Google EMM APIでデバイスを削除したのち、DBから削除
  await Promise.all(
    deviceIdentifiers.map((deviceIdentifier) => {
      return deleteManagedDevice({
        enterpriseId,
        deviceIdentifier,
        wipeDataFlags,
      });
    })
  ).catch((error) => {
    console.error("Error Delete device:", error.message);
  });
  revalidatePath(`/${enterpriseId}/devices`);
};

/**
 * 単一デバイスを削除
 * @param deviceName デバイス名
 * @param wipeDataFlags データ削除フラグ
 */
export const deleteDevice = async ({
  enterpriseId,
  deviceIdentifier,
  wipeDataFlags,
}: {
  enterpriseId: string;
  deviceIdentifier: string;
  wipeDataFlags: string[];
}) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("ユーザーが認証されていません");

  // Google EMM APIでデバイスを削除
  await deleteManagedDevice({
    enterpriseId,
    deviceIdentifier,
    wipeDataFlags,
  }).catch((error) => {
    console.error("Error Delete device:", error.message);
  });
  revalidatePath(`/${enterpriseId}/devices`);
};
