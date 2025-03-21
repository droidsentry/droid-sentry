"use client";

import {
  ChartType,
  HardwareStatusSourceType,
  HardwareStatusType,
} from "@/app/types/device";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatToJapaneseDateTime } from "@/lib/date-fns/get-date";
import { isWithinInterval, parseISO, subDays } from "date-fns";
import { RefreshCcwIcon } from "lucide-react";
import { useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import SelectTimeButton from "./select-time-button";

export function HardwareCpuTemperatureChart({
  hardwareStatusSource,
}: {
  hardwareStatusSource: HardwareStatusSourceType;
}) {
  const [timeRange, setTimeRange] = useState(30);
  const { chartSource, chartConfig, configCount } =
    transformHardwareStatusSourceToCpuTemperatureChart(hardwareStatusSource);
  const initialSelectedCpus = Object.keys(chartConfig);
  const [selectedCpus, setSelectedCpus] =
    useState<string[]>(initialSelectedCpus);

  const filteredChartSource = chartSource.filter((item) => {
    const date = parseISO(item.date);
    const referenceDate = parseISO(chartSource[chartSource.length - 1].date); // 最新の日付
    // 日付が範囲内かチェック
    return isWithinInterval(date, {
      start: subDays(referenceDate, timeRange),
      end: referenceDate,
    });
  });
  // console.log("filteredChartSource", filteredChartSource);

  return (
    <Card className="h-fit">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>CPU温度</CardTitle>
          <CardDescription>各コアのCPU温度を表示。</CardDescription>
        </div>
        <div className="flex flex-row gap-2 w-fit">
          {configCount > 1 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">表示するCPUコア</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-fit px-3">
                <Button
                  variant="ghost"
                  className="w-full h-10"
                  onClick={() => setSelectedCpus(initialSelectedCpus)}
                >
                  <RefreshCcwIcon className="size-4" />
                  リセット
                </Button>
                <DropdownMenuSeparator />
                {Object.entries(chartConfig).map(([key, config]) => (
                  <DropdownMenuCheckboxItem
                    key={key}
                    checked={selectedCpus.includes(key)}
                    onCheckedChange={(checked) => {
                      setSelectedCpus((prev) =>
                        checked
                          ? [...prev, key]
                          : prev.filter((id) => id !== key)
                      );
                    }}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {config.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {filteredChartSource.length >= 1 && (
            <SelectTimeButton
              timeRange={timeRange}
              setTimeRange={setTimeRange}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:p-5">
        {filteredChartSource.length === 0 ? (
          <div className="flex h-[300px] w-full items-center justify-center rounded-lg border border-dashed">
            <div className="text-center">
              <p className="text-md font-bold tracking-widest text-muted-foreground">
                CPU温度のデータはありません。
              </p>
            </div>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[300px] w-full"
          >
            <LineChart data={filteredChartSource}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickMargin={8}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => {
                  switch (timeRange) {
                    case 1:
                      return formatToJapaneseDateTime(value, "HH:mm");
                    default:
                      return formatToJapaneseDateTime(value, "MM/dd");
                  }
                }}
              />
              <YAxis tickLine={false} axisLine={false} unit="℃" width={32} />
              <ChartTooltip
                cursor={false} // マウスカーソルを表示しない
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return formatToJapaneseDateTime(value);
                    }}
                    indicator="dot" // ドットを表示
                  />
                }
              />
              {Object.entries(chartConfig).map(
                ([key, config]) =>
                  selectedCpus.includes(key) && (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={config.color}
                      dot={false}
                    />
                  )
              )}
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * ハードウェアステータスソースをCPU温度のチャートソースに変換
 * @param hardwareStatusSource ハードウェアステータスソース
 * @returns チャートのデータと設定
 */
const transformHardwareStatusSourceToCpuTemperatureChart = (
  hardwareStatusSource: HardwareStatusSourceType
) => {
  const configKey = "CPU";
  let configCount = 0;
  const chartSource = hardwareStatusSource
    .map((status) => {
      const result = formatSingleHardwareStatus(status, configKey);
      configCount = Math.max(configCount, result?.keyCount ?? 0);
      return result?.chart;
    })
    .filter((data) => data !== undefined);

  const chartConfig = createChartConfig(configKey, configCount);

  return { chartSource, chartConfig, configCount };
};

/**
 * ハードウェアステータスをチャートのデータに変換
 * @param status ハードウェアステータス
 * @param configKey 設定キー
 * @returns チャートのデータ
 */
const formatSingleHardwareStatus = (
  status: HardwareStatusType,
  configKey: string
) => {
  if (!status.createTime) return null;
  let keyCount = 1;
  const chart: ChartType = {
    date: status.createTime,
  };
  if (!status.cpuTemperatures) return null;
  status.cpuTemperatures.forEach((temperature, index) => {
    const cpuKey = `${configKey}${index + 1}`;
    chart[cpuKey] = formatTemperature(temperature);
    keyCount = index + 1;
  });

  return { chart, keyCount };
};

/**
 * 温度を℃に変換
 * @param temperature 温度
 * @returns 温度、小数点第2位まで
 */
const formatTemperature = (temperature: number): string => {
  return temperature.toFixed(2);
};

const createChartConfig = (configKey: string, configCount: number) => {
  return Object.fromEntries(
    Array.from({ length: configCount }, (_, index) => [
      `${configKey}${index + 1}`,
      {
        label: getLabel(configKey, index, configCount) + " 温度",
        color: `hsl(var(--chart-2))`,
      },
    ])
  ) satisfies ChartConfig;
};

/**
 * ラベルを取得
 * @param configKey 基準ラベル
 * @param index インデックス
 * @param configCount 設定数
 * @returns ラベル, 設定数が2以上の場合はコア番号を含む
 */
const getLabel = (configKey: string, index: number, configCount: number) => {
  return configCount < 2 ? configKey : `${configKey}${index + 1}`;
};
