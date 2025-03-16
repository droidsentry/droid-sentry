"use server";

import { AndroidManagementDevice } from "@/app/types/device";
import { createClient } from "@/lib/supabase/server";

export const getHardwareInfo = async ({
  enterpriseId,
  deviceId,
}: {
  enterpriseId: string;
  deviceId: string;
}) => {
  // 5秒待ってからデータを返す
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("ユーザーが見つかりません");
  }
  const { data, error } = await supabase
    .from("devices")
    .select(
      `
      deviceDetails:device_details
      `
    )
    .match({
      enterprise_id: enterpriseId,
      device_identifier: deviceId,
    })
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  const deviceSource = data.device as AndroidManagementDevice;

  return deviceSource;
};

export const getDevicePolicyInfo = async ({
  enterpriseId,
  deviceIdentifier,
}: {
  enterpriseId: string;
  deviceIdentifier: string;
}) => {
  // 5秒待ってからデータを返す
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("ユーザーが見つかりません");
  }
  const { data, error } = await supabase
    .from("devices")
    .select(
      `
      device:device_data,
      currentPolicy:policies!devices_policy_reference_fkey(
        policyDisplayName:policy_display_name
        ),
      requestedPolicy:policies!devices_enterprise_id_requested_policy_identifier_fkey(
        requestedPolicyDisplayName:policy_display_name
        )
      `
    )
    .match({
      enterprise_id: enterpriseId,
      device_identifier: deviceIdentifier,
    })
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
};

export const getDeviceApplicationInfo = async ({
  enterpriseId,
  deviceIdentifier,
}: {
  enterpriseId: string;
  deviceIdentifier: string;
}) => {
  // 5秒待ってからデータを返す
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("ユーザーが見つかりません");
  }
  const { data, error } = await supabase
    .from("application_reports")
    .select(
      `
      ...devices(
        device_data->>lastStatusReportTime
      ),
      applicationReportDate:application_report_data,
      createdAt:created_at,
      updatedAt:updated_at
      `
    )
    .match({
      enterprise_id: enterpriseId,
      device_identifier: deviceIdentifier,
    })
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
};
