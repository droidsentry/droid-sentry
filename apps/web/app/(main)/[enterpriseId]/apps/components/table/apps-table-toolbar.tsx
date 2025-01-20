"use client";

import { Table } from "@tanstack/react-table";
import { RefreshCcwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface PublicAppsTableToolbarProps<TData> {
  table: Table<TData>;
  className?: string;
}

export function AppsTableToolbar<TData>({
  className,
  table,
}: PublicAppsTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div
      className={cn(
        "flex items-center justify-between w-full max-w-full",
        className
      )}
    >
      <div className="flex items-center flex-1">
        <div className="min-w-[50px] flex justify-center">
          <SidebarTrigger className="w-full mx-1" />
        </div>

        <div className="flex w-full max-w-full gap-1">
          <Input
            placeholder="アプリ名を検索"
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="h-8 w-full"
          />
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
      </div>
      <div className="flex text-xs text-muted-foreground items-center justify-center min-w-[50px] px-1">
        {table.getFilteredRowModel().rows.length} /{" "}
        {table.getCoreRowModel().rows.length}
      </div>
    </div>
  );
}
