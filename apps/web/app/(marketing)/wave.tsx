import { cn } from "@/lib/utils";

type Props = {
  direction?: "up" | "down";
  className?: string;
};

export default function Wave({ direction = "down", className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1280 98"
      preserveAspectRatio="none"
      className={cn(
        "fill-[#57B0FF] dark:fill-zinc-900 canvas",
        direction === "up" && "rotate-180",
        className
      )}
    >
      <path d="M -256 29 C -96 29 -96 68 64 68 C 224 68 224 35 384 35 C 544 35 544 99 704 99 C 864 99 864 25 1024 25 C 1184 25 1184 37 1344 37 L 1280 100 L 0 100 Z"></path>
    </svg>
  );
}
