"use server";

import { createAndroidManagementClient } from "@/lib/emm/client";
import { createClient } from "@/lib/supabase/server";
import { Json } from "@/types/database";
import { revalidatePath } from "next/cache";

export const getPolicyList = async (enterpriseId: string) => {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("ユーザーが見つかりません");
  }
  const { data, error } = await supabase
    .from("policies")
    .select(
      `
      policyId:policy_id,
      policyIdentifier:policy_identifier,
      policyDisplayName:policy_display_name
    `
    )
    .eq("enterprise_id", enterpriseId);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const changePolicyDevices = async (
  enterpriseId: string,
  deviceIdentifiers: string[],
  policyIdentifier: string
) => {
  // ５秒待機
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  for (const deviceIdentifier of deviceIdentifiers) {
    await updateDevicePolicy(enterpriseId, deviceIdentifier, policyIdentifier);
  }
  revalidatePath(`/${enterpriseId}/devices`);
};

async function updateDevicePolicy(
  enterpriseId: string,
  deviceIdentifier: string,
  policyIdentifier: string
) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("ユーザーが見つかりません");
  }
  const name = `enterprises/${enterpriseId}/devices/${deviceIdentifier}`;
  const policyName = `${policyIdentifier}`;
  const requestBody = {
    policyName,
  };
  const androidManagementClient = await createAndroidManagementClient();
  await androidManagementClient.enterprises.devices
    .patch({
      name,
      updateMask: "policyName",
      requestBody,
    })
    .then(async (res) => {
      const { error: devicesError } = await supabase
        .from("devices")
        .update({
          requested_policy_identifier: policyIdentifier,
          updated_at: new Date().toISOString(),
          device_data: res.data as Json,
        })
        .match({
          device_identifier: deviceIdentifier,
          enterprise_id: enterpriseId,
        });
      if (devicesError) {
        console.error(devicesError);
        throw new Error("Failed to update device on Supabase");
      }
      const { error: devicesHistoriesError } = await supabase
        .from("devices_histories")
        .insert({
          enterprise_id: enterpriseId,
          device_identifier: deviceIdentifier,
          device_request_data: requestBody,
          device_response_data: res.data as Json,
        });
      if (devicesHistoriesError) {
        console.error(devicesHistoriesError);
        throw new Error("Failed to insert devicesHistoriesError on Supabase");
      }
    })
    .catch((error) => {
      console.error(error);
      throw new Error("Failed to update policy on Google");
    });
}
