// import { Tables } from "@/types/database";
import { androidmanagement_v1 } from "googleapis";
import { z } from "zod";
import { DevicesTableSchema } from "../(main)/schema/devices";

export type AndroidManagementDevice = androidmanagement_v1.Schema$Device;
export type ListDevicesResponse =
  androidmanagement_v1.Schema$ListDevicesResponse;
export type DeviceTableType = z.infer<typeof DevicesTableSchema>;

// route.tsで使用
export type DeviceOperation = androidmanagement_v1.Schema$Operation;
