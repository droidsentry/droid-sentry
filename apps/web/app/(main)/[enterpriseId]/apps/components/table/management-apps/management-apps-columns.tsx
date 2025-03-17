"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/app/(main)/components/table/column-header";
import { DataTableColumnSortHeader } from "@/app/(main)/components/table/column-sort-header";
import { selectColumn } from "@/app/(main)/components/table/select-column";
import { AppsTableType } from "@/app/types/apps";
import { Button } from "@/components/ui/button";
import {
  formatToJapaneseDate,
  formatToJapaneseDateTime,
} from "@/lib/date-fns/get-date";
import { cn } from "@/lib/utils";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import { appTypeItems } from "../../../data/app-type";
import AppsTableMenu from "../apps-table-menu";
import { ManagementTableViewOptions } from "./management-table-view-options";

export const ManagementAppsColumns: ColumnDef<AppsTableType>[] = [
  selectColumn<AppsTableType>(),
  {
    accessorKey: "number",
    accessorFn: (_, index) => index + 1,
    minSize: 48, //
    size: 48, //
    enableResizing: false, // リサイズを無効化
    header: ({ column }) => (
      <div className={"flex items-center justify-center space-x-2 "}>
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
  {
    accessorKey: "iconUrl",
    minSize: 48,
    size: 48,
    header: () => (
      <div className="flex items-center justify-center size-10 pt-1">Icon</div>
    ),
    cell: ({ row }) => {
      return (
        <div className={cn("flex items-center justify-center flex-1 p-1")}>
          <div
            className={cn(
              "overflow-hidden border-default rounded-md relative border",
              "h-full w-full",
              "aspect-square"
            )}
            title={row.getValue("iconUrl")}
          >
            <Image
              src={row.getValue("iconUrl")}
              alt="アプリアイコン"
              fill
              sizes="40px"
            />
          </div>
        </div>
      );
    },
    enableHiding: false, // 非表示を無効化
  },
  {
    accessorKey: "title",
    id: "アプリ名",
    minSize: 150,
    size: 250,
    header: ({ column }) => (
      <DataTableColumnSortHeader column={column} title={column.id} />
    ),
    cell: ({ row, column }) => (
      <div className="truncate pl-4" title={row.getValue(column.id)}>
        {row.getValue(column.id)}
      </div>
    ),
    filterFn: "includesString", //大文字と小文字を区別しない
  },
  {
    accessorKey: "packageName",
    id: "パッケージ名",
    minSize: 150,
    size: 250,
    header: ({ column }) => (
      <DataTableColumnSortHeader column={column} title={column.id} />
    ),
    cell: ({ row, column }) => (
      <div className="truncate pl-4" title={row.getValue(column.id)}>
        {row.getValue(column.id)}
      </div>
    ),
    filterFn: "includesString", //大文字と小文字を区別しない
  },
  {
    accessorKey: "appType",
    id: "アプリ種別",
    minSize: 150,
    size: 150,
    header: ({ column }) => (
      <DataTableColumnSortHeader column={column} title={column.id} />
    ),
    cell: ({ row, column }) => {
      const appType = appTypeItems.find(
        (item) => item.value === row.getValue(column.id)
      );
      return (
        <div
          className="truncate flex items-center justify-start pl-4"
          title={appType?.title || "不明"}
        >
          {appType?.label || "不明"}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "minAndroidSdkVersion",
    id: "minSdkVersion",
    minSize: 170,
    size: 170,
    header: ({ column }) => (
      <DataTableColumnSortHeader column={column} title={column.id} />
    ),
    cell: ({ row, column }) => (
      <div
        className="truncate flex items-center justify-center"
        title={row.getValue(column.id)}
      >
        <span className="flex items-center justify-start">
          {row.getValue(column.id)}
        </span>
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "updateTime",
    id: "アプリ更新日",
    minSize: 160,
    size: 160,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row, column }) => (
      <div
        className="truncate flex items-center justify-center"
        title={row.getValue(column.id)}
      >
        {formatToJapaneseDate(row.getValue(column.id))}
      </div>
    ),
  },
  {
    accessorKey: "created_at",
    id: "アプリ情報の登録日",
    minSize: 196,
    size: 200,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row, column }) => (
      <div
        className="truncate flex items-center justify-center pl-2"
        title={row.getValue(column.id)}
      >
        {formatToJapaneseDateTime(row.getValue(column.id))}
      </div>
    ),
  },
  {
    accessorKey: "updated_at",
    id: "アプリ情報の更新日",
    minSize: 196,
    size: 200,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row, column }) => (
      <div
        className="truncate flex items-center justify-center pl-2"
        title={row.getValue(column.id)}
      >
        {formatToJapaneseDateTime(row.getValue(column.id))}
      </div>
    ),
  },
  {
    id: "actions",
    enableResizing: false, // リサイズを無効化
    minSize: 40,
    size: 40,
    header: ({ table }) => {
      return (
        <div className="flex items-center justify-center">
          <ManagementTableViewOptions table={table} />
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center">
          <AppsTableMenu row={row} className="size-6" />
        </div>
      );
    },
  },
];
