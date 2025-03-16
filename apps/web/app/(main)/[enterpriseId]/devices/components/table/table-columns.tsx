"use client";

import { ColumnDef } from "@tanstack/react-table";

import {
  ArrowUpDown,
  CheckCircle2Icon,
  LucideXCircle,
  PlusIcon,
} from "lucide-react"; // 行アクション

import { Button } from "@/components/ui/button";
import { formatToJapaneseDateTime } from "@/lib/date-fns/get-date";
import { devicesTableColumnList } from "../../data/columnList";

import { DeviceTableType } from "@/app/types/device";
import { DataTableColumnHeader } from "../../../../projects/components/table/data-table-column-header";
import { generateSortFilterColumnsHeader } from "../../../../projects/components/table/generate-sort-filter-columns-header";
import { selectColumn } from "../../../../projects/components/table/select-column";
import DataTableColumnState from "./table-column-state";
import DeviceTableMenu from "./table-menu";

export const deviceColumns: ColumnDef<DeviceTableType>[] = [
  selectColumn<DeviceTableType>(),
  {
    accessorKey: "number",
    accessorFn: (_, index) => index + 1,
    minSize: 48, //
    size: 48, //
    enableResizing: false, // リサイズを無効化
    header: ({ column }) => (
      <div className={"flex items-center justify-center space-x-2"}>
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-2 flex group h-8"
        >
          <span className="group-hover:hidden size-4">No.</span>
          <ArrowUpDown className="size-4 hidden group-hover:block" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div
        className="truncate flex items-center justify-center"
        title={String(row.index + 1)}
      >
        {row.index + 1}
      </div>
    ),
    enableHiding: false, // 非表示を無効化
  },
  ...generateSortFilterColumnsHeader<DeviceTableType>(devicesTableColumnList),
  {
    accessorKey: "appliedState",
    id: "ステータス",
    minSize: 160,
    size: 180,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row, column }) => {
      return <DataTableColumnState row={row} column={column} />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  // {
  //   accessorKey: "appliedPolicyVersion",
  //   id: "ポリシー バージョン",
  //   minSize: 225,
  //   size: 250,
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title={column.id} />
  //   ),
  //   cell: ({ row, column }) => <div>{row.getValue(column.id)}</div>,
  // },
  {
    accessorKey: "policyCompliant",
    id: "ポリシー 準拠",
    minSize: 180,
    size: 200,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row, column }) => {
      const isCompliant = row.getValue(column.id);
      return (
        <div className="flex items-center justify-center">
          {isCompliant === "true" ? (
            <CheckCircle2Icon className="h-5 w-5 text-green-500" />
          ) : isCompliant === "false" ? (
            <LucideXCircle className="h-5 w-5 text-red-500" />
          ) : null}
        </div>
      );
    },
  },
  {
    accessorKey: "lastStatusReportTime",
    id: "同期時刻",
    minSize: 150,
    size: 200,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row, column }) => {
      return (
        <div className="flex items-center justify-center">
          {row.getValue(column.id)
            ? formatToJapaneseDateTime(row.getValue(column.id))
            : "不明"}
        </div>
      );
    },
  },
  // {
  //   accessorKey: "lastPolicySyncTime",
  //   id: "ポリシー同期時刻",
  //   minSize: 210,
  //   size: 220,
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title={column.id} />
  //   ),
  //   cell: ({ row, column }) => {
  //     return (
  //       <div>
  //         {row.getValue(column.id)
  //           ? formatToJapaneseDateTime(row.getValue(column.id))
  //           : "不明"}
  //       </div>
  //     );
  //   },
  // },
  {
    id: "actions",
    enableResizing: false, // リサイズを無効化
    minSize: 50,
    size: 80,
    header: () => {
      return (
        <div className="flex items-center justify-center">
          <Button variant="ghost" size="icon">
            <PlusIcon className="size-4" />
            <span className="sr-only">メニューを開く</span>
          </Button>
          <div title="メニュー" />
        </div>
      );
    },
    cell: ({ row }) => {
      const device = row.original;
      if (!device) return null;
      return (
        <div className="flex items-center justify-center m-1">
          <DeviceTableMenu device={device} />
        </div>
      );
    },
  },
];
