import "server-only";

import { createClient } from "@/lib/supabase/server";
import { HardwareStatusType } from "@/app/types/device";
import { ChartConfig } from "@/components/ui/chart";

type Chart = {
  date: string;
  [key: string]: string | null;
};
type KeyType =
  | "cpuUsage"
  | "cpuTemperature"
  | "gpuTemperature"
  | "batteryTemperature"
  | "skinTemperature"
  | "fanSpeed";

/**
 * ハードウェアステータスを取得
 * @param enterpriseId 企業ID
 * @param deviceIdentifier デバイスID
 * @returns ハードウェアステータス
 */
export const getHardwareStatus = async ({
  enterpriseId,
  deviceIdentifier,
}: {
  enterpriseId: string;
  deviceIdentifier: string;
}) => {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  if (!user) {
    throw new Error("ユーザーが見つかりません");
  }
  const { data, error } = await supabase
    .from("device_hardware_status")
    .select(
      `
      hardwareStatus:hardware_status
    `
    )
    .match({
      enterprise_id: enterpriseId,
      device_identifier: deviceIdentifier,
    })
    .order("create_time", { ascending: true });

  // console.log("data", data);

  if (error) {
    throw new Error(error.message);
  }
  const hardwareStatus = data.map(
    (item) => item.hardwareStatus
  ) as HardwareStatusType[];
  const cpuUsagesChartItem = createHardwareStatusChart(
    hardwareStatus,
    "cpuUsage"
  );
  const cpuTemperaturesChartItem = createHardwareStatusChart(
    hardwareStatus,
    "cpuTemperature"
  );
  const gpuTemperaturesChartItem = createHardwareStatusChart(
    hardwareStatus,
    "gpuTemperature"
  );
  const batteryTemperaturesChartItem = createHardwareStatusChart(
    hardwareStatus,
    "batteryTemperature"
  );
  const skinTemperaturesChartItem = createHardwareStatusChart(
    hardwareStatus,
    "skinTemperature"
  );
  const fanSpeedsChartItem = createHardwareStatusChart(
    hardwareStatus,
    "fanSpeed"
  );
  const hardwareTemperatureAverageChartSource =
    createHardwareTemperatureAverageChart(hardwareStatus);

  return {
    cpuUsagesChartItem,
    cpuTemperaturesChartItem,
    gpuTemperaturesChartItem,
    batteryTemperaturesChartItem,
    skinTemperaturesChartItem,
    fanSpeedsChartItem,
    hardwareTemperatureAverageChartSource,
  };
};

/**
 * CPU使用率のチャートデータを作成
 * @param hardwareStatus ハードウェアステータス
 * @returns  ャートデータ
 */
const createHardwareStatusChart = (
  hardwareStatus: HardwareStatusType[],
  type: KeyType
): { chart: Chart[]; chartConfig: ChartConfig; configCount: number } => {
  let configCount = 0;
  const chart = hardwareStatus
    .map((status) => {
      const result = formatSingleHardwareStatus(status, type);
      configCount = Math.max(configCount, result?.keyCount ?? 0);
      return result?.chart;
    })
    .filter((data): data is Chart => data !== undefined);

  const chartConfig = Object.fromEntries(
    Array.from({ length: configCount }, (_, index) => [
      `${type}${index + 1}`,
      (() => {
        const getLabel = (baseLabel: string) => {
          return configCount < 2 ? baseLabel : `${baseLabel}${index + 1}`;
        };

        switch (type) {
          case "cpuUsage":
            return {
              label: getLabel("CPU") + " 使用率",
              color: `hsl(var(--chart-1))`,
            };
          case "cpuTemperature":
            return {
              label: getLabel("CPU") + " 温度",
              color: `hsl(var(--chart-2))`,
            };
          case "gpuTemperature":
            return {
              label: getLabel("GPU") + " 温度",
              color: `hsl(var(--chart-3))`,
            };
          case "batteryTemperature":
            return {
              label: getLabel("バッテリー") + " 温度",
              color: `hsl(var(--chart-4))`,
            };
          case "skinTemperature":
            return {
              label: getLabel("表面") + " 温度",
              color: `hsl(var(--chart-5))`,
            };
          case "fanSpeed":
            return {
              label: getLabel("ファン") + " RPM",
              color: `hsl(var(--chart-6))`,
            };
          default:
            return {
              label: getLabel(""),
              color: `hsl(var(--chart-1))`,
            };
        }
      })(),
    ])
  ) satisfies ChartConfig;

  return { chart, chartConfig, configCount };
};
/**
 * ハードウェアステータスからチャートデータを作成
 * @param status ハードウェアステータス
 * @returns  チャートデータ
 */
const formatSingleHardwareStatus = (
  status: HardwareStatusType,
  type: KeyType
): { chart: Chart; keyCount: number } | null => {
  if (!status.createTime) return null;
  let keyCount = 1;
  const chart: Chart = {
    date: status.createTime,
  };

  switch (type) {
    case "cpuUsage":
      if (!status.cpuUsages) return null;
      status.cpuUsages.forEach((usageRate, index) => {
        const cpuKey = `${type}${index + 1}` as const;
        chart[cpuKey] = formatUsagePercentage(usageRate);
        keyCount = index + 1;
      });
      break;
    case "cpuTemperature":
      if (!status.cpuTemperatures) return null;
      status.cpuTemperatures.forEach((temperature, index) => {
        const cpuKey = `${type}${index + 1}` as const;
        chart[cpuKey] = temperature.toFixed(2);
        keyCount = index + 1;
      });
      break;
    case "gpuTemperature":
      if (!status.gpuTemperatures) return null;
      status.gpuTemperatures.forEach((temperature, index) => {
        const cpuKey = `${type}${index + 1}` as const;
        chart[cpuKey] = temperature.toFixed(2);
        keyCount = index + 1;
      });
      break;
    case "batteryTemperature":
      if (!status.batteryTemperatures) return null;
      status.batteryTemperatures.forEach((temperature, index) => {
        const cpuKey = `${type}${index + 1}` as const;
        chart[cpuKey] = temperature.toFixed(2);
        keyCount = index + 1;
      });
      break;
    case "skinTemperature":
      if (!status.skinTemperatures) return null;
      status.skinTemperatures.forEach((temperature, index) => {
        const cpuKey = `${type}${index + 1}` as const;
        chart[cpuKey] = temperature.toFixed(2);
        keyCount = index + 1;
      });
      break;
    case "fanSpeed":
      if (!status.fanSpeeds) return null;
      status.fanSpeeds.forEach((speed, index) => {
        const cpuKey = `${type}${index + 1}` as const;
        chart[cpuKey] = speed.toFixed(2);
        keyCount = index + 1;
      });
      break;
  }

  return { chart, keyCount };
};

/**
 * CPU使用率を百分率文字列に変換
 * @param usage CPU使用率
 * @returns 百分率文字列 例："10.00"
 */
const formatUsagePercentage = (usage: number): string => {
  return (usage * 100).toFixed(2);
};

/**
 * ハードウェア温度の平均値を計算
 * @param hardwareStatus ハードウェアステータス
 * @returns ハードウェア温度の平均値
 */
const createHardwareTemperatureAverageChart = (
  hardwareStatus: HardwareStatusType[]
): Chart[] => {
  const chart = hardwareStatus
    .map((status) => {
      return formatHardwareTemperatureAverage(status);
    })
    .filter((data): data is Chart => data !== null);
  return chart;
};
/**
 * ハードウェア温度の平均値を計算
 * @param status ハードウェアステータス
 * @returns ハードウェア温度の平均値
 */
const formatHardwareTemperatureAverage = (status: HardwareStatusType) => {
  if (!status.createTime) return null;
  const chart: Chart = {
    date: status.createTime,
    cpuTemperature: !status.cpuTemperatures
      ? null
      : (
          status.cpuTemperatures.reduce((sum, temp) => sum + temp, 0) /
          status.cpuTemperatures.length
        ).toFixed(2),
    gpuTemperature:
      status.gpuTemperatures?.length === undefined
        ? null
        : (
            status.gpuTemperatures.reduce((sum, temp) => sum + temp, 0) /
            status.gpuTemperatures.length
          ).toFixed(2),
    skinTemperature:
      status.skinTemperatures?.length === undefined
        ? null
        : (
            status.skinTemperatures.reduce((sum, temp) => sum + temp, 0) /
            status.skinTemperatures.length
          ).toFixed(2),
    batteryTemperature:
      status.batteryTemperatures?.length === undefined
        ? null
        : (
            status.batteryTemperatures.reduce((sum, temp) => sum + temp, 0) /
            status.batteryTemperatures.length
          ).toFixed(2),
  };

  return chart;
};

export const hardwareStatusSample = [
  {
    cpuUsages: [
      0.5412371, 0.5084473, 0.45534408, 0.4641044, 0.6258503, 0.59310347,
      0.67168677, 0.6347032,
    ],
    createTime: "2024-12-15T00:00:00.000Z",
    cpuTemperatures: [
      56.100002, 58.4, 52.800003, 52.500004, 51.9, 56.500004, 57.800003, 53.2,
    ],
    gpuTemperatures: [40, 38.7],
    skinTemperatures: [24.196001],
    batteryTemperatures: [22.000002],
  },
  {
    cpuUsages: [
      0.45228618, 0.4438622, 0.35401723, 0.34061357, 0.3480696, 0.31924966,
      0.5245477, 0.46397984,
    ],
    createTime: "2024-12-16T23:02:30.192Z",
    cpuTemperatures: [
      30.2, 29.800001, 31.500002, 29.800001, 31.500002, 31.500002, 29.800001,
      31.2,
    ],
    gpuTemperatures: [27.500002, 27.900002],
    skinTemperatures: [26.834002],
    batteryTemperatures: [25.7],
  },
  {
    cpuUsages: [
      0.46865243, 0.46473438, 0.36237997, 0.35027686, 0.28246206, 0.2582837,
      0.46114534, 0.4099119,
    ],
    createTime: "2024-12-17T23:14:36.154Z",
    cpuTemperatures: [
      29.2, 30.2, 29.500002, 28.500002, 29.500002, 30.800001, 31.800001,
      29.500002,
    ],
    gpuTemperatures: [25.2, 25.2],
    skinTemperatures: [24.776001],
    batteryTemperatures: [23.2],
  },
  {
    cpuUsages: [
      0.44523293, 0.4416398, 0.33852547, 0.3268204, 0.25140733, 0.22966425,
      0.4123576, 0.3672947,
    ],
    createTime: "2024-12-18T23:33:42.154Z",
    cpuTemperatures: [26.6, 27.2, 27.2, 26.2, 27.2, 28.500002, 29.2, 27.500002],
    gpuTemperatures: [22.6, 22.900002],
    skinTemperatures: [22.500002],
    batteryTemperatures: [21.300001],
  },
  {
    cpuUsages: [
      0.43240786, 0.42792407, 0.33070642, 0.314918, 0.23482367, 0.21427628,
      0.38682726, 0.34475118,
    ],
    createTime: "2024-12-19T23:52:32.177Z",
    cpuTemperatures: [
      24.300001, 24.900002, 25.2, 24.300001, 25.6, 26.900002, 25.6, 25.900002,
    ],
    gpuTemperatures: [21.300001, 21.6],
    skinTemperatures: [21.116001],
    batteryTemperatures: [20.300001],
  },
  {
    cpuUsages: [
      0.41240786, 0.40792407, 0.31070642, 0.294918, 0.21482367, 0.19427628,
      0.36682726, 0.32475118,
    ],
    createTime: "2024-12-20T00:12:32.177Z",
    cpuTemperatures: [
      25.300001, 25.900002, 26.2, 25.300001, 26.6, 27.900002, 26.6, 26.900002,
    ],
    gpuTemperatures: [22.300001, 22.6],
    skinTemperatures: [22.116001],
    batteryTemperatures: [21.300001],
  },
  {
    cpuUsages: [
      0.48240786, 0.47792407, 0.38070642, 0.364918, 0.28482367, 0.26427628,
      0.43682726, 0.39475118,
    ],
    createTime: "2024-12-21T01:22:32.177Z",
    cpuTemperatures: [
      28.300001, 28.900002, 29.2, 28.300001, 29.6, 30.900002, 29.6, 29.900002,
    ],
    gpuTemperatures: [24.300001, 24.6],
    skinTemperatures: [23.116001],
    batteryTemperatures: [22.300001],
  },
  {
    cpuUsages: [
      0.52240786, 0.51792407, 0.42070642, 0.404918, 0.32482367, 0.30427628,
      0.47682726, 0.43475118,
    ],
    createTime: "2024-12-22T02:32:32.177Z",
    cpuTemperatures: [
      32.300001, 32.900002, 33.2, 32.300001, 33.6, 34.900002, 33.6, 33.900002,
    ],
    gpuTemperatures: [27.300001, 27.6],
    skinTemperatures: [24.116001],
    batteryTemperatures: [23.300001],
  },
  {
    cpuUsages: [
      0.56240786, 0.55792407, 0.46070642, 0.444918, 0.36482367, 0.34427628,
      0.51682726, 0.47475118,
    ],
    createTime: "2024-12-23T03:42:32.177Z",
    cpuTemperatures: [
      36.300001, 36.900002, 37.2, 36.300001, 37.6, 38.900002, 37.6, 37.900002,
    ],
    gpuTemperatures: [30.300001, 30.6],
    skinTemperatures: [25.116001],
    batteryTemperatures: [24.300001],
  },
  {
    cpuUsages: [
      0.61240786, 0.60792407, 0.51070642, 0.494918, 0.41482367, 0.39427628,
      0.56682726, 0.52475118,
    ],
    createTime: "2024-12-24T04:52:32.177Z",
    cpuTemperatures: [
      41.300001, 41.900002, 42.2, 41.300001, 42.6, 43.900002, 42.6, 42.900002,
    ],
    gpuTemperatures: [33.300001, 33.6],
    skinTemperatures: [26.116001],
    batteryTemperatures: [25.300001],
  },
  {
    cpuUsages: [
      0.58240786, 0.57792407, 0.48070642, 0.464918, 0.38482367, 0.36427628,
      0.53682726, 0.49475118,
    ],
    createTime: "2024-12-25T06:02:32.177Z",
    cpuTemperatures: [
      38.300001, 38.900002, 39.2, 38.300001, 39.6, 40.900002, 39.6, 39.900002,
    ],
    gpuTemperatures: [31.300001, 31.6],
    skinTemperatures: [25.516001],
    batteryTemperatures: [24.800001],
  },
  {
    cpuUsages: [
      0.54240786, 0.53792407, 0.44070642, 0.424918, 0.34482367, 0.32427628,
      0.49682726, 0.45475118,
    ],
    createTime: "2024-12-26T07:12:32.177Z",
    cpuTemperatures: [
      34.300001, 34.900002, 35.2, 34.300001, 35.6, 36.900002, 35.6, 35.900002,
    ],
    gpuTemperatures: [28.300001, 28.6],
    skinTemperatures: [24.716001],
    batteryTemperatures: [24.100001],
  },
  {
    cpuUsages: [
      0.5412371, 0.5084473, 0.45534408, 0.4641044, 0.6258503, 0.59310347,
      0.67168677, 0.6347032,
    ],
    createTime: "2024-12-27T22:48:30.910Z",
    cpuTemperatures: [
      56.100002, 58.4, 52.800003, 52.500004, 51.9, 56.500004, 57.800003, 53.2,
    ],
    gpuTemperatures: [40, 38.7],
    skinTemperatures: [24.196001],
    batteryTemperatures: [22.000002],
  },
  {
    cpuUsages: [
      0.45228618, 0.4438622, 0.35401723, 0.34061357, 0.3480696, 0.31924966,
      0.5245477, 0.46397984,
    ],
    createTime: "2024-12-28T23:02:30.192Z",
    cpuTemperatures: [
      30.2, 29.800001, 31.500002, 29.800001, 31.500002, 31.500002, 29.800001,
      31.2,
    ],
    gpuTemperatures: [27.500002, 27.900002],
    skinTemperatures: [26.834002],
    batteryTemperatures: [25.7],
  },
  {
    cpuUsages: [
      0.46865243, 0.46473438, 0.36237997, 0.35027686, 0.28246206, 0.2582837,
      0.46114534, 0.4099119,
    ],
    createTime: "2024-12-29T23:14:36.154Z",
    cpuTemperatures: [
      29.2, 30.2, 29.500002, 28.500002, 29.500002, 30.800001, 31.800001,
      29.500002,
    ],
    gpuTemperatures: [25.2, 25.2],
    skinTemperatures: [24.776001],
    batteryTemperatures: [23.2],
  },
  {
    cpuUsages: [
      0.44523293, 0.4416398, 0.33852547, 0.3268204, 0.25140733, 0.22966425,
      0.4123576, 0.3672947,
    ],
    createTime: "2024-12-30T23:33:42.154Z",
    cpuTemperatures: [26.6, 27.2, 27.2, 26.2, 27.2, 28.500002, 29.2, 27.500002],
    gpuTemperatures: [22.6, 22.900002],
    skinTemperatures: [22.500002],
    batteryTemperatures: [21.300001],
  },
  {
    cpuUsages: [
      0.43240786, 0.42792407, 0.33070642, 0.314918, 0.23482367, 0.21427628,
      0.38682726, 0.34475118,
    ],
    createTime: "2024-12-31T23:52:32.177Z",
    cpuTemperatures: [
      24.300001, 24.900002, 25.2, 24.300001, 25.6, 26.900002, 25.6, 25.900002,
    ],
    gpuTemperatures: [21.300001, 21.6],
    skinTemperatures: [21.116001],
    batteryTemperatures: [20.300001],
  },
  {
    cpuUsages: [
      0.41240786, 0.40792407, 0.31070642, 0.294918, 0.21482367, 0.19427628,
      0.36682726, 0.32475118,
    ],
    createTime: "2025-01-01T00:12:32.177Z",
    cpuTemperatures: [
      25.300001, 25.900002, 26.2, 25.300001, 26.6, 27.900002, 26.6, 26.900002,
    ],
    gpuTemperatures: [22.300001, 22.6],
    skinTemperatures: [22.116001],
    batteryTemperatures: [21.300001],
  },
  {
    cpuUsages: [
      0.48240786, 0.47792407, 0.38070642, 0.364918, 0.28482367, 0.26427628,
      0.43682726, 0.39475118,
    ],
    createTime: "2025-01-02T01:22:32.177Z",
    cpuTemperatures: [
      28.300001, 28.900002, 29.2, 28.300001, 29.6, 30.900002, 29.6, 29.900002,
    ],
    gpuTemperatures: [24.300001, 24.6],
    skinTemperatures: [23.116001],
    batteryTemperatures: [22.300001],
  },
  {
    cpuUsages: [
      0.52240786, 0.51792407, 0.42070642, 0.404918, 0.32482367, 0.30427628,
      0.47682726, 0.43475118,
    ],
    createTime: "2025-01-03T02:32:32.177Z",
    cpuTemperatures: [
      32.300001, 32.900002, 33.2, 32.300001, 33.6, 34.900002, 33.6, 33.900002,
    ],
    gpuTemperatures: [27.300001, 27.6],
    skinTemperatures: [24.116001],
    batteryTemperatures: [23.300001],
  },
  {
    cpuUsages: [
      0.56240786, 0.55792407, 0.46070642, 0.444918, 0.36482367, 0.34427628,
      0.51682726, 0.47475118,
    ],
    createTime: "2025-01-04T03:42:32.177Z",
    cpuTemperatures: [
      36.300001, 36.900002, 37.2, 36.300001, 37.6, 38.900002, 37.6, 37.900002,
    ],
    gpuTemperatures: [30.300001, 30.6],
    skinTemperatures: [25.116001],
    batteryTemperatures: [24.300001],
  },
  {
    cpuUsages: [
      0.61240786, 0.60792407, 0.51070642, 0.494918, 0.41482367, 0.39427628,
      0.56682726, 0.52475118,
    ],
    createTime: "2025-01-05T04:52:32.177Z",
    cpuTemperatures: [
      41.300001, 41.900002, 42.2, 41.300001, 42.6, 43.900002, 42.6, 42.900002,
    ],
    gpuTemperatures: [33.300001, 33.6],
    skinTemperatures: [26.116001],
    batteryTemperatures: [25.300001],
  },
  {
    cpuUsages: [
      0.58240786, 0.57792407, 0.48070642, 0.464918, 0.38482367, 0.36427628,
      0.53682726, 0.49475118,
    ],
    createTime: "2025-01-06T06:02:32.177Z",
    cpuTemperatures: [
      38.300001, 38.900002, 39.2, 38.300001, 39.6, 40.900002, 39.6, 39.900002,
    ],
    gpuTemperatures: [31.300001, 31.6],
    skinTemperatures: [25.516001],
    batteryTemperatures: [24.800001],
  },
  {
    cpuUsages: [
      0.54240786, 0.53792407, 0.44070642, 0.424918, 0.34482367, 0.32427628,
      0.49682726, 0.45475118,
    ],
    createTime: "2025-01-07T07:12:32.177Z",
    cpuTemperatures: [
      34.300001, 34.900002, 35.2, 34.300001, 35.6, 36.900002, 35.6, 35.900002,
    ],
    gpuTemperatures: [28.300001, 28.6],
    skinTemperatures: [24.716001],
    batteryTemperatures: [24.100001],
  },
  {
    cpuUsages: [
      0.5412371, 0.5084473, 0.45534408, 0.4641044, 0.6258503, 0.59310347,
      0.67168677, 0.6347032,
    ],
    createTime: "2025-01-08T22:48:30.910Z",
    cpuTemperatures: [
      56.100002, 58.4, 52.800003, 52.500004, 51.9, 56.500004, 57.800003, 53.2,
    ],
    gpuTemperatures: [40, 38.7],
    skinTemperatures: [24.196001],
    batteryTemperatures: [22.000002],
  },
  {
    cpuUsages: [
      0.45228618, 0.4438622, 0.35401723, 0.34061357, 0.3480696, 0.31924966,
      0.5245477, 0.46397984,
    ],
    createTime: "2025-01-09T23:02:30.192Z",
    cpuTemperatures: [
      30.2, 29.800001, 31.500002, 29.800001, 31.500002, 31.500002, 29.800001,
      31.2,
    ],
    gpuTemperatures: [27.500002, 27.900002],
    skinTemperatures: [26.834002],
    batteryTemperatures: [25.7],
  },
  {
    cpuUsages: [
      0.46865243, 0.46473438, 0.36237997, 0.35027686, 0.28246206, 0.2582837,
      0.46114534, 0.4099119,
    ],
    createTime: "2025-01-10T23:14:36.154Z",
    cpuTemperatures: [
      29.2, 30.2, 29.500002, 28.500002, 29.500002, 30.800001, 31.800001,
      29.500002,
    ],
    gpuTemperatures: [25.2, 25.2],
    skinTemperatures: [24.776001],
    batteryTemperatures: [23.2],
  },
  {
    cpuUsages: [
      0.44523293, 0.4416398, 0.33852547, 0.3268204, 0.25140733, 0.22966425,
      0.4123576, 0.3672947,
    ],
    createTime: "2025-01-11T23:33:42.154Z",
    cpuTemperatures: [26.6, 27.2, 27.2, 26.2, 27.2, 28.500002, 29.2, 27.500002],
    gpuTemperatures: [22.6, 22.900002],
    skinTemperatures: [22.500002],
    batteryTemperatures: [21.300001],
  },
  {
    cpuUsages: [
      0.43240786, 0.42792407, 0.33070642, 0.314918, 0.23482367, 0.21427628,
      0.38682726, 0.34475118,
    ],
    createTime: "2025-01-12T23:52:32.177Z",
    cpuTemperatures: [
      24.300001, 24.900002, 25.2, 24.300001, 25.6, 26.900002, 25.6, 25.900002,
    ],
    gpuTemperatures: [21.300001, 21.6],
    skinTemperatures: [21.116001],
    batteryTemperatures: [20.300001],
  },
  {
    cpuUsages: [
      0.41240786, 0.40792407, 0.31070642, 0.294918, 0.21482367, 0.19427628,
      0.36682726, 0.32475118,
    ],
    createTime: "2025-01-13T00:12:32.177Z",
    cpuTemperatures: [
      25.300001, 25.900002, 26.2, 25.300001, 26.6, 27.900002, 26.6, 26.900002,
    ],
    gpuTemperatures: [22.300001, 22.6],
    skinTemperatures: [22.116001],
    batteryTemperatures: [21.300001],
  },
  {
    cpuUsages: [
      0.48240786, 0.47792407, 0.38070642, 0.364918, 0.28482367, 0.26427628,
      0.43682726, 0.39475118,
    ],
    createTime: "2025-01-14T01:22:32.177Z",
    cpuTemperatures: [
      28.300001, 28.900002, 29.2, 28.300001, 29.6, 30.900002, 29.6, 29.900002,
    ],
    gpuTemperatures: [24.300001, 24.6],
    skinTemperatures: [23.116001],
    batteryTemperatures: [22.300001],
  },
  {
    cpuUsages: [
      0.52240786, 0.51792407, 0.42070642, 0.404918, 0.32482367, 0.30427628,
      0.47682726, 0.43475118,
    ],
    createTime: "2025-01-15T02:32:32.177Z",
    cpuTemperatures: [
      32.300001, 32.900002, 33.2, 32.300001, 33.6, 34.900002, 33.6, 33.900002,
    ],
    gpuTemperatures: [27.300001, 27.6],
    skinTemperatures: [24.116001],
    batteryTemperatures: [23.300001],
  },
  {
    cpuUsages: [
      0.56240786, 0.55792407, 0.46070642, 0.444918, 0.36482367, 0.34427628,
      0.51682726, 0.47475118,
    ],
    createTime: "2025-01-16T03:42:32.177Z",
    cpuTemperatures: [
      36.300001, 36.900002, 37.2, 36.300001, 37.6, 38.900002, 37.6, 37.900002,
    ],
    gpuTemperatures: [30.300001, 30.6],
    skinTemperatures: [25.116001],
    batteryTemperatures: [24.300001],
  },
  {
    cpuUsages: [
      0.61240786, 0.60792407, 0.51070642, 0.494918, 0.41482367, 0.39427628,
      0.56682726, 0.52475118,
    ],
    createTime: "2025-01-17T04:52:32.177Z",
    cpuTemperatures: [
      41.300001, 41.900002, 42.2, 41.300001, 42.6, 43.900002, 42.6, 42.900002,
    ],
    gpuTemperatures: [33.300001, 33.6],
    skinTemperatures: [26.116001],
    batteryTemperatures: [25.300001],
  },
  {
    cpuUsages: [
      0.58240786, 0.57792407, 0.48070642, 0.464918, 0.38482367, 0.36427628,
      0.53682726, 0.49475118,
    ],
    createTime: "2025-01-18T06:02:32.177Z",
    cpuTemperatures: [
      38.300001, 38.900002, 39.2, 38.300001, 39.6, 40.900002, 39.6, 39.900002,
    ],
    gpuTemperatures: [31.300001, 31.6],
    skinTemperatures: [25.516001],
    batteryTemperatures: [24.800001],
  },
  {
    cpuUsages: [
      0.54240786, 0.53792407, 0.44070642, 0.424918, 0.34482367, 0.32427628,
      0.49682726, 0.45475118,
    ],
    createTime: "2025-01-19T07:12:32.177Z",
    cpuTemperatures: [
      34.300001, 34.900002, 35.2, 34.300001, 35.6, 36.900002, 35.6, 35.900002,
    ],
    gpuTemperatures: [28.300001, 28.6],
    skinTemperatures: [24.716001],
    batteryTemperatures: [24.100001],
  },
  {
    cpuUsages: [
      0.5412371, 0.5084473, 0.45534408, 0.4641044, 0.6258503, 0.59310347,
      0.67168677, 0.6347032,
    ],
    createTime: "2025-01-20T22:48:30.910Z",
    cpuTemperatures: [
      56.100002, 58.4, 52.800003, 52.500004, 51.9, 56.500004, 57.800003, 53.2,
    ],
    gpuTemperatures: [40, 38.7],
    skinTemperatures: [24.196001],
    batteryTemperatures: [22.000002],
  },
  {
    cpuUsages: [
      0.45228618, 0.4438622, 0.35401723, 0.34061357, 0.3480696, 0.31924966,
      0.5245477, 0.46397984,
    ],
    createTime: "2025-01-21T23:02:30.192Z",
    cpuTemperatures: [
      30.2, 29.800001, 31.500002, 29.800001, 31.500002, 31.500002, 29.800001,
      31.2,
    ],
    gpuTemperatures: [27.500002, 27.900002],
    skinTemperatures: [26.834002],
    batteryTemperatures: [25.7],
  },
  {
    cpuUsages: [
      0.46865243, 0.46473438, 0.36237997, 0.35027686, 0.28246206, 0.2582837,
      0.46114534, 0.4099119,
    ],
    createTime: "2025-01-22T23:14:36.154Z",
    cpuTemperatures: [
      29.2, 30.2, 29.500002, 28.500002, 29.500002, 30.800001, 31.800001,
      29.500002,
    ],
    gpuTemperatures: [25.2, 25.2],
    skinTemperatures: [24.776001],
    batteryTemperatures: [23.2],
  },
  {
    cpuUsages: [
      0.44523293, 0.4416398, 0.33852547, 0.3268204, 0.25140733, 0.22966425,
      0.4123576, 0.3672947,
    ],
    createTime: "2025-01-23T23:33:42.154Z",
    cpuTemperatures: [26.6, 27.2, 27.2, 26.2, 27.2, 28.500002, 29.2, 27.500002],
    gpuTemperatures: [22.6, 22.900002],
    skinTemperatures: [22.500002],
    batteryTemperatures: [21.300001],
  },
  {
    cpuUsages: [
      0.43240786, 0.42792407, 0.33070642, 0.314918, 0.23482367, 0.21427628,
      0.38682726, 0.34475118,
    ],
    createTime: "2025-01-24T23:52:32.177Z",
    cpuTemperatures: [
      24.300001, 24.900002, 25.2, 24.300001, 25.6, 26.900002, 25.6, 25.900002,
    ],
    gpuTemperatures: [21.300001, 21.6],
    skinTemperatures: [21.116001],
    batteryTemperatures: [20.300001],
  },
  {
    cpuUsages: [
      0.41240786, 0.40792407, 0.31070642, 0.294918, 0.21482367, 0.19427628,
      0.36682726, 0.32475118,
    ],
    createTime: "2025-01-25T00:12:32.177Z",
    cpuTemperatures: [
      25.300001, 25.900002, 26.2, 25.300001, 26.6, 27.900002, 26.6, 26.900002,
    ],
    gpuTemperatures: [22.300001, 22.6],
    skinTemperatures: [22.116001],
    batteryTemperatures: [21.300001],
  },
  {
    cpuUsages: [
      0.48240786, 0.47792407, 0.38070642, 0.364918, 0.28482367, 0.26427628,
      0.43682726, 0.39475118,
    ],
    createTime: "2025-01-26T01:22:32.177Z",
    cpuTemperatures: [
      28.300001, 28.900002, 29.2, 28.300001, 29.6, 30.900002, 29.6, 29.900002,
    ],
    gpuTemperatures: [24.300001, 24.6],
    skinTemperatures: [23.116001],
    batteryTemperatures: [22.300001],
  },
  {
    cpuUsages: [
      0.52240786, 0.51792407, 0.42070642, 0.404918, 0.32482367, 0.30427628,
      0.47682726, 0.43475118,
    ],
    createTime: "2025-01-27T02:32:32.177Z",
    cpuTemperatures: [
      32.300001, 32.900002, 33.2, 32.300001, 33.6, 34.900002, 33.6, 33.900002,
    ],
    gpuTemperatures: [27.300001, 27.6],
    skinTemperatures: [24.116001],
    batteryTemperatures: [23.300001],
  },
  {
    cpuUsages: [
      0.56240786, 0.55792407, 0.46070642, 0.444918, 0.36482367, 0.34427628,
      0.51682726, 0.47475118,
    ],
    createTime: "2025-01-28T03:42:32.177Z",
    cpuTemperatures: [
      36.300001, 36.900002, 37.2, 36.300001, 37.6, 38.900002, 37.6, 37.900002,
    ],
    gpuTemperatures: [30.300001, 30.6],
    skinTemperatures: [25.116001],
    batteryTemperatures: [24.300001],
  },
  {
    cpuUsages: [
      0.61240786, 0.60792407, 0.51070642, 0.494918, 0.41482367, 0.39427628,
      0.56682726, 0.52475118,
    ],
    createTime: "2025-01-29T04:52:32.177Z",
    cpuTemperatures: [
      41.300001, 41.900002, 42.2, 41.300001, 42.6, 43.900002, 42.6, 42.900002,
    ],
    gpuTemperatures: [33.300001, 33.6],
    skinTemperatures: [26.116001],
    batteryTemperatures: [25.300001],
  },
  {
    cpuUsages: [
      0.58240786, 0.57792407, 0.48070642, 0.464918, 0.38482367, 0.36427628,
      0.53682726, 0.49475118,
    ],
    createTime: "2025-01-30T06:02:32.177Z",
    cpuTemperatures: [
      38.300001, 38.900002, 39.2, 38.300001, 39.6, 40.900002, 39.6, 39.900002,
    ],
    gpuTemperatures: [31.300001, 31.6],
    skinTemperatures: [25.516001],
    batteryTemperatures: [24.800001],
  },
  {
    cpuUsages: [
      0.54240786, 0.53792407, 0.44070642, 0.424918, 0.34482367, 0.32427628,
      0.49682726, 0.45475118,
    ],
    createTime: "2025-01-31T07:12:32.177Z",
    cpuTemperatures: [
      34.300001, 34.900002, 35.2, 34.300001, 35.6, 36.900002, 35.6, 35.900002,
    ],
    gpuTemperatures: [28.300001, 28.6],
    skinTemperatures: [24.716001],
    batteryTemperatures: [24.100001],
  },
  {
    cpuUsages: [
      0.5412371, 0.5084473, 0.45534408, 0.4641044, 0.6258503, 0.59310347,
      0.67168677, 0.6347032,
    ],
    createTime: "2025-02-01T22:48:30.910Z",
    cpuTemperatures: [
      56.100002, 58.4, 52.800003, 52.500004, 51.9, 56.500004, 57.800003, 53.2,
    ],
    gpuTemperatures: [40, 38.7],
    skinTemperatures: [24.196001],
    batteryTemperatures: [22.000002],
  },
  {
    cpuUsages: [
      0.45228618, 0.4438622, 0.35401723, 0.34061357, 0.3480696, 0.31924966,
      0.5245477, 0.46397984,
    ],
    createTime: "2025-02-02T23:02:30.192Z",
    cpuTemperatures: [
      30.2, 29.800001, 31.500002, 29.800001, 31.500002, 31.500002, 29.800001,
      31.2,
    ],
    gpuTemperatures: [27.500002, 27.900002],
    skinTemperatures: [26.834002],
    batteryTemperatures: [25.7],
  },
  {
    cpuUsages: [
      0.46865243, 0.46473438, 0.36237997, 0.35027686, 0.28246206, 0.2582837,
      0.46114534, 0.4099119,
    ],
    createTime: "2025-02-03T23:14:36.154Z",
    cpuTemperatures: [
      29.2, 30.2, 29.500002, 28.500002, 29.500002, 30.800001, 31.800001,
      29.500002,
    ],
    gpuTemperatures: [25.2, 25.2],
    skinTemperatures: [24.776001],
    batteryTemperatures: [23.2],
  },
  {
    cpuUsages: [
      0.44523293, 0.4416398, 0.33852547, 0.3268204, 0.25140733, 0.22966425,
      0.4123576, 0.3672947,
    ],
    createTime: "2025-02-04T23:33:42.154Z",
    cpuTemperatures: [26.6, 27.2, 27.2, 26.2, 27.2, 28.500002, 29.2, 27.500002],
    gpuTemperatures: [22.6, 22.900002],
    skinTemperatures: [22.500002],
    batteryTemperatures: [21.300001],
  },
  {
    cpuUsages: [
      0.43240786, 0.42792407, 0.33070642, 0.314918, 0.23482367, 0.21427628,
      0.38682726, 0.34475118,
    ],
    createTime: "2025-02-05T23:52:32.177Z",
    cpuTemperatures: [
      24.300001, 24.900002, 25.2, 24.300001, 25.6, 26.900002, 25.6, 25.900002,
    ],
    gpuTemperatures: [21.300001, 21.6],
    skinTemperatures: [21.116001],
    batteryTemperatures: [20.300001],
  },
  {
    cpuUsages: [
      0.41240786, 0.40792407, 0.31070642, 0.294918, 0.21482367, 0.19427628,
      0.36682726, 0.32475118,
    ],
    createTime: "2025-02-06T00:12:32.177Z",
    cpuTemperatures: [
      25.300001, 25.900002, 26.2, 25.300001, 26.6, 27.900002, 26.6, 26.900002,
    ],
    gpuTemperatures: [22.300001, 22.6],
    skinTemperatures: [22.116001],
    batteryTemperatures: [21.300001],
  },
  {
    cpuUsages: [
      0.48240786, 0.47792407, 0.38070642, 0.364918, 0.28482367, 0.26427628,
      0.43682726, 0.39475118,
    ],
    createTime: "2025-02-07T01:22:32.177Z",
    cpuTemperatures: [
      28.300001, 28.900002, 29.2, 28.300001, 29.6, 30.900002, 29.6, 29.900002,
    ],
    gpuTemperatures: [24.300001, 24.6],
    skinTemperatures: [23.116001],
    batteryTemperatures: [22.300001],
  },
  {
    cpuUsages: [
      0.52240786, 0.51792407, 0.42070642, 0.404918, 0.32482367, 0.30427628,
      0.47682726, 0.43475118,
    ],
    createTime: "2025-02-08T02:32:32.177Z",
    cpuTemperatures: [
      32.300001, 32.900002, 33.2, 32.300001, 33.6, 34.900002, 33.6, 33.900002,
    ],
    gpuTemperatures: [27.300001, 27.6],
    skinTemperatures: [24.116001],
    batteryTemperatures: [23.300001],
  },
  {
    cpuUsages: [
      0.56240786, 0.55792407, 0.46070642, 0.444918, 0.36482367, 0.34427628,
      0.51682726, 0.47475118,
    ],
    createTime: "2025-02-09T03:42:32.177Z",
    cpuTemperatures: [
      36.300001, 36.900002, 37.2, 36.300001, 37.6, 38.900002, 37.6, 37.900002,
    ],
    gpuTemperatures: [30.300001, 30.6],
    skinTemperatures: [25.116001],
    batteryTemperatures: [24.300001],
  },
  {
    cpuUsages: [
      0.61240786, 0.60792407, 0.51070642, 0.494918, 0.41482367, 0.39427628,
      0.56682726, 0.52475118,
    ],
    createTime: "2025-02-10T04:52:32.177Z",
    cpuTemperatures: [
      41.300001, 41.900002, 42.2, 41.300001, 42.6, 43.900002, 42.6, 42.900002,
    ],
    gpuTemperatures: [33.300001, 33.6],
    skinTemperatures: [26.116001],
    batteryTemperatures: [25.300001],
  },
  {
    cpuUsages: [
      0.58240786, 0.57792407, 0.48070642, 0.464918, 0.38482367, 0.36427628,
      0.53682726, 0.49475118,
    ],
    createTime: "2025-02-11T06:02:32.177Z",
    cpuTemperatures: [
      38.300001, 38.900002, 39.2, 38.300001, 39.6, 40.900002, 39.6, 39.900002,
    ],
    gpuTemperatures: [31.300001, 31.6],
    skinTemperatures: [25.516001],
    batteryTemperatures: [24.800001],
  },
  {
    cpuUsages: [
      0.54240786, 0.53792407, 0.44070642, 0.424918, 0.34482367, 0.32427628,
      0.49682726, 0.45475118,
    ],
    createTime: "2025-02-12T07:12:32.177Z",
    cpuTemperatures: [
      34.300001, 34.900002, 35.2, 34.300001, 35.6, 36.900002, 35.6, 35.900002,
    ],
    gpuTemperatures: [28.300001, 28.6],
    skinTemperatures: [24.716001],
    batteryTemperatures: [24.100001],
  },
];
