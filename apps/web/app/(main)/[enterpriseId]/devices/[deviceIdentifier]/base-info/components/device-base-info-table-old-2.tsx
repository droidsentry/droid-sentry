import { HardwareInfoSourceType } from "@/app/types/device";
import CopyButton from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import { CardContent, Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
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
import { cn } from "@/lib/utils";

import { CopyIcon, InfoIcon } from "lucide-react";

export function DeviceBaseInfoTable({
  deviceSource,
}: {
  deviceSource: HardwareInfoSourceType;
}) {
  return (
    <Card className="">
      <TooltipProvider delayDuration={200}>
        <CardHeader>
          <CardTitle>基本情報</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/2">項目</TableHead>
                <TableHead className="w-1/2">値</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="">
                <TableCell>
                  <div className="flex items-center gap-2 h-10">
                    <span className="font-bold">デバイスID</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon
                          size={15}
                          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>デバイスを管理するID</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
                <TableCell>
                  {deviceSource?.name?.includes("devices/") ? (
                    <div className="flex items-center gap-2">
                      <span>{deviceSource.name.split("devices/")[1]}</span>
                      <CopyButton
                        value={deviceSource.name.split("devices/")[1]}
                      />
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className="flex items-center gap-2 h-10">
                    <span className="font-bold">ユーザーID</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon
                          size={15}
                          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>デバイスに自動で設定されたユーザーを管理するID</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
                <TableCell>
                  {deviceSource?.userName?.includes("users/") ? (
                    <div className="flex items-center gap-2">
                      <span>{deviceSource.userName.split("users/")[1]}</span>
                      <CopyButton
                        value={deviceSource.userName.split("users/")[1]}
                      />
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className="flex items-center gap-2 h-10">
                    <span className="font-bold">
                      デバイスにリクエストされている状態
                    </span>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon
                          size={15}
                          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>デバイスにリクエストされている状態</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
                <TableCell>{deviceSource?.state}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className="flex items-center gap-2 h-10">
                    <span className="font-bold">
                      デバイスに適用されている状態
                    </span>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon
                          size={15}
                          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>デバイスに適用されている状態</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
                <TableCell>{deviceSource?.appliedState}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className="flex items-center gap-2 h-10">
                    <span className="font-bold">登録日</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon
                          size={15}
                          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>デバイスが管理された日時</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
                <TableCell>{deviceSource?.enrollmentTime}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className="flex items-center gap-2 h-10">
                    <span className="font-bold">所有権</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon
                          size={15}
                          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>デバイスの所有権</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
                <TableCell>{deviceSource?.ownership}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className="flex items-center gap-2 h-10">
                    <span className="font-bold">管理モード</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon
                          size={15}
                          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>デバイスの管理モード</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
                <TableCell>{deviceSource?.managementMode}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className="flex items-center gap-2 h-10">
                    <span className="font-bold">システムプロパティ</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon
                          size={15}
                          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>デバイスのシステムプロパティ</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
                <TableCell>
                  <pre className="text-muted-foreground bg-muted p-2 border rounded-md text-xs break-all whitespace-pre-wrap">
                    {JSON.stringify(deviceSource?.systemProperties)}
                  </pre>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className="flex items-center gap-2 h-10">
                    <span className="font-bold">過去のデバイスID</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon
                          size={15}
                          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>デバイスの過去のデバイスID</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2 w-fit">
                    {deviceSource?.previousDeviceNames ? (
                      deviceSource.previousDeviceNames.map((name) => {
                        const deviceId = !name.includes("devices/")
                          ? null
                          : name.split("devices/")[1];
                        return (
                          <div
                            key={deviceId}
                            className="grid grid-cols-2 items-center gap-2"
                          >
                            <span className="">{deviceId}</span>
                            <CopyButton value={deviceId ?? ""} />
                          </div>
                        );
                      })
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </TooltipProvider>
    </Card>
  );
}
