// import { Tables } from "@/types/database";
import { androidmanagement_v1 } from "googleapis";
import { z } from "zod";
import {
  getDeviceApplicationInfo,
  getDevicePolicyInfo,
  getHardwareInfo,
} from "../(main)/[enterpriseId]/devices/[deviceId]/actions/device";
import { getPolicyDisplayName } from "../(main)/[enterpriseId]/devices/[deviceId]/actions/policy";
import { getHardwareStatus } from "../(main)/[enterpriseId]/devices/[deviceId]/hardware-info/hardware-status";
import {
  DeviceLostModeSchema,
  DeviceResetPasswordSchema,
} from "../schemas/devices";
import { getDevicesData } from "../(main)/[enterpriseId]/devices/actions/device";

export type AndroidManagementDevice = androidmanagement_v1.Schema$Device;
export type ListDevicesResponse =
  androidmanagement_v1.Schema$ListDevicesResponse;

export type DeviceTableType = Awaited<
  ReturnType<typeof getDevicesData>
>[number];

export type DisplaysType = androidmanagement_v1.Schema$Display;
export type HardwareInfoType = androidmanagement_v1.Schema$HardwareInfo;
export type HardwareInfoSourceType = Awaited<
  ReturnType<typeof getHardwareInfo>
>;
export type DevicePolicyInfoType = Awaited<
  ReturnType<typeof getDevicePolicyInfo>
>;
export type ApplicationInfoType = Awaited<
  ReturnType<typeof getDeviceApplicationInfo>
>;
export type ApplicationReportType =
  androidmanagement_v1.Schema$ApplicationReport;

export type PolicyDisplayNameType = Awaited<
  ReturnType<typeof getPolicyDisplayName>
>;

export type HardwareStatusType = androidmanagement_v1.Schema$HardwareStatus;
export type HardwareStatusSourceType = Awaited<
  ReturnType<typeof getHardwareStatus>
>;
export type ChartType = {
  date: string;
  [key: string]: string | null;
};

// route.tsで使用
export type DeviceOperation = androidmanagement_v1.Schema$Operation;

export type DeviceResetPassword = z.infer<typeof DeviceResetPasswordSchema>;
export type DeviceLostMode = z.infer<typeof DeviceLostModeSchema>;
