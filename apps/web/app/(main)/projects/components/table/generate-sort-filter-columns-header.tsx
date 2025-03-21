import { ColumnDef } from "@tanstack/react-table";
import { TableColumnDefinition } from "../../types/column";
import { DataTableColumnHeader } from "./data-table-column-header";

export function generateSortFilterColumnsHeader<T>(
  devicesTableColumnList: TableColumnDefinition[]
): ColumnDef<T>[] {
  return devicesTableColumnList.map((def) => ({
    accessorKey: def.accessorKey,
    id: def.title,
    minSize: def.minSize,
    size: def.size,
    maxSize: def.maxSize,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={def.title} />
    ),
    cell: ({ row, column }) => (
      <div className="truncate pl-4" title={row.getValue(column.id)}>
        {row.getValue(column.id)}
      </div>
    ),
  }));
}
