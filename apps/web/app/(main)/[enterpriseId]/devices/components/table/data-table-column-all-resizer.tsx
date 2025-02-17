import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { Maximize2Icon, Minimize2Icon } from "lucide-react";
import { useMemo, useState } from "react";

interface DataTableAllResizerProps<TData> {
  table: Table<TData>;
}

export default function DateTableColumnAllResizer<TData>({
  table,
}: DataTableAllResizerProps<TData>) {
  const [isExpanded, setIsExpanded] = useState(false); // 状態を追加

  // カラムごとの最大文字数を計算する関数をメモ化
  const calculateMaxColumnWidth = useMemo(
    () => (columnId: string) => {
      // console.log("columnId", columnId);
      // columnsの定義からデフォルトサイズを取得
      const columnDef = table.getColumn(columnId)?.columnDef;
      const defaultSize = columnDef?.size ?? 200;
      // console.log("defaultSize", defaultSize);

      // 文字種別ごとの幅を計算
      const getCharWidth = (char: string): number => {
        if (
          /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\u3400-\u4dbf]/.test(
            char
          )
        ) {
          return 20; // 日本語文字（漢字、ひらがな、カタカナ）
        } else if (/[A-Z]/.test(char)) {
          return 12; // 英大文字
        } else if (/[a-z0-9]/.test(char)) {
          return 9; // 英小文字と数字
        }
        return 8; // その他の文字
      };

      // セルの内容の最大幅を計算
      const maxContentWidth = table.getRowModel().rows.reduce((max, row) => {
        const cell = row
          .getAllCells()
          .find((cell) => cell.column.id === columnId);
        const content = cell?.getValue()?.toString() ?? "";
        const width = Array.from(content).reduce(
          (sum, char) => sum + getCharWidth(char),
          0
        );
        return Math.max(max, width);
      }, 0);
      // console.log("maxContentWidth", maxContentWidth);

      const padding = 0;
      const contentBasedWidth = maxContentWidth + padding;
      // console.log("contentBasedWidth", contentBasedWidth);
      // デフォルトサイズとコンテンツベースのサイズを比較して大きい方を採用
      const maxWidth = Math.max(defaultSize, contentBasedWidth);
      // console.log("maxWidth", maxWidth);
      return maxWidth;
    },
    [table]
  ); // tableインスタンスが変更されたときのみ再計算
  // カラムの自動リサイズ処理をメモ化
  const autoResizeColumn = useMemo(
    () => (columnId: string) => {
      const newWidth = calculateMaxColumnWidth(columnId);
      const column = table.getColumn(columnId);
      if (column) {
        table.setColumnSizing((prev) => ({
          ...prev,
          [columnId]: newWidth,
        }));
      }
    },
    [calculateMaxColumnWidth, table]
  );
  // autoResizeAllColumns 関数を追加
  const autoMaximizeResizeAllColumns = useMemo(
    () => () => {
      table.getAllColumns().forEach((column) => {
        if (column.id) {
          autoResizeColumn(column.id);
        }
      });
    },
    [autoResizeColumn, table]
  );
  // autoResizeAllColumns 関数を追加
  const autoMinimizeResizeAllColumns = useMemo(
    () => () => {
      table.getAllColumns().forEach((column) => {
        if (column.id) {
          table.setColumnSizing((prev) => ({
            ...prev,
            [column.id]: table.getColumn(column.id)?.columnDef?.minSize ?? 200,
          }));
        }
      });
    },
    [table]
  );
  return (
    <Button
      variant="outline"
      size="sm"
      className=" h-8 hidden lg:flex"
      onClick={() => {
        if (isExpanded) {
          autoMinimizeResizeAllColumns();
        } else {
          autoMaximizeResizeAllColumns();
        }
        setIsExpanded(!isExpanded);
      }}
    >
      {isExpanded ? (
        <Minimize2Icon className="size-4 transition rotate-45" />
      ) : (
        <Maximize2Icon className="size-4 transition rotate-45" />
      )}
    </Button>
  );
}
