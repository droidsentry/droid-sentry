"use server";

import { createAndroidManagementClient } from "@/actions/emm/client";
import { createClient } from "@/lib/supabase/server";
import { Json } from "@/types/database";
import { revalidatePath } from "next/cache";

const remoteLook = async ({
  deviceIdentifier,
  enterpriseId,
}: {
  deviceIdentifier: string;
  enterpriseId: string;
}) => {
  const supabase = await createClient();
  const androidmanagement = await createAndroidManagementClient();
  const name = `enterprises/${enterpriseId}/devices/${deviceIdentifier}`;
  const requestBody = {
    type: "LOCK",
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
 * デバイスのロック
 * @param deviceIdentifier
 * @param enterpriseId
 * @returns
 */
export const remoteLookDevices = async ({
  deviceIdentifiers,
  enterpriseId,
}: {
  deviceIdentifiers: string[];
  enterpriseId: string;
}) => {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not found");
  }
  // Promise.all()を使用して、すべての非同期処理の完了を待機
  await Promise.all(
    deviceIdentifiers.map(async (deviceIdentifier) => {
      await remoteLook({ deviceIdentifier, enterpriseId }).catch((error) => {
        console.error("Error remote look device", error.message);
        throw new Error(error.message);
      });
    })
  );
  revalidatePath(`/${enterpriseId}/devices`);
};
