"use client";

import { HardwareInfoSourceType } from "@/lib/types/device";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import LoadingWithinPageSkeleton from "@/lib/emm/components/loading-within-page-sleleton";
import InfoTooltip from "@/components/info-tooltip";
import { formatToJapaneseDateTime } from "@/lib/date-fns/get-date";
import useSWRImmutable from "swr/immutable";
import { getHardwareInfo } from "../../../../../../lib/actions/emm/get-device-info";

export function DeviceSoftwareTable({
  enterpriseId,
  deviceId,
}: {
  enterpriseId: string;
  deviceId: string;
}) {
  const key = `/api/devices/${enterpriseId}/${deviceId}`;
  const { data, error, isLoading, isValidating } =
    useSWRImmutable<HardwareInfoSourceType>(key, () => {
      return getHardwareInfo({ enterpriseId, deviceId });
    });
  if (error) return <div>エラーが発生しました</div>;
  if (isLoading || isValidating) return <LoadingWithinPageSkeleton />;
  if (!data) return null;
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>ソフトウェア情報</CardTitle>
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
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-bold">Android OSのバージョン</span>
                  <InfoTooltip
                    tooltip={
                      "デバイスの設定画面で確認できるAndroid OSのバージョンを表示します。例: 6.0.1"
                    }
                  />
                </div>
              </TableCell>
              <TableCell>
                {data?.softwareInfo?.androidVersion ?? (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-bold">Android ビルドタイム</span>
                  <InfoTooltip
                    tooltip={"デバイスのAndroid OSのビルドタイムを表示します。"}
                  />
                </div>
              </TableCell>
              <TableCell>
                {data?.softwareInfo?.androidBuildTime ? (
                  <span>
                    {`${data.softwareInfo.androidBuildTime} ※ 日本時間：${formatToJapaneseDateTime(
                      data.softwareInfo.androidBuildTime
                    )}`}
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
