"use server";

import { DeviceTableType } from "@/lib/types/device";
import { createAndroidManagementClient } from "@/lib/emm/client";
import { createClient } from "@/lib/supabase/server";
import { Json } from "@/types/database";
import { revalidatePath } from "next/cache";

const reboot = async ({
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
  const type = "REBOOT";
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
  const { data: operationData, error } = await supabase
    .from("device_operations")
    .insert({
      enterprise_id: enterpriseId,
      device_id: deviceId,
      operation_type: type,
      operation_name: operationName,
      operation_request_data: requestBody,
      operation_response_data: data as Json,
    })
    .select("operation_id")
    .single();
  if (error) {
    throw new Error("Failed to record operation");
  }
  await supabase
    .from("devices")
    .update({
      last_operation_id: operationData.operation_id,
      updated_at: new Date().toISOString(),
    })
    .match({
      enterprise_Id: enterpriseId,
      device_id: deviceId,
    });
};

/**
 * デバイスの再起動
 * @param devices
 * @param enterpriseId
 * @returns
 */
export const rebootDevices = async ({
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
  await Promise.all(
    devices.map(async (device) => {
      await reboot({ device, enterpriseId }).catch((error) => {
        console.error("Error reboot device", error.message);
        throw new Error(error.message);
      });
    })
  );
  revalidatePath(`/${enterpriseId}/devices`);
};
