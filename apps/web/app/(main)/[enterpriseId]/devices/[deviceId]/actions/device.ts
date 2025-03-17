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
      device_id: deviceId,
    })
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  const deviceSource = data.deviceDetails as AndroidManagementDevice;

  return deviceSource;
};

export const getDevicePolicyInfo = async ({
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
      device:device_details,
      ...policies!devices_policy_id_fkey(
        policyDisplayName:policy_display_name
        ),
      ...policies!devices_requested_policy_id_fkey(
        requestedPolicyDisplayName:policy_display_name
        )
      `
    )
    .match({
      enterprise_id: enterpriseId,
      device_id: deviceId,
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
    .from("device_application_reports")
    .select(
      `
      ...devices(
        device_details->>lastStatusReportTime
      ),
      applicationReportDate:report_data,
      createdAt:created_at,
      updatedAt:updated_at
      `
    )
    .match({
      enterprise_id: enterpriseId,
      device_id: deviceId,
    })
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
};
