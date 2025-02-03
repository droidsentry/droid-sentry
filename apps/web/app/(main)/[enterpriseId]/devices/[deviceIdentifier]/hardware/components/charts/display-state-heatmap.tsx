"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import SelectTimeButton from "./select-time-button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
// import { formatToJapaneseDateTime } from "@/lib/date-fns/get-date";
import { displayStates } from "../../data/displays-sample";
import { formatToJapaneseDateTime } from "@/lib/date-fns/get-date";
import { isWithinInterval, parseISO, subDays } from "date-fns";

const stateToNumber = {
  OFF: 0,
  SUSPENDED: 1,
  DOZE: 2,
  ON: 3,
} as const;

const displayStateConfig = {
  displayState: {
    label: "画面の状態",
    color: "hsl(var(--chart-1))",
  },
} as const;

export function DisplayStateChart({}) {
  const [timeRange, setTimeRange] = useState("30d");

  // 期間でフィルタリング
  const filteredChartSource = sampleData
    .filter((item) => {
      const date = parseISO(item.date);
      const referenceDate = parseISO(sampleData[sampleData.length - 1].date);
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
      return isWithinInterval(date, {
        start: subDays(referenceDate, daysToSubtract),
        end: referenceDate,
      });
    })
    .map((item) => ({
      ...item,
      stateNumber: stateToNumber[item.state as keyof typeof stateToNumber],
    }));

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>画面の状態</CardTitle>
          <CardDescription>デバイスの画面状態の履歴を表示</CardDescription>
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
                画面状態のデータはありません。
              </p>
            </div>
          </div>
        ) : (
          <ChartContainer
            config={displayStateConfig}
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
                    case "1d":
                      return formatToJapaneseDateTime(value, "HH:mm");
                    default:
                      return formatToJapaneseDateTime(value, "MM/dd");
                  }
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={80}
                ticks={[0, 1, 2, 3]}
                tickFormatter={(value) => {
                  const states = ["オフ", "サスペンド", "ドーズ", "オン"];
                  return states[value];
                }}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line
                type="stepAfter"
                dataKey="stateNumber"
                stroke={displayStateConfig.displayState.color}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

const sampleData = [
  {
    date: "2024-02-28T00:00:00.000Z",
    state: "OFF",
  },
  {
    date: "2024-02-28T01:30:00.000Z",
    state: "DOZE",
  },
  {
    date: "2024-02-28T03:00:00.000Z",
    state: "OFF",
  },
  {
    date: "2024-02-28T04:30:00.000Z",
    state: "SUSPENDED",
  },
  {
    date: "2024-02-28T06:00:00.000Z",
    state: "OFF",
  },
  {
    date: "2024-02-28T07:30:00.000Z",
    state: "ON",
  },
  {
    date: "2024-02-28T09:00:00.000Z",
    state: "OFF",
  },
  {
    date: "2024-02-28T10:30:00.000Z",
    state: "DOZE",
  },
  {
    date: "2024-02-28T12:00:00.000Z",
    state: "OFF",
  },
  {
    date: "2024-02-28T13:30:00.000Z",
    state: "SUSPENDED",
  },
  {
    date: "2024-02-28T15:00:00.000Z",
    state: "OFF",
  },
  {
    date: "2024-02-28T16:30:00.000Z",
    state: "ON",
  },
  {
    date: "2024-02-28T18:00:00.000Z",
    state: "OFF",
  },
  {
    date: "2024-02-28T19:30:00.000Z",
    state: "DOZE",
  },
];
