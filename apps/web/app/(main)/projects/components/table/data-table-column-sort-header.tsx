import { Column } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

interface DataTableColumnSortHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnSortHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnSortHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className=" h-8"
      >
        <span>{title}</span>
        {column.getIsSorted() === "desc" ? (
          <ArrowDownIcon className="size-4" />
        ) : column.getIsSorted() === "asc" ? (
          <ArrowUpIcon className="size-4" />
        ) : (
          <ChevronsUpDownIcon className="size-4" />
        )}
      </Button>
    </div>
  );
}
