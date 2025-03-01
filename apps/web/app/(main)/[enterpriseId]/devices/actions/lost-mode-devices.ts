"use server";

import { createAndroidManagementClient } from "@/actions/emm/client";
import { createClient } from "@/lib/supabase/server";
import { Json } from "@/types/database";
/**
 * 選択したデバイスをロストモードにする
 * @param deviceNames
 * @returns
 */
export const startLostModeSelectedDevice = async (
  enterpriseId: string,
  deviceIdentifier: string
) => {
  const name = `enterprises/${enterpriseId}/devices/${deviceIdentifier}`;
  const androidmanagement = await createAndroidManagementClient();
  const requestBody = {
    type: "START_LOST_MODE",
    startLostModeParams: {
      lostOrganization: {
        defaultMessage: "test 会社",
        localizedMessages: {
          "ja-JP": "test 会社",
        },
      },
      lostMessage: {
        defaultMessage: "端末が紛失しました。連絡お願いします。",
        localizedMessages: {
          "ja-JP": "端末が紛失しました。連絡お願いします。",
        },
      },
      lostPhoneNumber: {
        defaultMessage: "09037549016",
        localizedMessages: {
          "ja-JP": "09037549016",
        },
      },
      lostEmailAddress: "t3kuboki@gmail.com",
      lostStreetAddress: {
        defaultMessage: "東京都渋谷区渋谷1-1-1",
        localizedMessages: {
          "ja-JP": "東京都渋谷区渋谷1-1-1",
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

/**
 * 選択したデバイスをロストモードにする
 * @param
 * @returns
 */
export const stopLostModeSelectedDevice = async (
  enterpriseId: string,
  deviceIdentifier: string
) => {
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
