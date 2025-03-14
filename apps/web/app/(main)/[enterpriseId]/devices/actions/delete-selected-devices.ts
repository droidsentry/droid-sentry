"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { deleteManagedDevices, deleteSynceDevices } from "../lib/delete-device";

// /**
//  * 選択したデバイスを削除
//  * @param deviceNames
//  * @returns
//  */
// export const deleteSelectedDevices = async ({
//   enterpriseId,
//   deviceIdentifiers,
//   wipeDataFlags = ["WIPE_DATA_FLAG_UNSPECIFIED"],
// }: {
//   enterpriseId: string;
//   deviceIdentifiers: string[];
//   wipeDataFlags: string[];
// }) => {
//   // 認証
//   const supabase = await createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   if (!user) {
//     throw new Error("ユーザーが認証されていません");
//   }
//   // 一台づつ、Google EMM APIでデバイスを削除したのち、DBから削除
//   await Promise.all(
//     deviceIdentifiers.map((deviceIdentifier) => {
//       return deleteManagedDevice({
//         enterpriseId,
//         deviceIdentifier,
//         wipeDataFlags,
//       });
//     })
//   ).catch((error) => {
//     console.error("Error Delete device:", error.message);
//   });
//   revalidatePath(`/${enterpriseId}/devices`);
// };

/**
 * 選択したデバイスを削除
 * @param deviceName デバイス名
 * @param wipeDataFlags データ削除フラグ
 */
export const deleteSelectedDevices = async ({
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

  console.log("deviceIdentifiers", deviceIdentifiers);
  await deleteSynceDevices({
    enterpriseId,
    deviceIdentifiers,
  });
  revalidatePath(`/${enterpriseId}/devices`);

  // // Google EMM APIでデバイスを削除
  // await deleteManagedDevices({
  //   enterpriseId,
  //   deviceIdentifiers,
  //   wipeDataFlags,
  // })
  //   .then(async (deletedDeviceIdentifiers) => {
  //     // データベースのデータを削除
  //     await deleteSynceDevices({
  //       enterpriseId,
  //       deviceIdentifiers: deletedDeviceIdentifiers,
  //     });
  //     revalidatePath(`/${enterpriseId}/devices`);
  //   })
  //   .catch((error) => {
  //     console.error("Error Delete device:", error.message);
  //   });
};
