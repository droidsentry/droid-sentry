import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function ProductOptionsButton({
  className,
  link,
  icon,
}: {
  className?: string;
  link: string;
  icon: React.ReactNode;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "text-muted-foreground hover:text-foreground hover:-translate-y-1 hover:scale-110 transition-all duration-300",
        className
      )}
      asChild
    >
      <Link href={link}>{icon}</Link>
    </Button>
  );
}
