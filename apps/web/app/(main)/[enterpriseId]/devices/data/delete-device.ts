import "server-only";

import { createAndroidManagementClient } from "@/actions/emm/client";
/**
 * デバイスを削除
 * @param enterpriseId 企業ID
 * @param deviceIdentifier 削除するデバイスの識別子
 * @param wipeDataFlags データ削除フラグ
 * @param wipeReasonMessage データ削除理由 ※省略可
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
  // const supabase = await createClient();
  const name = `enterprises/${enterpriseId}/devices/${deviceIdentifier}`;

  // const { error } = await supabase.from("devices").delete().match({
  //   enterprise_id: enterpriseId,
  //   device_identifier: deleteDeviceIdentifier,
  // });
  // if (error) {
  //   console.error("Error Delete DB device:", error.message);
  //   throw new Error(error.message);
  // }

  const androidmanagement = await createAndroidManagementClient();
  await androidmanagement.enterprises.devices
    .delete({
      name,
      wipeDataFlags,
      wipeReasonMessage,
    })
    .then(async () => {
      // const { error } = await supabase.from("devices").delete().match({
      //   enterprise_id: enterpriseId,
      //   device_identifier: deleteDeviceIdentifier,
      // });
      // if (error) {
      //   console.error("Error Delete DB device:", error.message);
      //   throw new Error(error.message);
      // }
    })
    .catch((error) => {
      console.error("Error Delete Google device:", error.message, name);
      // throw new Error(error.message);
    });
};
