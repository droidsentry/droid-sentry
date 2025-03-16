"use server";

import { DeviceTableType } from "@/app/types/device";
import { createAndroidManagementClient } from "@/lib/emm/client";
import { createClient } from "@/lib/supabase/server";
import { Json } from "@/types/database";
import { revalidatePath } from "next/cache";

const remoteLook = async ({
  device,
  enterpriseId,
}: {
  device: DeviceTableType;
  enterpriseId: string;
}) => {
  const { deviceId } = device;
  const supabase = await createClient();
  const androidmanagement = await createAndroidManagementClient();
  const name = `enterprises/${enterpriseId}/devices/${deviceId}`;
  const type = "LOCK";
  const requestBody = {
    type,
  };
  const { data } = await androidmanagement.enterprises.devices
    .issueCommand({
      name,
      requestBody,
    })
    .catch((error) => {
      console.error(error);
      throw new Error("Failed to fetch device from Google EMM");
    });

  const operationName = data.name?.split("/operations/")[1] ?? null;
  const { data: operationData, error: operationError } = await supabase
    .from("device_operations")
    .insert({
      device_uuid: deviceId,
      operation_type: type,
      operation_name: operationName,
      operation_request_data: requestBody,
      operation_response_data: data as Json,
    })
    .select("operation_id")
    .single();
  if (operationError) {
    throw new Error("Failed to record operation");
  }
  const operationId = operationData.operation_id;

  await supabase
    .from("devices")
    .update({
      last_operation_id: operationId,
      updated_at: new Date().toISOString(),
    })
    .eq("enterprise_id", enterpriseId)
    .eq("device_id", deviceId);
};

/**
 * デバイスのロック
 * @param devices
 * @param enterpriseId
 * @returns
 */
export const remoteLookDevices = async ({
  devices,
  enterpriseId,
}: {
  devices: DeviceTableType[];
  enterpriseId: string;
}) => {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not found");
  }
  // Promise.all()を使用して、すべての非同期処理の完了を待機
  await Promise.all(
    devices.map(async (device) => {
      await remoteLook({ device, enterpriseId }).catch((error) => {
        console.error("Error remote look device", error.message);
        throw new Error(error.message);
      });
    })
  );
  revalidatePath(`/${enterpriseId}/devices`);
};
