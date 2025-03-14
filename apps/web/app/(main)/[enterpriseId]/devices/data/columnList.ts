import { TableColumnDefinition } from "../../../projects/types/column";

export const devicesTableColumnList: TableColumnDefinition[] = [
  {
    accessorKey: "deviceDisplayName",
    title: "端末名",
    minSize: 200,
    size: 200,
  },
  {
    accessorKey: "policyDisplayName",
    title: "ポリシー名",
    minSize: 200,
    size: 200,
  },
  {
    accessorKey: "deviceIdentifier",
    title: "デバイスID",
    minSize: 200,
    size: 200,
  },
];
