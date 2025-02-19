import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function StartFreeAccountButton({
  className,
}: {
  className?: string;
}) {
  return (
    <Button
      className={cn(
        `rounded-full text-center w-full h-[52px] px-6 py-4 md:w-auto`,
        className
      )}
      asChild
    >
      <Link href="/" replace>
        <span className="text-base ">無料アカウントで始める</span>
      </Link>
    </Button>
  );
}
