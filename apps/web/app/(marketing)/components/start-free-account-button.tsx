import { Button } from "@/components/ui/button";
import { checkTotalUserLimit } from "@/lib/service";
import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { toast } from "sonner";

export default async function StartFreeAccountButton({
  className,
}: {
  className?: string;
}) {
  const t = await getTranslations("marketing");

  let url = "/sign-up";
  await checkTotalUserLimit().catch((error) => {
    const errorCode = error.message;
    if (errorCode === "E1001") {
      url = "/waiting";
      return;
    }
    toast.error(error.message);
  });

  return (
    <Button
      className={cn(
        `rounded-full text-center w-full h-[52px] px-6 py-4 md:w-auto`,
        className
      )}
      asChild
    >
      <Link href={url}>
        <span className="text-base ">{t("startFreeAccount")}</span>
      </Link>
    </Button>
  );
}
