"use client";

import { ColumnDef } from "@tanstack/react-table";

import { AppsTableType } from "@/app/types/apps";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { DataTableColumnSortHeader } from "../../../../projects/components/table/data-table-column-sort-header";
import AppsTableMenu from "./apps-table-menu";

type AppsColumnDef = ColumnDef<AppsTableType>;

export const appsColumns: AppsColumnDef[] = [
  {
    accessorKey: "iconUrl",
    minSize: 40,
    size: 40,
    header: () => (
      <div className="flex items-center justify-center size-10 pt-1">Icon</div>
    ),
    cell: ({ row }) => {
      return (
        <div
          className={cn(
            "p-1 size-12"
            // density === "sm" ? "size-8" : "size-10"
          )}
        >
          <div
            className="overflow-hidden border-default rounded-md size-10 relative border"
            title={row.getValue("iconUrl")}
          >
            <Image
              src={row.getValue("iconUrl")}
              alt="アプリアイコン"
              sizes="40px"
              fill
            />
          </div>
        </div>
      );
    },
    enableResizing: false, // リサイズを無効化
  },
  {
    accessorKey: "title",
    minSize: 100,
    size: 250,
    header: ({ column }) => (
      <DataTableColumnSortHeader column={column} title="アプリ名" />
    ),
    cell: ({ row }) => (
      <div className="truncate pl-4" title={row.getValue("title")}>
        {row.getValue("title")}
      </div>
    ),
    filterFn: "includesString", //大文字と小文字を区別しない
  },
  {
    id: "actions",
    enableResizing: false, // リサイズを無効化
    minSize: 50,
    size: 50,
    header: () => {
      return <div className="flex items-center justify-center"></div>;
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
