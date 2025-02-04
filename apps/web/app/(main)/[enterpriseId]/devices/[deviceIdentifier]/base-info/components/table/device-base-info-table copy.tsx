"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  InfoIcon,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AndroidManagementDevice,
  HardwareInfoSourceType,
} from "@/app/types/device";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  formatToJapaneseDate,
  formatToJapaneseDateTime,
} from "@/lib/date-fns/get-date";
import { deviceStates } from "../../../../data/data";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const data: DeviceBaseInfo[] = [
  {
    label: "name",
    title: "デバイスID",
    value: "1234567890",
    explanation: "デバイスを管理するID",
  },
];

export type DeviceBaseInfo = {
  label: string;
  title: string;
  value: AndroidManagementDevice[keyof AndroidManagementDevice] | null;
  explanation: string;
};
const deviceBaseInfoItems = [
  {
    label: "name",
    title: "デバイスID",
    explanation: "デバイスを管理するID",
  },
  {
    label: "userName",
    title: "ユーザーID",
    explanation: "デバイスに自動で設定されたユーザーを管理するID",
  },
  {
    label: "state",
    title: "デバイスにリクエストされている状態",
    explanation: "デバイスが無効化されている場合、「無効」と表示されます。",
  },
  {
    label: "appliedState",
    title: "デバイスに適用されている状態",
    explanation: "現在、デバイスに適用されている状態。",
  },
  {
    label: "enrollmentTime",
    title: "登録日時",
    explanation: "デバイスが管理された日時。",
  },
  {
    label: "ownership",
    title: "所有権",
    explanation: "デバイスの所有権",
  },
  {
    label: "managementMode",
    title: "管理モード",
    explanation:
      "デバイスで使用されている管理モード。各モードにより、デバイスに設定できるポリシーが制限されます。",
  },
  {
    label: "systemProperties",
    title: "システムプロパティ",
    explanation: "デバイスのシステムプロパティ情報。",
  },
  {
    label: "previousDeviceNames",
    title: "過去のデバイス名",
    explanation:
      "過去のデバイスID。以前に使用されていたデバイスのIDを表示します。",
  },
];

export const columns: ColumnDef<DeviceBaseInfo>[] = [
  {
    accessorKey: "title",
    header: "項目",
    cell: ({ row }) => (
      <div className="flex items-center gap-4">
        {row.getValue("title")}
        <Tooltip>
          <TooltipTrigger>
            <InfoIcon size={15} className="shrink-0" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{row.original.explanation}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    ),
  },
  {
    accessorKey: "value",
    header: "値",
    cell: ({ row }) => (
      <span className="break-all">{row.getValue("value")}</span>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const deviceBaseInfo = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {/* <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(deviceBaseInfo.value)
              }
            >
              Copy payment ID
            </DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function DeviceBaseInfoTable({
  deviceSource,
  enterpriseId,
  deviceIdentifier,
}: {
  deviceSource: HardwareInfoSourceType;
  enterpriseId: string;
  deviceIdentifier: string;
}) {
  const transformedDeviceBaseInfoItems = deviceBaseInfoItems.map(
    (deviceBaseInfoItem) => {
      const label = deviceBaseInfoItem.label;
      if (label === "enrollmentTime" && deviceSource?.enrollmentTime) {
        const enrollmentTime = deviceSource.enrollmentTime;
        return {
          ...deviceBaseInfoItem,
          value: formatToJapaneseDateTime(enrollmentTime),
        };
      }
      if (
        (label === "state" || label === "appliedState") &&
        deviceSource?.[label]
      ) {
        const state = deviceStates.find((state) => {
          return state.value === deviceSource[label];
        });
        const value = state?.label;
        return {
          ...deviceBaseInfoItem,
          value,
        };
      }
      if (label === "ownership" && deviceSource?.ownership) {
        const ownership = deviceOwnership.find((ownership) => {
          return ownership.value === deviceSource[label];
        });
        const value = ownership?.label;
        return {
          ...deviceBaseInfoItem,
          value,
        };
      }
      if (label === "managementMode" && deviceSource?.managementMode) {
        const managementMode = deviceManagementMode.find((managementMode) => {
          return managementMode.value === deviceSource[label];
        });
        const value = managementMode?.label;
        return {
          ...deviceBaseInfoItem,
          value,
        };
      }
      if (label === "systemProperties" && deviceSource?.systemProperties) {
        const systemProperties = deviceSource.systemProperties;
        const value = JSON.stringify(systemProperties);
        return {
          ...deviceBaseInfoItem,
          value,
        };
      }
      if (
        label === "previousDeviceNames" &&
        deviceSource?.previousDeviceNames
      ) {
        const previousDeviceNames = deviceSource.previousDeviceNames;
        const filteredPreviousDeviceIDs = previousDeviceNames.map((name) => {
          return name.split("devices/")[1];
        });
        const value = filteredPreviousDeviceIDs.join(", ");
        return {
          ...deviceBaseInfoItem,
          value,
        };
      }
      const value =
        deviceSource?.[
          deviceBaseInfoItem.label as keyof AndroidManagementDevice
        ];
      return {
        ...deviceBaseInfoItem,
        value,
      };
    }
  );
  // const transformedDeviceBaseInfoItems = deviceBaseInfoItems.map(
  //   (deviceBaseInfoItem) => ({
  //     ...deviceBaseInfoItem,
  //     value:
  //       deviceSource?.[
  //         deviceBaseInfoItem.label as keyof AndroidManagementDevice
  //       ],
  //   })
  // );
  const table = useReactTable({
    data: transformedDeviceBaseInfoItems,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card className="">
      <TooltipProvider delayDuration={200}>
        <CardHeader>
          <CardTitle>デバイス情報</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="w-1/2 last:w-1/3">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      データがありません。
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </TooltipProvider>
    </Card>
  );
}
export const deviceOwnership = [
  {
    value: "OWNERSHIP_UNSPECIFIED",
    label: "所有権の指定なし",
  },
  {
    value: "COMPANY_OWNED",
    label: "会社所有",
  },
  {
    value: "PERSONALLY_OWNED",
    label: "個人所有",
  },
];
export const deviceManagementMode = [
  {
    value: "DEVICE_OWNER",
    label: "デバイスオーナー",
  },
  {
    value: "PROFILE_OWNER",
    label: "プロフィールオーナー",
  },
];
