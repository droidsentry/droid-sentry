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
  timeRange: string;
  setTimeRange: (timeRange: string) => void;
}) {
  return (
    <Select value={timeRange} onValueChange={setTimeRange}>
      <SelectTrigger
        className="w-full rounded-lg sm:ml-auto"
        aria-label="Select a value"
      >
        <SelectValue placeholder="表示期間" />
      </SelectTrigger>
      <SelectContent className="rounded-xl" align="end">
        <SelectItem value="30d" className="rounded-lg">
          30日
        </SelectItem>
        <SelectItem value="15d" className="rounded-lg">
          15日
        </SelectItem>
        <SelectItem value="7d" className="rounded-lg">
          7日
        </SelectItem>
        <SelectItem value="3d" className="rounded-lg">
          3日
        </SelectItem>
        <SelectItem value="1d" className="rounded-lg">
          1日
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
