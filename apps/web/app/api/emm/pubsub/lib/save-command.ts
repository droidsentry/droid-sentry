import "server-only";

import { DeviceOperation } from "@/lib/types/device";
import { createAdminClient } from "@/lib/supabase/admin";
import { Json } from "@/types/database";

export const saveDeviceCommand = async ({
  devicesOperationData,
  enterpriseId,
  deviceId,
  operationName,
}: {
  devicesOperationData: DeviceOperation;
  deviceId: string;
  enterpriseId: string;
  operationName: string;
}) => {
  const supabase = createAdminClient();
  const { error } = await supabase.from("device_operations").upsert(
    {
      enterprise_id: enterpriseId,
      device_id: deviceId,
      operation_name: operationName,
      operation_response_data: devicesOperationData as Json,
      operation_date: new Date().toISOString(),
    },
    {
      onConflict: "enterprise_id,device_id",
    }
  );

  if (error) {
    throw new Error(`Failed to save commands: ${error?.message}`);
  }
};
