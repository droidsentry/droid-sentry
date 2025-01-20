"use client";

import { Table } from "@tanstack/react-table";
import { ReactNode, createContext, useCallback, useContext } from "react";
import { PolicyTableType } from "../policies/types/policy";

type ContextType = {
  autoResizeColumn: (columnId: string) => void;
};

const Context = createContext<ContextType>({
  autoResizeColumn: () => {},
} as ContextType);

interface ResizeColumnProviderProps<TData extends PolicyTableType> {
  table: Table<TData>;
  children: ReactNode;
}

export function ResizeColumnProvider<TData extends PolicyTableType>({
  children,
  table,
}: ResizeColumnProviderProps<TData>) {
  // カラムごとの最大文字数を計算する関数をメモ化
  const calculateMaxColumnWidth = useCallback(
    (columnId: string) => {
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
      console.log("maxContentWidth", maxContentWidth);

      const padding = 0;
      const contentBasedWidth = maxContentWidth + padding;
      console.log("contentBasedWidth", contentBasedWidth);
      // デフォルトサイズとコンテンツベースのサイズを比較して大きい方を採用
      const maxWidth = Math.max(defaultSize, contentBasedWidth);
      console.log("maxWidth", maxWidth);
      return maxWidth;
    },
    [table]
  );

  const autoResizeColumn = useCallback(
    (columnId: string) => {
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

  return (
    <Context.Provider value={{ autoResizeColumn }}>{children}</Context.Provider>
  );
}

export const useResizeColumn = () => useContext(Context);
