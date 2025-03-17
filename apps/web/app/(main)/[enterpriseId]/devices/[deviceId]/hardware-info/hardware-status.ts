import "server-only";

import { HardwareStatusType } from "@/app/types/device";
import { createClient } from "@/lib/supabase/server";
/**
 * ハードウェアステータスを取得
 * @param enterpriseId 企業ID
 * @param deviceId デバイスID
 * @returns ハードウェアステータス
 */
export const getHardwareStatus = async ({
  enterpriseId,
  deviceId,
}: {
  enterpriseId: string;
  deviceId: string;
}) => {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  if (!user) {
    throw new Error("ユーザーが見つかりません");
  }
  const { data, error } = await supabase
    .from("device_hardware_metrics")
    .select(
      `
      metrics
    `
    )
    .match({
      enterprise_id: enterpriseId,
      device_identifier: deviceId,
    })
    .order("create_time", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  const hardwareStatusSource = data.map(
    (item) => item.metrics
  ) as HardwareStatusType[];

  return hardwareStatusSource;
};
