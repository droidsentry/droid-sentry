import { HardwareInfoSourceType, HardwareInfoType } from "@/app/types/device";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatToJapaneseDateTime } from "@/lib/date-fns/get-date";
import { InfoIcon } from "lucide-react";

export default function HardwareInfoTable({
  deviceSource,
}: {
  deviceSource: HardwareInfoSourceType;
}) {
  const hardwareInfoSource = deviceSource?.hardwareInfo;
  const inputHardwareInfoItems = hardwareInfoItems.map((hardwareItem) => ({
    ...hardwareItem,
    value:
      hardwareInfoSource?.[hardwareItem.label as keyof HardwareInfoType] ??
      null,
  }));
  const inputHardwareTemperaturesItems = hardwareTemperaturesItems.map(
    (hardwareItem) => ({
      ...hardwareItem,
      value:
        hardwareInfoSource?.[hardwareItem.label as keyof HardwareInfoType] ??
        null,
    })
  );

  const deviceLastStatusReportTime = deviceSource?.lastStatusReportTime
    ? formatToJapaneseDateTime(deviceSource.lastStatusReportTime)
    : "";
  const cardDescription = deviceLastStatusReportTime
    ? `取得日時：${deviceLastStatusReportTime}`
    : "";
  return (
    <Card className="h-fit">
      <TooltipProvider delayDuration={200}>
        <CardHeader>
          <CardTitle>ハードウェア情報</CardTitle>
          <CardDescription>{cardDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-none border-t sm:border sm:rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>項目</TableHead>
                  <TableHead>値</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inputHardwareInfoItems.map((item) => (
                  <TableRow key={item.label}>
                    <TableCell className="w-1/2">
                      <div className="flex items-center gap-4">
                        {item.title}
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoIcon
                              size={15}
                              className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{item.explanation}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                    <TableCell className="w-1/2">{item.value}</TableCell>
                  </TableRow>
                ))}
                {inputHardwareTemperaturesItems.map((item) => {
                  const name = item.label.slice(0, 3).toUpperCase();
                  const valueList =
                    item.value && Array.isArray(item.value)
                      ? item.value.map(
                          (num, index) => ` ${name}${index + 1} : ${num}℃`
                        )
                      : item.value
                        ? `${item.value[0].toString().slice(0, 4)}℃`
                        : "-";
                  return (
                    <TableRow key={item.label}>
                      <TableCell className="w-1/2">
                        <div className="flex items-center gap-4">
                          {item.title}
                          <Tooltip>
                            <TooltipTrigger>
                              <InfoIcon
                                size={15}
                                className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{item.explanation}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                      <TableCell className="w-1/2">{valueList}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </TooltipProvider>
    </Card>
  );
}
export const hardwareInfoItems = [
  {
    label: "brand",
    title: "ブランド",
    value: null,
    explanation: "デバイスのブランド。例:Google",
  },
  {
    label: "model",
    title: "モデル",
    value: null,
    explanation: "デバイスのモデル。例:Pixel 7",
  },
  {
    label: "hardware",
    title: "ハードウェア",
    value: null,
    explanation: "デバイスのハードウェア。例:blueline",
  },
  {
    label: "manufacturer",
    title: "メーカー",
    value: null,
    explanation: "デバイスのメーカー.例:Google",
  },
  {
    label: "serialNumber",
    title: "シリアル番号",
    value: null,
    explanation: "デバイスのシリアル番号.例:93VX1YBQL",
  },
  {
    label: "deviceBasebandVersion",
    title: "デバイスベースバンドバージョン",
    value: null,
    explanation:
      "デバイスのベースバンドバージョン。例:g845-00194-210812-B-7635520",
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
