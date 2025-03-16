"use server";

import { createAndroidManagementClient } from "@/lib/emm/client";
import { DeviceResetPasswordSchema } from "@/app/schemas/devices";
import { DeviceResetPassword, DeviceTableType } from "@/app/types/device";
import { createClient } from "@/lib/supabase/server";
import { Json } from "@/types/database";
import { revalidatePath } from "next/cache";

const resetPassword = async ({
  newPassword,
  device,
  enterpriseId,
}: {
  newPassword: string;
  device: DeviceTableType;
  enterpriseId: string;
}) => {
  const { deviceId } = device;
  const supabase = await createClient();
  const androidmanagement = await createAndroidManagementClient();
  const name = `enterprises/${enterpriseId}/devices/${deviceId}`;
  const type = "RESET_PASSWORD";
  const requestBody = {
    type,
    newPassword,
    resetPasswordFlags: ["LOCK_NOW"],
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
      device_uuid: deviceId,
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
 * デバイスのパスワードリセット
 * @param deviceIdentifier
 * @param enterpriseId
 * @returns
 */
export const resetPasswordDevices = async ({
  formData,
  devices,
  enterpriseId,
}: {
  formData: DeviceResetPassword;
  devices: DeviceTableType[];
  enterpriseId: string;
}) => {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not found");
  }

  const parsedPassword =
    await DeviceResetPasswordSchema.safeParseAsync(formData);
  if (parsedPassword.success === false) {
    throw new Error("Invalid password");
  }
  const { password: newPassword } = parsedPassword.data;

  await Promise.all(
    devices.map(async (device) => {
      await resetPassword({
        newPassword,
        device,
        enterpriseId,
      }).catch((error) => {
        console.error("Error reset password", error.message);
        throw new Error(error.message);
      });
    })
  );
  revalidatePath(`/${enterpriseId}/devices`);
};
