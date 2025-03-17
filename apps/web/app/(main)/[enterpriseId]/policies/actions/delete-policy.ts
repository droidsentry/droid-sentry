"use server";

import { createAndroidManagementClient } from "@/lib/emm/client";
import { createClient } from "@/lib/supabase/server";
import { Json } from "@/types/database";
import { revalidatePath } from "next/cache";

export const checkDefaultPolicy = async (
  enterpriseId: string,
  policyId: string
) => {
  const supabase = await createClient();
  const { data: policy, error } = await supabase
    .from("policies")
    .select("isDefault:is_default")
    .match({
      enterprise_id: enterpriseId,
      policy_id: policyId,
      is_default: true,
    })
    .single();
  if (error) {
    throw new Error("Failed to check default policy");
  }
  return policy.isDefault;
};

/**
 * ポリシーを削除
 * @param policyName
 * @returns
 */
export const deletePolicy = async (enterpriseId: string, policyId: string) => {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  //デフォルトポリシーは処理をストップ
  const idDefaultPolicy = await checkDefaultPolicy(enterpriseId, policyId);
  if (idDefaultPolicy) {
    throw new Error("Default policy cannot be deleted");
  }

  const devices = await getDevicesByPolicyId(enterpriseId, policyId);
  // あればGoogle側デフォルトポリシーに変更する。
  if (devices) {
    for (const device of devices) {
      const { id, deviceId } = device;
      await updateDevicePolicyToDefault({
        enterpriseId,
        deviceId,
        id,
      });
    }
  }
  // GoogleとDBからポリシーを削除
  await deletePolicyFromGoogleAndDB(enterpriseId, policyId);
};

/**
 * 選択したポリシーを削除
 * @param policyNames
 * @returns
 */
export const deleteSelectedPolicies = async (
  enterpriseId: string,
  deletePolicyIds: string[]
) => {
  for (const policyId of deletePolicyIds) {
    await deletePolicy(enterpriseId, policyId);
  }
  revalidatePath(`/${enterpriseId}/policies`);
};

/**
 * ポリシーIDから端末を取得
 * @param policyId
 * @returns
 */
async function getDevicesByPolicyId(enterpriseId: string, policyId: string) {
  const supabase = await createClient();
  const { data: devices } = await supabase
    .from("devices")
    .select(
      `
    id,
    deviceId:device_id
  `
    )
    .match({
      enterprise_id: enterpriseId,
      policy_id: policyId,
    });
  return devices;
}

/**
 * 端末のポリシーをデフォルトポリシーに変更
 * @param deviceName
 * @return void
 */
async function updateDevicePolicyToDefault({
  enterpriseId,
  deviceId,
  id,
}: {
  enterpriseId: string;
  deviceId: string;
  id: string;
}) {
  const name = `enterprises/${enterpriseId}/devices/${deviceId}`;
  const requestBody = {
    policyName: "default",
  };
  const supabase = await createClient();
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
          policy_identifier: "default",
          requested_policy_identifier: "default",
          updated_at: new Date().toISOString(),
          device_data: res.data as Json,
        })
        .match({
          enterprise_id: enterpriseId,
          id,
          device_id: deviceId,
        });
      if (devicesError) {
        console.error(devicesError);
        throw new Error("Failed to update device on Supabase");
      }

      const { error: devicesHistoriesError } = await supabase
        .from("device_history")
        .insert({
          device_uuid: id,
          request_details: requestBody,
          response_details: res.data as Json,
        });
      if (devicesHistoriesError) {
        console.error(devicesError);
        throw new Error("Failed to insert devicesHistoriesError on Supabase");
      }
    })
    .catch((error) => {
      console.error(error);
      throw new Error("Failed to update policy on Google");
    });
}

/**
 * GoogleとDBからポリシーを削除
 * @param enterpriseId
 * @param policyId
 * @returns
 */
async function deletePolicyFromGoogleAndDB(
  enterpriseId: string,
  policyId: string
) {
  const name = `enterprises/${enterpriseId}/policies/${policyId}`;
  // Googleでポリシーを削除
  const androidManagementClient = await createAndroidManagementClient();
  const res = await androidManagementClient.enterprises.policies
    .delete({
      name,
    })
    .catch((error) => {
      console.error(error);
      throw new Error("Failed to delete policy from Google");
    });

  // DBからポリシーを削除
  const supabase = await createClient();
  const { error } = await supabase.from("policies").delete().match({
    enterprise_id: enterpriseId,
    policy_id: policyId,
  });
  if (error) {
    throw new Error("Failed to delete policy from Supabase");
  }
}
