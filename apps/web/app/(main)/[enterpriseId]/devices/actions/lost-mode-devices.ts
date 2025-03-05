"use server";

import { createAndroidManagementClient } from "@/actions/emm/client";
import { DeviceLostModeSchema } from "@/app/schema/devices";
import { DeviceLostMode } from "@/app/types/device";
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
  deviceIdentifier: string,
  formData: DeviceLostMode
) => {
  const name = `enterprises/${enterpriseId}/devices/${deviceIdentifier}`;
  const androidmanagement = await createAndroidManagementClient();
  const {
    lostOrganization,
    lostMessage,
    lostPhoneNumber,
    lostEmailAddress,
    lostStreetAddress,
  } = formData;
  const requestBody = {
    type: "START_LOST_MODE",
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

export const startLostModeSelectedDevice = async (
  enterpriseId: string,
  deviceIdentifier: string,
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

  await startLostMode(enterpriseId, deviceIdentifier, parsedFormData.data).then(
    () => {
      revalidatePath(`/${enterpriseId}/devices`);
    }
  );
};

/**
 * 選択したデバイスのロストモードを解除する
 * @param
 * @returns
 */
export const stopLostModeSelectedDevice = async (
  enterpriseId: string,
  deviceIdentifier: string
) => {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not found");
  }

  const name = `enterprises/${enterpriseId}/devices/${deviceIdentifier}`;
  const androidmanagement = await createAndroidManagementClient();
  const requestBody = {
    type: "STOP_LOST_MODE",
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
