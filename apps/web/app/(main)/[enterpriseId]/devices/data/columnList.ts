import { TableColumnDefinition } from "../../../projects/types/column";

export const devicesTableColumnList: TableColumnDefinition[] = [
  {
    accessorKey: "deviceDisplayName",
    title: "端末名",
    minSize: 200,
    size: 250,
  },
  {
    accessorKey: "policyDisplayName",
    title: "ポリシー名",
    minSize: 200,
    size: 200,
  },
  // {
  //   accessorKey: "state",
  //   title: "State",
  //   minSize: 100,
  //   size: 150,
  // },
];
