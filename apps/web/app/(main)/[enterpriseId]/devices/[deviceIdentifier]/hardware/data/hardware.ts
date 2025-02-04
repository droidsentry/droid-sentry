import "server-only";

import { AndroidManagementDevice } from "@/app/types/device";
import { createClient } from "@/lib/supabase/server";

export const getHardwareInfo = async ({
  enterpriseId,
  deviceIdentifier,
}: {
  enterpriseId: string;
  deviceIdentifier: string;
}) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("devices")
    .select(
      `
      device:device_data
      `
    )
    .match({
      enterprise_id: enterpriseId,
      device_identifier: deviceIdentifier,
    })
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  const deviceSource = data.device as AndroidManagementDevice;

  return deviceSource;
};
