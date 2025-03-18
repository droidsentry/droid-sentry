"use client";

import { ApplicationInfoType, ApplicationReportType } from "@/lib/types/device";
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

import { formatToJapaneseDateTime } from "@/lib/date-fns/get-date";

export function DeviceApplicationInfoTable({
  deviceApplicationSource,
}: {
  deviceApplicationSource: ApplicationInfoType;
}) {
  // const key = `/api/devices/${enterpriseId}/${deviceId}`;
  // const { data, error, isLoading, isValidating } =
  //   useSWRImmutable<HardwareInfoSourceType>(key, () => {
  //     return getHardwareInfo({ enterpriseId, deviceId });
  //   });
  // if (error) return <div>エラーが発生しました</div>;
  // if (isLoading || isValidating) return <LoadingWithinPageSkeleton />;
  // if (!data) return null;
  const applicationSource =
    deviceApplicationSource?.applicationReportDate as ApplicationReportType[];
  const lastStatusReportTime = deviceApplicationSource?.lastStatusReportTime;

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>アプリケーション情報</CardTitle>
        <CardDescription>
          {lastStatusReportTime &&
            formatToJapaneseDateTime(lastStatusReportTime)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>アプリケーション名</TableHead>
              <TableHead>パッケージ名</TableHead>
              <TableHead>状態</TableHead>
              <TableHead>アプリ提供元</TableHead>
            </TableRow>
            {applicationSource.map((application) => (
              <TableRow key={application.packageName}>
                <TableCell>{application.displayName}</TableCell>
                <TableCell>{application.packageName}</TableCell>
                <TableCell>{application.state}</TableCell>
                <TableCell>{application.applicationSource}</TableCell>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody></TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
