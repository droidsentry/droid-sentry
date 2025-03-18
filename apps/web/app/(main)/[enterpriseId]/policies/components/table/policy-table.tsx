"use client";

import {
  ColumnDef, // 可視性
  flexRender,
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
import { TablePagination } from "../../../apps/components/table/table-pagination";
import { useResizeColumn } from "../../../providers/policies-table";
import { usePoliciesTable } from "../policies-table-provider";
import { PoliciesTableToolbar } from "./policies-table-toolbar";
import { PolicyTableType } from "@/lib/types/policy";

interface DataTableProps<TData extends PolicyTableType, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

export default function PoliciesTable<TData extends PolicyTableType, TValue>({
  columns,
}: DataTableProps<TData, TValue>) {
  const { table, enterpriseId } = usePoliciesTable();
  const { autoResizeColumn } = useResizeColumn();

  return (
    <div className="flex flex-col h-full w-full max-w-full p-1">
      <PoliciesTableToolbar
        table={table}
        className="pb-1"
        enterpriseId={enterpriseId}
      />
      <Table
        style={{ width: table.getCenterTotalSize() }}
        className={cn(
          "bg-background",
          "border-separate border-spacing-0" // セルの境界を分離
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
                        onDoubleClick={() => autoResizeColumn(header.id)} // ダブルクリックで自動リサイズ
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
    </div>
  );
}
