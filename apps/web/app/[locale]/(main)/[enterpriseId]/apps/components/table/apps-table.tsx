"use client";

import {
  ColumnDef,
  SortingState, // 可視性
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel, // ソート
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table-resizing";

import { DensityFeature } from "@/app/[locale]/(main)/projects/types/density";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { AppsTableToolbar } from "./apps-table-toolbar";
import LoaderTable from "./loader-table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  className?: string;
  isValidating?: boolean;
}

export default function AppsTable<TData, TValue>({
  columns,
  data,
  className,
  isValidating,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]); // ソート状態を管理

  const table = useReactTable({
    data,
    columns,
    columnResizeMode: "onChange", // リアルタイムで列のリサイズを行う
    enableColumnResizing: true, // カラムのリサイズを有効化
    onStateChange: () => {}, // 状態変更時の処理
    getCoreRowModel: getCoreRowModel(), // コア行モデルを取得
    getPaginationRowModel: getPaginationRowModel(), // ページネーション行モデルを取得
    onSortingChange: setSorting, // ソート状態が変更されたときの処理
    getSortedRowModel: getSortedRowModel(), // ソートされた行モデルを取得
    getFilteredRowModel: getFilteredRowModel(), // フィルタリングされた行モデルを取得
    _features: [DensityFeature], // 行の密度を管理する機能を追加
    state: {
      sorting, // ソート状態
    },
    initialState: {
      pagination: {
        pageSize: 300, // デフォルトのページサイズ
      },
    },
  });

  return (
    <div className={cn("flex flex-col h-full w-full max-w-full", className)}>
      <AppsTableToolbar table={table} className="pb-1" />
      <Table
        style={{ width: table.getCenterTotalSize() }}
        className={cn(
          isValidating ? "bg-transparent" : "bg-background",
          // "p-1",
          "border-separate border-spacing-0" // セルの境界を分離し、あとでボーダーを重ねる
        )}
      >
        <TableHeader className="z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className="" key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    className={cn(
                      "sticky top-0",
                      "border-b z-10 bg-background border-l",
                      "[&:nth-child(2)]:border-l-0", // 2番目のセルの左ボーダーを削除
                      "first:sticky first:left-0 first:z-30 first:border-l-0 first:border-r",
                      "last:sticky  last:right-0 last:z-30 last:border-r-0",
                      "p-1 h-8"
                    )}
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ width: `${header.getSize()}px` }}
                  >
                    {header.column.columnDef.enableResizing !== false && (
                      <div
                        className={cn(
                          "absolute inset-y-0 -right-2",
                          "w-4 cursor-col-resize z-30" // 幅を狭く
                        )}
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        onDoubleClick={() => header.column.resetSize()} // ダブルクリックで自動リサイズ
                        style={{
                          userSelect: "none",
                          touchAction: "none",
                        }}
                      >
                        <span className="sr-only">リサイズハンドラー</span>
                      </div>
                    )}
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
          {isValidating ? (
            <LoaderTable />
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                className="group"
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      "relative",
                      "whitespace-nowrap overflow-hidden",
                      "border-b",
                      "border-l",
                      "first:sticky first:left-0 first:z-10 first:bg-background first:border-r first:border-l-0",
                      "[&:nth-child(2)]:border-l-0", // 2番目のセルの左ボーダーを追加
                      "last:sticky last:right-0 last:z-10 last:bg-background last:border-r-0 last:border-l",
                      "p-0"
                    )}
                    style={{ maxWidth: `${cell.column.getSize()}px` }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                データがありません。
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* <PoliciesTablePagination table={table} className="pt-1" /> */}
    </div>
  );
}
