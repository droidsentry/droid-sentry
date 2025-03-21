import { Button } from "@/components/ui/button";
import { checkTotalUserLimit } from "@/lib/service";
import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function StartFreeAccountButton({
  className,
}: {
  className?: string;
}) {
  const t = await getTranslations("marketing");

  const isTotalUserLimit = await checkTotalUserLimit();

  return (
    <Button
      className={cn(
        `rounded-full text-center w-full h-[52px] px-6 py-4 md:w-auto`,
        className
      )}
      asChild
    >
      <Link href={isTotalUserLimit ? "/sign-up" : "/waiting"}>
        <span className="text-base font-semibold">{t("startFreeAccount")}</span>
      </Link>
    </Button>
  );
}
