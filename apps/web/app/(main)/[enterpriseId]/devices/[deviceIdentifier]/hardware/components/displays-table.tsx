import { DisplaysType, HardwareInfoSourceType } from "@/app/types/device";
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

export default function DisplaysTable({
  deviceSource,
}: {
  deviceSource: HardwareInfoSourceType;
}) {
  const displaysSource = deviceSource?.displays;
  const transformedDisplaysSource = displaysSource
    ? displaysSource.map((display) =>
        displaysItems.map((displaysItem) => ({
          ...displaysItem,
          value: display[displaysItem.label as keyof DisplaysType] ?? null,
        }))
      )
    : null;

  const deviceLastStatusReportTime = deviceSource?.lastStatusReportTime
    ? formatToJapaneseDateTime(deviceSource.lastStatusReportTime)
    : "";
  const cardDescription = deviceLastStatusReportTime
    ? `取得日時：${deviceLastStatusReportTime}`
    : "";

  return (
    <>
      {transformedDisplaysSource ? (
        transformedDisplaysSource.map((displays, displayIndex) => (
          <Card key={`display-${displayIndex}`} className="h-fit">
            <TooltipProvider delayDuration={200}>
              <CardHeader>
                <CardTitle>ディスプレイ情報</CardTitle>
                <CardDescription>{cardDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>項目</TableHead>
                      <TableHead>値</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displays.map((item, itemIndex) => (
                      <TableRow key={`item-${itemIndex}`}>
                        <TableCell className="w-1/2">
                          <div className="flex items-center gap-4">
                            {item.title}
                            <Tooltip>
                              <TooltipTrigger>
                                <InfoIcon size={15} className="shrink-0" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{item.explanation}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                        <TableCell className="w-1/2">
                          {item.value ?? "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </TooltipProvider>
          </Card>
        ))
      ) : (
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>ディスプレイ情報</CardTitle>
            <CardDescription>{cardDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[300px] w-full items-center justify-center rounded-lg border border-dashed">
              <div className="text-center">
                <p className="text-md font-bold tracking-widest text-muted-foreground">
                  ディスプレイ情報はありません。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

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
