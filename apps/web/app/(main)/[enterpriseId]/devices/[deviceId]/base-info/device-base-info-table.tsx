"use client";

import {
  AndroidManagementDevice,
  HardwareInfoSourceType,
} from "@/lib/types/device";
import CopyButton from "@/components/copy-button";
import InfoTooltip from "@/components/info-tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { formatToJapaneseDateTime } from "@/lib/date-fns/get-date";
import { deviceManagementMode, deviceOwnership } from "@/data/emm/device";
import useSWR from "swr";
import { deviceStates } from "../../data/data";
import { getHardwareInfo } from "../../../../../../lib/actions/emm/get-device-info";
import LoadingWithinPageSkeleton from "@/lib/emm/components/loading-within-page-sleleton";

type FormattedValue = {
  value: React.ReactNode;
  tooltip: string;
};

type TableRowDefinition = {
  label: string;
  getValue: (data: HardwareInfoSourceType) => FormattedValue;
};

const formatDeviceId = (name: string | undefined | null): React.ReactNode => {
  if (!name?.includes("devices/"))
    return <span className="text-muted-foreground">-</span>;
  const deviceId = name.split("devices/")[1];
  return (
    <div className="flex items-center gap-2">
      <span>{deviceId}</span>
      <CopyButton value={deviceId} />
    </div>
  );
};
const formatUserId = (name: string | undefined | null): React.ReactNode => {
  if (!name?.includes("users/"))
    return <span className="text-muted-foreground">-</span>;
  const userId = name.split("users/")[1];
  return (
    <div className="flex items-center gap-2">
      <span>{userId}</span>
      <CopyButton value={userId} />
    </div>
  );
};
const formatState = (state: string | undefined | null): React.ReactNode => {
  if (!state) return <span className="text-muted-foreground">-</span>;
  const stateLabel = deviceStates.find((item) => item.value === state)?.label;
  if (!stateLabel) return <span className="text-muted-foreground">不明</span>;
  return <span>{stateLabel}</span>;
};
const formatTime = (time: string | undefined | null): React.ReactNode => {
  if (!time) return <span className="text-muted-foreground">-</span>;
  const formattedTime = formatToJapaneseDateTime(time);
  return <span>{formattedTime}</span>;
};
const formatOwnership = (
  ownership: string | undefined | null
): React.ReactNode => {
  if (!ownership) return <span className="text-muted-foreground">-</span>;
  const ownershipLabel = deviceOwnership.find(
    (item) => item.value === ownership
  )?.label;
  if (!ownershipLabel)
    return <span className="text-muted-foreground">不明</span>;
  return <span>{ownershipLabel}</span>;
};
const formatManagementMode = (
  managementMode: string | undefined | null
): React.ReactNode => {
  if (!managementMode) return <span className="text-muted-foreground">-</span>;
  const managementModeLabel = deviceManagementMode.find(
    (item) => item.value === managementMode
  )?.label;
  if (!managementModeLabel)
    return <span className="text-muted-foreground">不明</span>;
  return <span>{managementModeLabel}</span>;
};
const formatSystemProperties = (
  systemProperties: { [key: string]: string } | null | undefined
): React.ReactNode => {
  if (!systemProperties)
    return <span className="text-muted-foreground">-</span>;
  const systemPropertiesValue = JSON.stringify(systemProperties);
  return (
    <div className="flex gap-2 items-center mb-2">
      <pre className="text-muted-foreground bg-muted p-2 border rounded-md text-xs break-all whitespace-pre-wrap">
        {systemPropertiesValue}
      </pre>
      <CopyButton value={systemPropertiesValue} className="shrink-0" />
    </div>
  );
};
const formatPreviousDeviceNames = (
  previousDeviceNames: string[] | null | undefined
): React.ReactNode => {
  if (!previousDeviceNames) {
    return <span className="text-muted-foreground">-</span>;
  }
  return previousDeviceNames.map((name) => {
    const deviceId = !name.includes("devices/")
      ? null
      : name.split("devices/")[1];
    return (
      <div key={deviceId} className="flex flex-col">
        <div className="flex gap-2 items-center mb-2">
          <span className="break-all">{deviceId}</span>
          <CopyButton value={deviceId ?? ""} />
        </div>
      </div>
    );
  });
};

const TABLE_ROWS: TableRowDefinition[] = [
  {
    label: "デバイスID",
    getValue: (data) => ({
      value: formatDeviceId(data?.name),
      tooltip: "デバイスを管理するID",
    }),
  },
  {
    label: "ユーザーID",
    getValue: (data) => ({
      value: formatUserId(data?.userName),
      tooltip: "デバイスに自動で設定されたユーザーを管理するID",
    }),
  },
  {
    label: "デバイスにリクエストされている状態",
    getValue: (data) => ({
      value: formatState(data?.state),
      tooltip: "デバイスにリクエストされている状態",
    }),
  },
  {
    label: "デバイスに適用されている状態",
    getValue: (data) => ({
      value: formatState(data?.appliedState),
      tooltip: "デバイスに適用されている状態",
    }),
  },
  {
    label: "登録日",
    getValue: (data) => ({
      value: formatTime(data?.enrollmentTime),
      tooltip: "デバイスが管理された日時",
    }),
  },
  {
    label: "所有権",
    getValue: (data) => ({
      value: formatOwnership(data?.ownership),

      tooltip: "デバイスの所有権",
    }),
  },
  {
    label: "管理モード",
    getValue: (data) => ({
      value: formatManagementMode(data?.managementMode),
      tooltip: "デバイスの管理モード",
    }),
  },
  {
    label: "システムプロパティ",
    getValue: (data) => ({
      value: formatSystemProperties(data?.systemProperties),
      tooltip: "デバイスのシステムプロパティ",
    }),
  },
  {
    label: "過去のデバイスID",
    getValue: (data) => ({
      value: formatPreviousDeviceNames(data?.previousDeviceNames),
      tooltip: "デバイスの過去のデバイスID",
    }),
  },
];

export function DeviceBaseInfoTable({
  deviceSource,
  enterpriseId,
  deviceId,
}: {
  deviceSource: HardwareInfoSourceType;
  enterpriseId: string;
  deviceId: string;
}) {
  const key = `/api/devices/${enterpriseId}/${deviceId}`;
  const { data, error, isLoading, isValidating } =
    useSWR<HardwareInfoSourceType>(
      key,
      () => {
        return getHardwareInfo({ enterpriseId, deviceId });
      },
      {
        fallbackData: deviceSource,
        revalidateOnFocus: false,
        dedupingInterval: 3600000, // enterpriseId,deviceIdが同じ場合は1時間、関数を実行しない
      }
    );
  if (error) return <div>エラーが発生しました</div>;
  if (isLoading || isValidating) return <LoadingWithinPageSkeleton />;
  if (!data) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>基本情報</CardTitle>
      </CardHeader>
      <CardContent className="p-0 md:p-6 md:pt-0">
        <div className="rounded-none border-t sm:border sm:rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/2">項目</TableHead>
                <TableHead className="w-1/2">値</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TABLE_ROWS.map((row) => {
                const { value, tooltip } = row.getValue(data);
                return (
                  <TableRow key={row.label}>
                    <TableCell className="px-2 md:px-4">
                      <div className="flex items-center gap-2 h-fit md:h-10">
                        <span className="font-bold">{row.label}</span>
                        <InfoTooltip tooltip={tooltip} />
                      </div>
                    </TableCell>
                    <TableCell className="px-2 md:px-4">{value}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
