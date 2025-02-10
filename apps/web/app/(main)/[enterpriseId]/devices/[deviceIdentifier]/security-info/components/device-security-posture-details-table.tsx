"use client";

import { HardwareInfoSourceType } from "@/app/types/device";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import LoadingWithinPageSkeleton from "@/app/(main)/[enterpriseId]/components/loading-within-page-sleleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { formatToJapaneseDateTime } from "@/lib/date-fns/get-date";
import useSWRImmutable from "swr/immutable";
import { getHardwareInfo } from "../../actions/device";
import { securityRisk } from "@/lib/device";
import InformationTooltip from "@/components/information-tooltip";

export default function DeviceSecurityPostureDetailsTable({
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

  const deviceLastStatusReportTime = data.lastStatusReportTime
    ? formatToJapaneseDateTime(data.lastStatusReportTime)
    : "";
  const cardDescription = deviceLastStatusReportTime
    ? `取得日時：${deviceLastStatusReportTime}`
    : "";

  const securityPostureDetails = data.securityPosture?.postureDetails;

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>セキュリティリスクの詳細情報</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        {securityPostureDetails ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>セキュリティリスク</TableHead>
                <TableHead>セキュリティリスクの改善方法</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {securityPostureDetails.map(
                (securityPostureDetail, securityPostureDetailIndex) => {
                  return (
                    <TableRow
                      key={`securityPostureDetail-${securityPostureDetailIndex}`}
                    >
                      <TableCell className="w-1/2">
                        <div className="flex items-center gap-4">
                          <span className="font-bold">
                            {securityPostureDetail.securityRisk ?? "不明"}
                          </span>
                          <InformationTooltip
                            tooltip={
                              securityRisk.find(
                                (risk) =>
                                  risk.value ===
                                  securityPostureDetail.securityRisk
                              )?.label ?? "不明"
                            }
                          />
                        </div>
                      </TableCell>
                      {securityPostureDetail.advice?.map(
                        (advice, adviceIndex) => (
                          <TableCell
                            className="w-1/2"
                            key={`item-${adviceIndex}`}
                          >
                            {advice.defaultMessage}
                          </TableCell>
                        )
                      )}
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          </Table>
        ) : (
          <div className="flex h-[300px] w-full items-center justify-center rounded-lg border border-dashed">
            <div className="text-center">
              <p className="text-md font-bold tracking-widest text-muted-foreground">
                セキュリティリスクの詳細情報はありません。
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
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
