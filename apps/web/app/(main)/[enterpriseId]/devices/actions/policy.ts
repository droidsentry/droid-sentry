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
      policyId:policy_id,
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
  deviceIds: string[],
  policyId: string
) => {
  // ５秒待機
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  for (const deviceId of deviceIds) {
    await updateDevicePolicy(enterpriseId, deviceId, policyId);
  }
  revalidatePath(`/${enterpriseId}/devices`);
};

async function updateDevicePolicy(
  enterpriseId: string,
  deviceId: string,
  policyId: string
) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("ユーザーが見つかりません");
  }
  const name = `enterprises/${enterpriseId}/devices/${deviceId}`;
  const policyName = `${policyId}`;
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
      const { data, error: devicesError } = await supabase
        .from("devices")
        .update({
          requested_policy_id: policyId,
          updated_at: new Date().toISOString(),
          device_details: res.data as Json,
        })
        .match({
          device_id: deviceId,
          enterprise_id: enterpriseId,
        })
        .select("id")
        .single();
      if (devicesError) {
        console.error(devicesError);
        throw new Error("Failed to update device on Supabase");
      }
      const { error: devicesHistoriesError } = await supabase
        .from("device_history")
        .insert({
          device_uuid: data.id,
          request_details: requestBody,
          response_details: res.data as Json,
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
