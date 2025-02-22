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
      className={cn(
        "relative gap-2 justify-start group/project",
        isActive && "bg-accent",
        "transition-all duration-200"
      )}
      asChild
    >
      <Link href="/projects">
        <LayoutGrid
          size={20}
          className={cn(
            "absolute left-3",
            isActive && "text-primary",
            "group-hover/project:text-primary"
          )}
        />
        <span
          className={cn(
            "absolute left-12",
            mode === "hover" &&
              "opacity-0 group-hover:opacity-100 transition-all duration-200"
          )}
        >
          <span
            className={cn(
              "font-bold",
              isActive && "text-primary",
              "group-hover/project:text-primary"
            )}
          >
            プロジェクト
          </span>
        </span>
      </Link>
    </Button>
  );
}
