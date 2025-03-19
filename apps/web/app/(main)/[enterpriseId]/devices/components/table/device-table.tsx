"use client";

import {
  ColumnDef,
  ColumnFiltersState, // フィルタリング
  SortingState, // ソート
  VisibilityState, // 可視性
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
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

import { cn } from "@/lib/utils";
import { useState } from "react";
import { TablePagination } from "../../../apps/components/table/table-pagination";
import { TableToolbar } from "./table-toolbar";
import FloatingToolbar from "./floating-toolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  enterpriseId: string;
  isMaxDevicesKittingPerUser: boolean;
}

export default function DeviceTable<TData, TValue>({
  columns,
  data,
  enterpriseId,
  isMaxDevicesKittingPerUser,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]); // ソート状態を管理
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]); // カラムフィルタリングの状態を管理
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({}); // カラムの可視性を管理
  const [rowSelection, setRowSelection] = useState({}); // 行の選択状態を管理

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
    onColumnFiltersChange: setColumnFilters, // カラムフィルタリング状態が変更されたときの処理
    getFilteredRowModel: getFilteredRowModel(), // フィルタリングされた行モデルを取得
    onColumnVisibilityChange: setColumnVisibility, // カラムの可視性が変更されたときの処理
    onRowSelectionChange: setRowSelection, // 行の選択状態が変更されたときの処理
    getFacetedRowModel: getFacetedRowModel(), // ファセットされた行モデルを取得
    getFacetedUniqueValues: getFacetedUniqueValues(), // ファセットされたユニークな値を取得

    state: {
      sorting, // ソート状態
      columnFilters, // カラムフィルタリング状態
      columnVisibility, // カラムの可視性
      rowSelection, // 行の選択状態
    },
    initialState: {
      pagination: {
        pageSize: 50, // デフォルトのページサイズ
      },
    },
  });

  return (
    <div className="flex flex-col h-full w-full p-1">
      <TableToolbar
        table={table}
        className="pb-2 pt-1"
        enterpriseId={enterpriseId}
        isMaxDevicesKittingPerUser={isMaxDevicesKittingPerUser}
      />
      <Table
        style={{ width: table.getCenterTotalSize() }}
        className={cn(
          "bg-background w-full",
          "border-separate border-spacing-0", // セルの境界を分離し、あとでボーダーを重ねる
          "mb-20"
        )}
      >
        <TableHeader className="z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className="group" key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    className={cn(
                      "sticky top-0",
                      "border-b z-10 bg-background border-l",
                      "[&:nth-child(2)]:border-l-0", // 2番目のセルの左ボーダーを削除
                      "first:sticky first:left-0 first:z-30 first:border-l-0 first:border-r",
                      "last:sticky  last:right-0 last:z-30 last:border-r",
                      "p-1 h-8",
                      "first:px-0"
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
          {table.getRowModel().rows?.length ? (
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
                      "first:sticky first:left-0 first:z-10 first:bg-background first:border-r",
                      "[&:nth-child(3)]:border-l", // 3番目のセルの左ボーダーを追加
                      "last:sticky last:right-0 last:z-10 last:bg-background last:border-r last:border-l",
                      "p-0",
                      "transition-all duration-200"
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
      <TablePagination table={table} className="pt-1" />
      <FloatingToolbar table={table} />
    </div>
  );
}
