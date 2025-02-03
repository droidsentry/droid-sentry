"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartData } from "../../page";
import { Card } from "@/components/ui/card";

export default function BaseChart({ chartData }: { chartData: ChartData }) {
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;
  return (
    <Card>
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month" // 月
            tickLine={false} // 月の縦軸線を消す
            tickMargin={10} // 月のマージン
            axisLine={false} // 月の横軸線を消す
            tickFormatter={(value) => value.slice(0, 3)} // 月の表示を3文字にする
          />
          <ChartTooltip content={<ChartTooltipContent />} />

          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="desktop"
            fill="var(--color-desktop)"
            radius={4} // 棒の角を丸くする
            // barSize={10} // 棒のサイズ
          />
          <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
        </BarChart>
      </ChartContainer>
    </Card>
  );
}
