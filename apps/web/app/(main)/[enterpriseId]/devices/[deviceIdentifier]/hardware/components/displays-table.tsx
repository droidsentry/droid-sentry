import {
  DisplaysType,
  HardwareInfoSourceType,
  HardwareInfoType,
  HardwareStatusType,
} from "@/app/types/device";
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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { number } from "zod";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { formatToJapaneseDateTime } from "@/lib/date-fns/get-date";

export default function DisplaysTable({
  hardwareInfo,
}: {
  hardwareInfo: HardwareInfoSourceType;
}) {
  const { displaysSource, lastStatusReportTime } = hardwareInfo ?? {};

  const deviceLastStatusReportTime = lastStatusReportTime
    ? formatToJapaneseDateTime(lastStatusReportTime)
    : "";
  const cardDescription = lastStatusReportTime
    ? `取得日時：${deviceLastStatusReportTime}`
    : "";

  return (
    <>
      {displaysSource ? (
        displaysSource.map((displays, displayIndex) => (
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
                        <TableCell className="w-1/2">{item.value}</TableCell>
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
