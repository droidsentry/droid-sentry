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
import CopyButton from "@/components/copy-button";

export type DeviceBaseInfo = {
  label: string;
  title: string;
  value: string | null;
  explanation: string;
};
const deviceBaseInfoItems = [
  {
    label: "name",
    title: "デバイスID",
    explanation: "デバイスを管理するID",
    value: null,
  },
  {
    label: "userName",
    title: "ユーザーID",
    explanation: "デバイスに自動で設定されたユーザーを管理するID",
    value: null,
  },
  {
    label: "state",
    title: "デバイスにリクエストされている状態",
    explanation: "デバイスが無効化されている場合、「無効」と表示されます。",
    value: null,
  },
  {
    label: "appliedState",
    title: "デバイスに適用されている状態",
    explanation: "現在、デバイスに適用されている状態。",
    value: null,
  },
  {
    label: "enrollmentTime",
    title: "登録日時",
    explanation: "デバイスが管理された日時。",
    value: null,
  },
  {
    label: "ownership",
    title: "所有権",
    explanation: "デバイスの所有権",
    value: null,
  },
  {
    label: "managementMode",
    title: "管理モード",
    explanation:
      "デバイスで使用されている管理モード。各モードにより、デバイスに設定できるポリシーが制限されます。",
    value: null,
  },
  {
    label: "systemProperties",
    title: "システムプロパティ",
    explanation: "デバイスのシステムプロパティ情報。",
    value: null,
  },
  {
    label: "previousDeviceNames",
    title: "過去のデバイス名",
    explanation:
      "過去のデバイスID。以前に使用されていたデバイスのIDを表示します。",
    value: null,
  },
];
const deviceOwnership = [
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
const deviceManagementMode = [
  {
    value: "DEVICE_OWNER",
    label: "デバイスオーナー",
  },
  {
    value: "PROFILE_OWNER",
    label: "プロフィールオーナー",
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
      const deviceBaseInfo = row.original.value;
      if (!deviceBaseInfo) return null;

      return <CopyButton value={deviceBaseInfo} />;
    },
  },
];

export function DeviceBaseInfoTable({
  deviceSource,
}: {
  deviceSource: HardwareInfoSourceType;
}) {
  const transformedDeviceBaseInfoItems =
    transformDeviceBaseInfoItems(deviceSource);

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

/**
 * デバイス情報のテーブルに表示するためのデータに変換する
 * @param deviceSource デバイス情報のソースデータ
 * @returns テーブルに表示するためのデータ
 */
const transformDeviceBaseInfoItems = (deviceSource: HardwareInfoSourceType) => {
  return deviceBaseInfoItems.map((deviceBaseInfoItem) => {
    const label = deviceBaseInfoItem.label;
    if ((label === "name" || label === "userName") && deviceSource?.[label]) {
      const value = deviceSource[label].includes("devices/")
        ? deviceSource[label].split("devices/")[1]
        : deviceSource[label].includes("users/")
          ? deviceSource[label].split("users/")[1]
          : null;
      return {
        ...deviceBaseInfoItem,
        value,
      };
    }
    if (
      (label === "state" || label === "appliedState") &&
      deviceSource?.[label]
    ) {
      const state = deviceStates.find((state) => {
        return state.value === deviceSource[label];
      });
      const value = state?.label ?? null;
      return {
        ...deviceBaseInfoItem,
        value,
      };
    }
    if (label === "enrollmentTime" && deviceSource?.[label]) {
      const enrollmentTime = deviceSource[label];
      const value = formatToJapaneseDateTime(enrollmentTime);
      return {
        ...deviceBaseInfoItem,
        value,
      };
    }
    if (label === "ownership" && deviceSource?.[label]) {
      const ownership = deviceOwnership.find((ownership) => {
        return ownership.value === deviceSource[label];
      });
      const value = ownership?.label ?? null;
      return {
        ...deviceBaseInfoItem,
        value,
      };
    }
    if (label === "managementMode" && deviceSource?.[label]) {
      const managementMode = deviceManagementMode.find((managementMode) => {
        return managementMode.value === deviceSource[label];
      });
      const value = managementMode?.label ?? null;
      return {
        ...deviceBaseInfoItem,
        value,
      };
    }
    if (label === "systemProperties" && deviceSource?.[label]) {
      const systemProperties = deviceSource[label];
      const value = JSON.stringify(systemProperties) ?? null;
      return {
        ...deviceBaseInfoItem,
        value,
      };
    }
    if (label === "previousDeviceNames" && deviceSource?.[label]) {
      const previousDeviceNames = deviceSource[label];
      const filteredPreviousDeviceIDs = previousDeviceNames.map((name) => {
        return name.split("devices/")[1];
      });
      const value = filteredPreviousDeviceIDs.join(", ") ?? null;
      return {
        ...deviceBaseInfoItem,
        value,
      };
    }
    // デフォルト
    return {
      ...deviceBaseInfoItem,
      value: deviceSource?.[label as keyof HardwareInfoSourceType] ?? null,
    };
  });
};
