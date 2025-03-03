"use server";

import { createAndroidManagementClient } from "@/actions/emm/client";
import { createClient } from "@/lib/supabase/server";
import { Json } from "@/types/database";
import { revalidatePath } from "next/cache";
import { selectDevicesTableFields } from "../data/select-device-fields";
import { passwordUpdateSchema } from "@/app/schema/auth";
import { DeviceResetPasswordSchema } from "@/app/schema/devices";
import { DeviceResetPassword } from "@/app/types/device";

const resetPassword = async ({
  newPassword,
  deviceIdentifier,
  enterpriseId,
}: {
  newPassword: string;
  deviceIdentifier: string;
  enterpriseId: string;
}) => {
  const supabase = await createClient();
  const androidmanagement = await createAndroidManagementClient();
  const name = `enterprises/${enterpriseId}/devices/${deviceIdentifier}`;
  const requestBody = {
    type: "RESET_PASSWORD",
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
  const recordDevice = await supabase
    .from("devices")
    .update({
      operation_data: data as Json,
      updated_at: new Date().toISOString(),
    })
    .match({
      enterprise_Id: enterpriseId,
      device_identifier: deviceIdentifier,
    });
  const recordOperation = await supabase.from("operations").insert({
    device_identifier: deviceIdentifier,
    enterprise_id: enterpriseId,
    operation_name: operationName,
    operation_request_data: requestBody,
    operation_response_data: data as Json,
  });
  Promise.all([recordDevice, recordOperation]).catch((error) => {
    console.error("Error record operation", error.message);
    throw new Error(error.message);
  });
};

/**
 * デバイスのパスワードリセット
 * @param deviceIdentifier
 * @param enterpriseId
 * @returns
 */
export const resetPasswordDevice = async ({
  formData,
  deviceIdentifier,
  enterpriseId,
}: {
  formData: DeviceResetPassword;
  deviceIdentifier: string;
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

  await resetPassword({ newPassword, deviceIdentifier, enterpriseId }).then(
    () => {
      revalidatePath(`/${enterpriseId}/devices`);
    }
  );
};
