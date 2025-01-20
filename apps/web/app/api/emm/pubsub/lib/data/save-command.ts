import "server-only";

import { DeviceOperation } from "@/app/types/device";
import { createAdminClient } from "@/lib/supabase/admin";
import { Json } from "@/types/database";

export const saveDeviceCommand = async ({
  devicesOperationData,
  enterpriseId,
  deviceIdentifier,
  operationName,
}: {
  devicesOperationData: DeviceOperation;
  deviceIdentifier: string;
  enterpriseId: string;
  operationName: string;
}) => {
  const supabase = createAdminClient();
  const { error } = await supabase.from("operations").insert({
    device_identifier: deviceIdentifier,
    enterprise_id: enterpriseId,
    operation_name: operationName,
    operation_response_data: devicesOperationData as Json,
  });

  if (error) {
    throw new Error(`Failed to save commands: ${error?.message}`);
  }
};
