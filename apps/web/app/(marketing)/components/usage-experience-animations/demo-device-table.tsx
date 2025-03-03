import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DemoDeviceTable() {
  return (
    <Table className="border rounded-md">
      <TableHeader>
        <TableRow className="">
          <TableHead className="text-xs h-5">端末名</TableHead>
          <TableHead className="text-xs h-5">ステータス</TableHead>
          <TableHead className="text-xs h-5">ポリシー名</TableHead>
          <TableHead className="text-xs h-5">同期時刻</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="">
          <TableCell className="text-center text-xs h-5 p-1">田中</TableCell>
          <TableCell className="text-center text-xs h-5 p-1">◯</TableCell>
          <TableCell className="text-center text-xs h-5 p-1">営業</TableCell>
          <TableCell className="text-center text-xs h-5 p-1">
            2024/02/20
          </TableCell>
        </TableRow>
        <TableRow className="">
          <TableCell className="text-center text-xs h-5 p-1">鈴木</TableCell>
          <TableCell className="text-center text-xs h-5 p-1">◯</TableCell>
          <TableCell className="text-center text-xs h-5 p-1">営業</TableCell>
          <TableCell className="text-center text-xs h-5 p-1">
            2024/02/20
          </TableCell>
        </TableRow>
        <TableRow className="">
          <TableCell className="text-center text-xs h-5 p-1">高橋</TableCell>
          <TableCell className="text-center text-xs h-5 p-1">◯</TableCell>
          <TableCell className="text-center text-xs h-5 p-1">営業</TableCell>
          <TableCell className="text-center text-xs h-5 p-1">
            2024/02/19
          </TableCell>
        </TableRow>
        <TableRow className="">
          <TableCell className="text-center text-xs h-5 p-1">佐藤</TableCell>
          <TableCell className="text-center text-xs h-5 p-1">◯</TableCell>
          <TableCell className="text-center text-xs h-5 p-1">営業</TableCell>
          <TableCell className="text-center text-xs h-5 p-1">
            2024/02/18
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
