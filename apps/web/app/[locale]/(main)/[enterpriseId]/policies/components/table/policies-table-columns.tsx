"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { formatToJapaneseDateTime } from "@/lib/date-fns/get-date";
import { ArrowUpDown, PlusIcon } from "lucide-react";
import { selectColumn } from "../../../../projects/components/table/select-column";

import PoliciesTableMenu from "./policies-table-menu";
import { DataTableColumnSortHeader } from "@/app/[locale]/(main)/projects/components/table/data-table-column-sort-header";
import { PolicyTableType } from "@/app/types/policy";

export const policyColumns: ColumnDef<PolicyTableType>[] = [
  selectColumn<PolicyTableType>(),
  {
    accessorKey: "number",
    accessorFn: (_, index) => index + 1,
    minSize: 48, //05
    size: 48, //
    header: ({ column }) => (
      <div className={"flex items-center justify-center space-x-2"}>
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-2 flex group"
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
  },
  {
    accessorKey: "policyDisplayName",
    minSize: 170,
    size: 250,
    header: ({ column }) => (
      <DataTableColumnSortHeader column={column} title="ポリシー名" />
    ),
    cell: ({ row }) => (
      <div className="truncate pl-4" title={row.getValue("policyDisplayName")}>
        {row.getValue("policyDisplayName")}
      </div>
    ),
    filterFn: "includesString", //大文字と小文字を区別しない
  },
  {
    accessorKey: "version",
    minSize: 120,
    size: 120,
    header: ({ column }) => (
      <DataTableColumnSortHeader column={column} title="Ver." />
    ),
    cell: ({ row }) => (
      <div
        className="truncate flex items-center justify-center"
        title={row.getValue("version")}
      >
        {row.getValue("version")}
      </div>
    ),
    meta: {
      title: "Ver.",
    },
  },
  {
    accessorKey: "createdAt",
    minSize: 200,
    size: 200,
    header: ({ column }) => (
      <DataTableColumnSortHeader column={column} title="作成日時" />
    ),
    cell: ({ row }) => (
      <div
        className="truncate flex items-center justify-center"
        title={row.getValue("createdAt")}
      >
        {formatToJapaneseDateTime(row.getValue("createdAt"))}
      </div>
    ),
  },
  {
    accessorKey: "updatedAt",
    minSize: 200,
    size: 200,
    header: ({ column }) => (
      <DataTableColumnSortHeader column={column} title="更新日時" />
    ),
    cell: ({ row }) => (
      <div
        className="truncate flex items-center justify-center"
        title={row.getValue("updatedAt")}
      >
        {formatToJapaneseDateTime(row.getValue("updatedAt"))}
      </div>
    ),
  },
  {
    id: "actions",
    enableResizing: false, // リサイズを無効化
    minSize: 50,
    size: 80,
    header: () => {
      return (
        <div className="flex items-center justify-center">
          <Button variant="ghost" size="icon">
            <PlusIcon className="h-4 w-4" />
            <span className="sr-only">カラムを追加</span>
          </Button>
          <div title="カラムを追加" />
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center">
          <PoliciesTableMenu row={row} />
        </div>
      );
    },
  },
];
