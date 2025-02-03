import { HardwareInfoSourceType } from "@/app/types/device";
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
  hardwareInfo,
}: {
  hardwareInfo: HardwareInfoSourceType;
}) {
  const {
    hardwareInfoSource,
    hardwareTemperaturesSource,
    lastStatusReportTime,
  } = hardwareInfo ?? {};

  const deviceLastStatusReportTime = lastStatusReportTime
    ? formatToJapaneseDateTime(lastStatusReportTime)
    : "";
  const cardDescription = lastStatusReportTime
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>項目</TableHead>
                <TableHead>値</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hardwareInfoSource &&
                hardwareInfoSource.map((item) => (
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
              {hardwareTemperaturesSource &&
                hardwareTemperaturesSource.map((item) => {
                  const name = item.label.slice(0, 3).toUpperCase();
                  const itemCount = item.value?.length ?? 0;
                  const valueList = !item.value
                    ? ""
                    : itemCount > 1
                      ? item.value?.map(
                          (num, index) => ` ${name}${index + 1} : ${num}℃`
                        )
                      : `${item.value?.[0].toString().slice(0, 4)}℃`;
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
        </CardContent>
      </TooltipProvider>
    </Card>
  );
}
