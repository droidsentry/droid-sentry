import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SelectTimeButton({
  timeRange,
  setTimeRange,
}: {
  timeRange: number;
  setTimeRange: (timeRange: number) => void;
}) {
  return (
    <Select
      value={timeRange.toString()}
      onValueChange={(value) => setTimeRange(Number(value))}
    >
      <SelectTrigger
        className="w-full rounded-lg sm:ml-auto"
        aria-label="Select a value"
      >
        <SelectValue placeholder="表示期間" />
      </SelectTrigger>
      <SelectContent className="rounded-xl" align="end">
        <SelectItem value="30" className="rounded-lg">
          30日
        </SelectItem>
        <SelectItem value="15" className="rounded-lg">
          15日
        </SelectItem>
        <SelectItem value="7" className="rounded-lg">
          7日
        </SelectItem>
        <SelectItem value="3" className="rounded-lg">
          3日
        </SelectItem>
        <SelectItem value="1" className="rounded-lg">
          1日
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
