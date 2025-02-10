"use client";

import { HardwareInfoSourceType } from "@/app/types/device";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import LoadingWithinPageSkeleton from "@/app/(main)/[enterpriseId]/components/loading-within-page-sleleton";
import InformationTooltip from "@/components/information-tooltip";
import { devicePosture, encryptionStatus } from "@/lib/device";
import useSWRImmutable from "swr/immutable";
import { getHardwareInfo } from "../../actions/device";
import { formatToJapaneseDateTime } from "@/lib/date-fns/get-date";

export function DeviceSoftwareTable({
  enterpriseId,
  deviceIdentifier,
}: {
  enterpriseId: string;
  deviceIdentifier: string;
}) {
  const key = `/api/devices/${enterpriseId}/${deviceIdentifier}`;
  const { data, error, isLoading, isValidating } =
    useSWRImmutable<HardwareInfoSourceType>(key, () => {
      return getHardwareInfo({ enterpriseId, deviceIdentifier });
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
                  <InformationTooltip
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
                  <InformationTooltip
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
