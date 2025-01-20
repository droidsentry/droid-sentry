import { TableCell, TableRow } from "@/components/ui/table-resizing";
import { Loader2Icon } from "lucide-react";

export default function LoaderTable() {
  return (
    <TableRow>
      <TableCell>
        <div className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Loader2Icon className="animate-spin size-10 text-muted-foreground/30" />
        </div>
      </TableCell>
    </TableRow>
  );
}
