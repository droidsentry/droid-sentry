// import { Tables } from "@/types/database";
import { androidmanagement_v1 } from "googleapis";
import { z } from "zod";
import { DevicesTableSchema } from "../schema/devices";
import { getHardwareInfo } from "../(main)/[enterpriseId]/devices/[deviceIdentifier]/hardware/data/hardware";
import { getHardwareStatus } from "../(main)/[enterpriseId]/devices/[deviceIdentifier]/hardware/data/hardware-status";

export type AndroidManagementDevice = androidmanagement_v1.Schema$Device;
export type ListDevicesResponse =
  androidmanagement_v1.Schema$ListDevicesResponse;
export type DeviceTableType = z.infer<typeof DevicesTableSchema>;

export type DisplaysType = androidmanagement_v1.Schema$Display;
export type HardwareInfoType = androidmanagement_v1.Schema$HardwareInfo;
export type HardwareInfoSourceType = Awaited<
  ReturnType<typeof getHardwareInfo>
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
