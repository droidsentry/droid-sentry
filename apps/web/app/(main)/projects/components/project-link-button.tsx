import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutGrid } from "lucide-react";
import Link from "next/link";

export default function ProjectLinkButton({
  mode,
  isActive,
}: {
  mode?: "hover";
  isActive?: boolean;
}) {
  return (
    <Button
      variant="ghost"
      className={cn("relative gap-2 justify-start", isActive && "bg-accent")}
      asChild
    >
      <Link href="/projects">
        <LayoutGrid size={20} className="absolute left-3" />
        <span
          className={cn(
            "absolute left-12",
            mode === "hover" &&
              "opacity-0 group-hover:opacity-100 transition-all"
          )}
        >
          プロジェクト
        </span>
      </Link>
    </Button>
  );
}
