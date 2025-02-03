"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  HardwareStatusSourceType,
  HardwareStatusType,
} from "@/app/types/device";
import { formatToJapaneseDateTime } from "@/lib/date-fns/get-date";
import SelectTimeButton from "./select-time-button";
import { useState } from "react";
import { isWithinInterval, parseISO, subDays } from "date-fns";

const chartConfig = {
  cpuUsage: {
    label: "CPU使用率",
    color: "hsl(var(--chart-1))",
  },
  cpuTemp: {
    label: "CPU温度",
    color: "hsl(var(--chart-2))",
  },
  gpuTemp: {
    label: "GPU温度",
    color: "hsl(var(--chart-3))",
  },
  skinTemp: {
    label: "表面温度",
    color: "hsl(var(--chart-4))",
  },
  batteryTemp: {
    label: "バッテリー温度",
    color: "hsl(var(--chart-5))",
  },
} as const;

const chartConfigAverage = {
  cpuTemperature: {
    label: "CPU温度",
    color: "hsl(var(--chart-2))",
  },
  gpuTemperature: {
    label: "GPU温度",
    color: "hsl(var(--chart-3))",
  },
  skinTemperature: {
    label: "表面温度",
    color: "hsl(var(--chart-4))",
  },
  batteryTemperature: {
    label: "バッテリー温度",
    color: "hsl(var(--chart-5))",
  },
} as const;

export function HardwareTemperaturesAverageChart({
  hardwareStatus,
}: {
  hardwareStatus: HardwareStatusSourceType;
}) {
  const { hardwareTemperatureAverageChartSource } = hardwareStatus;
  const [timeRange, setTimeRange] = useState("30d");

  const chartSource = hardwareTemperatureAverageChartSource;
  const filteredChartSource = chartSource.filter((item) => {
    const date = parseISO(item.date);
    const referenceDate = parseISO(chartSource[chartSource.length - 1].date); // 最新の日付
    let daysToSubtract = 30;
    if (timeRange === "15d") {
      daysToSubtract = 15;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    } else if (timeRange === "3d") {
      daysToSubtract = 3;
    } else if (timeRange === "1d") {
      daysToSubtract = 1;
    }
    // 日付が範囲内かチェック
    return isWithinInterval(date, {
      start: subDays(referenceDate, daysToSubtract),
      end: referenceDate,
    });
  });

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>温度モニター</CardTitle>
          <CardDescription>
            デバイスのCPU温度、GPU温度、表面温度、バッテリー温度の平均値を表示。
          </CardDescription>
        </div>
        <div className="flex flex-row gap-2 w-fit">
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
                温度モニターのデータはありません。
              </p>
            </div>
          </div>
        ) : (
          <ChartContainer
            config={chartConfigAverage}
            className="aspect-auto h-[300px] w-full "
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
                    case "1d":
                      return formatToJapaneseDateTime(value, "HH:mm");
                    default:
                      return formatToJapaneseDateTime(value, "MM/dd");
                  }
                }}
              />
              <YAxis tickLine={false} axisLine={false} unit="°C" width={32} />
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
              <ChartLegend
                content={<ChartLegendContent />}
                className="flex-wrap"
              />
              <Line
                type="monotone"
                dataKey="cpuTemperature"
                stroke="var(--color-cpuTemperature)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="gpuTemperature"
                stroke="var(--color-gpuTemperature)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="skinTemperature"
                stroke="var(--color-skinTemperature)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="batteryTemperature"
                stroke="var(--color-batteryTemperature)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
