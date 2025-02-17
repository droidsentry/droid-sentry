import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import TitleTooltip from "../../../../../../components/title-tooltip";

interface CloseFloatingToolbarButtonProps<TData> {
  table: Table<TData>;
  isSelected: boolean;
}

export default function CloseFloatingToolbarButton<TData>({
  table,
  isSelected,
}: CloseFloatingToolbarButtonProps<TData>) {
  return (
    <TitleTooltip tooltip="選択したデバイスを解除し、ツールバーを閉じます。">
      <Button
        variant="ghost"
        size="icon"
        tabIndex={isSelected ? 0 : -1}
        disabled={!isSelected}
        onClick={() => {
          table.resetRowSelection();
        }}
      >
        <X className="size-2" />
      </Button>
    </TitleTooltip>
  );
}
