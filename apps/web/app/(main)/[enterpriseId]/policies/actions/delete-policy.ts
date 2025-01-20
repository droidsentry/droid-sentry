"use server";

import { createAndroidManagementClient } from "@/actions/emm/client";
import { createClient } from "@/lib/supabase/server";
import { Json } from "@/types/database";
import { revalidatePath } from "next/cache";

/**
 * ポリシーを削除
 * @param policyName
 * @returns
 */
export const deletePolicy = async (
  enterpriseId: string,
  policyIdentifier: string
) => {
  if (policyIdentifier === "default") {
    throw new Error("デフォルトポリシーは削除できません。");
  }
  //認証
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  // DBから対象のポリシーを使用している端末を取得
  const devices = await getDevicesByPolicyIdentifier(
    enterpriseId,
    policyIdentifier
  );

  // あればGoogle側デフォルトポリシーに変更する。
  // 変更したらDBにも反映
  if (devices) {
    for (const device of devices) {
      const deviceIdentifier = device.deviceIdentifier;
      if (!deviceIdentifier) continue;
      await updateDevicePolicyToDefault({
        enterpriseId,
        deviceIdentifier: deviceIdentifier,
      });
    }
  }

  // GoogleとDBからポリシーを削除
  await deletePolicyFromGoogleAndDB(enterpriseId, policyIdentifier);
};

/**
 * 選択したポリシーを削除
 * @param policyNames
 * @returns
 */
export const deleteSelectedPolicies = async (
  enterpriseId: string,
  deletePolicyIdentifierList: string[]
) => {
  for (const policyIdentifier of deletePolicyIdentifierList) {
    // デフォルトポリシーは削除できないのでスキップ
    if (policyIdentifier === "default") continue;
    await deletePolicy(enterpriseId, policyIdentifier);
  }
  revalidatePath(`/${enterpriseId}/policies`);
};

/**
 * ポリシーIDから端末を取得
 * @param policyId
 * @returns
 */
async function getDevicesByPolicyIdentifier(
  enterpriseId: string,
  policyIdentifier: string
) {
  const supabase = await createClient();
  const { data: devices } = await supabase
    .from("devices")
    .select(
      `
    deviceIdentifier:device_identifier,
    policyIdentifier:policy_identifier
  `
    )
    .match({
      enterprise_id: enterpriseId,
      policy_identifier: policyIdentifier,
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
  deviceIdentifier,
}: {
  enterpriseId: string;
  deviceIdentifier: string;
}) {
  const name = `enterprises/${enterpriseId}/devices/${deviceIdentifier}`;
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
 * @param policyName
 * @return policyName
 */
async function deletePolicyFromGoogleAndDB(
  enterpriseId: string,
  policyIdentifier: string
) {
  const name = `enterprises/${enterpriseId}/policies/${policyIdentifier}`;
  console.log("name", name);
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
  console.log("res.data", res.data);

  // DBからポリシーを削除
  const supabase = await createClient();
  const { error } = await supabase.from("policies").delete().match({
    enterprise_id: enterpriseId,
    policy_identifier: policyIdentifier,
  });
  if (error) {
    console.error(error);
    throw new Error("Failed to delete policy from Supabase");
  }
}
