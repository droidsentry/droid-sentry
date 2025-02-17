import "server-only";

import { HardwareStatusType } from "@/app/types/device";
import { createClient } from "@/lib/supabase/server";
/**
 * ハードウェアステータスを取得
 * @param enterpriseId 企業ID
 * @param deviceIdentifier デバイスID
 * @returns ハードウェアステータス
 */
export const getHardwareStatus = async ({
  enterpriseId,
  deviceIdentifier,
}: {
  enterpriseId: string;
  deviceIdentifier: string;
}) => {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  if (!user) {
    throw new Error("ユーザーが見つかりません");
  }
  const { data, error } = await supabase
    .from("device_hardware_status")
    .select(
      `
      hardwareStatus:hardware_status
    `
    )
    .match({
      enterprise_id: enterpriseId,
      device_identifier: deviceIdentifier,
    })
    .order("create_time", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  const hardwareStatusSource = data.map(
    (item) => item.hardwareStatus
  ) as HardwareStatusType[];

  return hardwareStatusSource;
};
