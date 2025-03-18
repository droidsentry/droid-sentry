import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

export const getDeviceDisplayName = async (
  enterpriseId: string,
  deviceId: string
) => {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("devices")
    .select("deviceDisplayName:device_display_name")
    .match({ enterprise_id: enterpriseId, device_id: deviceId })
    .single();
  if (error) throw error;
  return data?.deviceDisplayName;
};
