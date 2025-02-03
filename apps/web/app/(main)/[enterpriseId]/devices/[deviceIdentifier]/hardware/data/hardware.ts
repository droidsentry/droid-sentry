import "server-only";

import { createClient } from "@/lib/supabase/server";
import {
  AndroidManagementDevice,
  DisplaysType,
  HardwareInfoType,
} from "@/app/types/device";

export const hardwareInfoItems = [
  {
    label: "brand",
    title: "ブランド",
    explanation: "デバイスのブランド。例:Google",
  },
  {
    label: "model",
    title: "モデル",
    explanation: "デバイスのモデル。例:Pixel 7",
  },
  {
    label: "hardware",
    title: "ハードウェア",
    explanation: "デバイスのハードウェア。例:blueline",
  },
  {
    label: "manufacturer",
    title: "メーカー",
    explanation: "デバイスのメーカー.例:Google",
  },
  {
    label: "serialNumber",
    title: "シリアル番号",
    explanation: "デバイスのシリアル番号.例:93VX1YBQL",
  },
  {
    label: "deviceBasebandVersion",
    title: "デバイスベースバンドバージョン",
    explanation:
      "デバイスのベースバンドバージョン。例:g845-00194-210812-B-7635520",
  },
];
const displaysItems = [
  {
    label: "name",
    title: "ディスプレイ名",
    explanation: "デバイスのディスプレイ名.例:内蔵スクリーン",
  },
  {
    label: "displayId",
    title: "ディスプレイID",
    explanation: "デバイスのディスプレイID.例:1",
  },
  {
    label: "state",
    title: "ディスプレイの状態",
    explanation: "デバイスのディスプレイの状態.例:ON",
  },
  {
    label: "width",
    title: "ディスプレイの幅",
    explanation: "デバイスのディスプレイの幅.例:1080",
  },
  {
    label: "height",
    title: "ディスプレイの高さ",
    explanation: "デバイスのディスプレイの高さ.例:2160",
  },
  {
    label: "density",
    title: "ディスプレイの密度",
    explanation: "デバイスのディスプレイの密度.例:440",
  },
  {
    label: "refreshRate",
    title: "ディスプレイのリフレッシュレート(Hz)",
    explanation: "デバイスのディスプレイのリフレッシュレート.例:60",
  },
];
const hardwareTemperaturesItems = [
  {
    label: "cpuShutdownTemperatures",
    title: "CPUシャットダウン温度",
    explanation:
      "デバイスの各CPUのシャットダウン温度.例:[125, 125, 125, 125, 125, 125, 125, 125]",
  },
  {
    label: "gpuShutdownTemperatures",
    title: "GPUシャットダウン温度",
    explanation: "デバイスの各GPUのシャットダウン温度.例:[125, 125]",
  },
  {
    label: "skinShutdownTemperatures",
    title: "スキンシャットダウン温度",
    explanation: "デバイスのスキンのシャットダウン温度.例:[55]",
  },
  {
    label: "cpuThrottlingTemperatures",
    title: "CPUスロットリング温度",
    explanation:
      "デバイスの各CPUのスロットリング温度.例:[95, 95, 95, 95, 95, 95, 95, 95]",
  },
  {
    label: "gpuThrottlingTemperatures",
    title: "GPUスロットリング温度",
    explanation: "デバイスの各GPUのスロットリング温度.例:[95, 95]",
  },
  {
    label: "skinThrottlingTemperatures",
    title: "スキンスロットリング温度",
    explanation: "デバイスのスキンのスロットリング温度.例:[45]",
  },
  {
    label: "batteryShutdownTemperatures",
    title: "バッテリーシャットダウン温度",
    explanation: "デバイスのバッテリーのシャットダウン温度.例:[60]",
  },
  {
    label: "batteryThrottlingTemperatures",
    title: "バッテリースロットリング温度",
    explanation: "デバイスのバッテリーのスロットリング温度.例:[-3.4028235e38]",
  },
];

export const getHardwareInfo = async ({
  enterpriseId,
  deviceIdentifier,
}: {
  enterpriseId: string;
  deviceIdentifier: string;
}) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("devices")
    .select(
      `
      device:device_data
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

  const deviceSource = data.device as AndroidManagementDevice;
  const hardwareInfo = deviceSource.hardwareInfo;
  const hardwareInfoSource = hardwareInfo
    ? hardwareInfoItems.map((hardwareItem) => ({
        ...hardwareItem,
        value: hardwareInfo[hardwareItem.label as keyof HardwareInfoType] as
          | string
          | null,
      }))
    : null;

  const lastStatusReportTime = deviceSource.lastStatusReportTime;

  const displays = deviceSource.displays;
  const displaysSource = displays
    ? displays.map((display) =>
        displaysItems.map((displaysItem) => ({
          ...displaysItem,
          value: display[displaysItem.label as keyof DisplaysType] as
            | string
            | number
            | null,
        }))
      )
    : null;

  const hardwareTemperaturesSource = hardwareInfo
    ? hardwareTemperaturesItems.map((hardwareItem) => ({
        ...hardwareItem,
        value: hardwareInfo[hardwareItem.label as keyof HardwareInfoType] as
          | number[]
          | null,
      }))
    : null;

  return {
    hardwareInfoSource,
    hardwareTemperaturesSource,
    displaysSource,
    lastStatusReportTime,
  };
};

// export const hardwareInfo = {
//   model: "Pixel 3",
//   hardware: "blueline",
//   manufacturer: "Google",
//   serialNumber: "93VX1YBQL",
//   deviceBasebandVersion: "g845-00194-210812-B-7635520",
//   cpuShutdownTemperatures: [125, 125, 125, 125, 125, 125, 125, 125],
//   gpuShutdownTemperatures: [125, 125],
//   skinShutdownTemperatures: undefined,
//   // skinShutdownTemperatures: [55],
//   cpuThrottlingTemperatures: [95, 95, 95, 95, 95, 95, 95, 95],
//   gpuThrottlingTemperatures: [95, 95],
//   skinThrottlingTemperatures: [45],
//   batteryShutdownTemperatures: [60],
//   batteryThrottlingTemperatures: [-3.4028235e38],
// } as HardwareInfoType;

// export const hardwareInfoSample = hardwareInfoItems.map((hardwareItem) => ({
//   ...hardwareItem,
//   value: hardwareInfo[hardwareItem.label as keyof HardwareInfoType] ?? null,
// }));

// export const hardwareTemperaturesSample = hardwareTemperaturesItems.map(
//   (hardwareItem) => ({
//     ...hardwareItem,
//     value: hardwareInfo[hardwareItem.label as keyof HardwareInfoType] as
//       | number[]
//       | null,
//   })
// );
