"use server";

import { createAndroidManagementClient } from "@/lib/emm/client";
import { DeviceLostModeSchema } from "@/lib/schemas/devices";
import { DeviceLostMode, DeviceTableType } from "@/lib/types/device";
import { createClient } from "@/lib/supabase/server";
import { Json } from "@/types/database";
import { revalidatePath } from "next/cache";
/**
 * 選択したデバイスをロストモードにする
 * @param deviceNames
 * @returns
 */
export const startLostMode = async (
  enterpriseId: string,
  device: DeviceTableType,
  formData: DeviceLostMode
) => {
  const { deviceId } = device;
  const name = `enterprises/${enterpriseId}/devices/${deviceId}`;
  const androidmanagement = await createAndroidManagementClient();
  const {
    lostOrganization,
    lostMessage,
    lostPhoneNumber,
    lostEmailAddress,
    lostStreetAddress,
  } = formData;
  const type = "START_LOST_MODE";
  const requestBody = {
    type,
    startLostModeParams: {
      lostOrganization: {
        defaultMessage: lostOrganization,
        localizedMessages: {
          "ja-JP": lostOrganization,
          "en-US": lostOrganization,
        },
      },
      lostMessage: {
        defaultMessage: lostMessage,
        localizedMessages: {
          "ja-JP": lostMessage,
          "en-US": lostMessage,
        },
      },
      lostPhoneNumber: {
        defaultMessage: lostPhoneNumber,
        localizedMessages: {
          "ja-JP": lostPhoneNumber,
          "en-US": lostPhoneNumber,
        },
      },
      lostEmailAddress: lostEmailAddress,
      lostStreetAddress: {
        defaultMessage: lostStreetAddress,
        localizedMessages: {
          "ja-JP": lostStreetAddress,
          "en-US": lostStreetAddress,
        },
      },
    },
  };
  const { data } = await androidmanagement.enterprises.devices
    .issueCommand({
      name,
      requestBody,
    })
    .catch((error) => {
      console.error("Error lost mode device", error.message);
      throw new Error(error.message);
    });

  const supabase = await createClient();
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
      enterprise_id: enterpriseId,
      device_id: deviceId,
    });
};

export const startLostModeSelectedDevice = async (
  enterpriseId: string,
  devices: DeviceTableType[],
  formData: DeviceLostMode
) => {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not found");
  }

  const parsedFormData = await DeviceLostModeSchema.safeParseAsync(formData);
  if (parsedFormData.success === false) {
    throw new Error("Invalid form data");
  }

  await Promise.all(
    devices.map(async (device) => {
      await startLostMode(enterpriseId, device, parsedFormData.data).catch(
        (error) => {
          console.error("Error lost mode device", error.message);
          throw new Error(error.message);
        }
      );
    })
  );
  revalidatePath(`/${enterpriseId}/devices`);
};

export const stopLostMode = async (
  enterpriseId: string,
  device: DeviceTableType
) => {
  const { deviceId } = device;
  const name = `enterprises/${enterpriseId}/devices/${deviceId}`;
  const androidmanagement = await createAndroidManagementClient();
  const type = "STOP_LOST_MODE";
  const requestBody = {
    type,
  };
  const { data } = await androidmanagement.enterprises.devices
    .issueCommand({
      name,
      requestBody,
    })
    .catch((error) => {
      console.error("Error lost mode device", error.message);
      throw new Error(error.message);
    });

  const operationName = data.name?.split("/operations/")[1] ?? null;
  const supabase = await createClient();
  await supabase
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
};

/**
 * 選択したデバイスのロストモードを解除する
 * @param
 * @returns
 */
export const stopLostModeSelectedDevice = async (
  enterpriseId: string,
  devices: DeviceTableType[]
) => {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not found");
  }

  await Promise.all(
    devices.map(async (device) => {
      await stopLostMode(enterpriseId, device).catch((error) => {
        console.error("Error stop lost mode device", error.message);
        throw new Error(error.message);
      });
    })
  );
  revalidatePath(`/${enterpriseId}/devices`);
};
