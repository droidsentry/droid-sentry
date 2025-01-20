import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

export const selectColumn = <T extends object>(): ColumnDef<T> => ({
  id: "select",
  minSize: 48,
  size: 48,
  header: ({ table }) => (
    <div className="flex items-center justify-center">
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    </div>
  ),
  cell: ({ row }) => (
    <div className="flex items-center justify-center">
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    </div>
  ),
  enableSorting: false,
  enableHiding: false,
  enableResizing: false,
});
