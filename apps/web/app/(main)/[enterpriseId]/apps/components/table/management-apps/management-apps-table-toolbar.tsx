"use client";

import { Table } from "@tanstack/react-table";
import { RefreshCcwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { appTypeItems } from "../../../data/app-type";
import DeleteSelectedAppsButton from "./delete-selected-apps-button";
import { ManagementTableFacetedFilter } from "./management-table-faceted-filter";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface ManagementAppsTableToolbarProps<TData> {
  table: Table<TData>;
  className?: string;
}

export function ManagementAppsTableToolbar<TData>({
  className,
  table,
}: ManagementAppsTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const isSelected = table.getFilteredSelectedRowModel().rows.length > 0;

  const minSdkVersionItems = useMemo(() => {
    const values = new Set(
      table.getRowModel().rows.map((row) => row.getValue("minSdkVersion"))
    );
    return Array.from(values)
      .sort((a, b) => Number(b) - Number(a)) // 降順にソート
      .map((value) => ({
        label: String(value),
        value: String(value), // 値のフィルター、カウントに使用
      }));
  }, [table]);
  return (
    <ScrollArea>
      <div
        className={cn(
          "flex items-center justify-between w-full max-w-full",
          className
        )}
      >
        <div className="flex flex-1 min-w-0 items-center">
          <div className="w-[52px] flex justify-center">
            <SidebarTrigger className="w-full" />
          </div>
          <div className="w-[54px] flex justify-center ">
            {isSelected && <DeleteSelectedAppsButton table={table} />}
          </div>
          <div className="w-[54px] flex justify-center">
            {isFiltered && (
              <Button
                variant="ghost"
                onClick={() => table.resetColumnFilters()}
                className="h-8"
                size="icon"
              >
                <span className="sr-only">リセット</span>
                <RefreshCcwIcon className="size-4" />
              </Button>
            )}
          </div>
          <div className="flex w-full max-w-full space-x-1">
            <Input
              placeholder="アプリ名を検索"
              value={
                (table.getColumn("アプリ名")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("アプリ名")?.setFilterValue(event.target.value)
              }
              className="h-8 w-[246px]"
            />
            <Input
              placeholder="パッケージ名を検索"
              value={
                (table.getColumn("パッケージ名")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) => {
                table
                  .getColumn("パッケージ名")
                  ?.setFilterValue(event.target.value);
              }}
              className="h-8 w-[243px]"
            />
            {table.getColumn("アプリ種別") && (
              <ManagementTableFacetedFilter
                column={table.getColumn("アプリ種別")}
                title="アプリ種別"
                options={appTypeItems}
              />
            )}
            {table.getColumn("minSdkVersion") && (
              <ManagementTableFacetedFilter
                column={table.getColumn("minSdkVersion")}
                title="minSdkVersion"
                options={minSdkVersionItems}
                className="w-[148px]"
              />
            )}
          </div>
        </div>
        <div className="flex text-xs text-muted-foreground items-center justify-center min-w-[50px] px-1"></div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
