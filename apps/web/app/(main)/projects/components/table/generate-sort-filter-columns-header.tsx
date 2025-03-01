import { ColumnDef } from "@tanstack/react-table";
import { TableColumnDefinition } from "../../types/column";
import { DataTableColumnHeader } from "./data-table-column-header";

export function generateSortFilterColumnsHeader<T>(
  devicesTableColumnList: TableColumnDefinition[]
): ColumnDef<T>[] {
  return devicesTableColumnList.map((def) => ({
    accessorKey: def.accessorKey,
    minSize: def.minSize,
    size: def.size,
    maxSize: def.maxSize,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={def.title} />
    ),
    cell: ({ row }) => (
      <div className="truncate pl-4" title={row.getValue(def.accessorKey)}>
        {row.getValue(def.accessorKey)}
      </div>
    ),
  }));
}
