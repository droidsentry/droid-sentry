import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function StartFreeAccountButton({
  className,
}: {
  className?: string;
}) {
  const t = await getTranslations("marketing");
  return (
    <Button
      className={cn(
        `rounded-full text-center w-full h-[52px] px-6 py-4 md:w-auto`,
        className
      )}
      asChild
    >
      <Link href="/sign-up" replace>
        <span className="text-base ">{t("startFreeAccount")}</span>
      </Link>
    </Button>
  );
}
