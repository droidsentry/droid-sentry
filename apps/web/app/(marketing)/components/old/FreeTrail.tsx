import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CircleCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import PCConsoleAppsFeatureGraphic from "../images/pc-console-apps-manegement.png";

export default function FreeTrail() {
  return (
    <section className="py-10 bg-muted/50 m-[calc(50%-50vw)] my-10 overflow-hidden">
      <div className="mx-auto max-w-7xl grid gap-y-8 md:grid-cols-2 items-center justify-between md:gap-6 py-0">
        <div className="md:pr-16">
          <h2 className="text-[40px]/[46px] font-bold mb-6">
            Kontist Bookkeeping for clear finances
          </h2>
          <ul className="flex flex-col gap-y-4 mt-10">
            <li className="flex gap-x-4 items-center">
              <CircleCheck className="w-6 h-6 text-green-500" />
              <span className="text-lg">Mobile & web banking app</span>
            </li>
            <li className="flex gap-x-4 items-center">
              <CircleCheck className="w-6 h-6 text-green-500" />
              <span className="text-lg">Mobile & web banking app</span>
            </li>
            <li className="flex gap-x-4 items-center">
              <CircleCheck className="w-6 h-6 text-green-500" />
              <span className="text-lg">Mobile & web banking app</span>
            </li>
            <li className="flex gap-x-4 items-center">
              <CircleCheck className="w-6 h-6 text-green-500" />
              <span className="text-lg">Mobile & web banking app</span>
            </li>
          </ul>
          <div className="mt-16">
            <Button
              className={cn(
                `text-16 rounded-full text-center w-full h-[52px]
              px-6 py-4
              md:w-auto`
              )}
              asChild
            >
              <Link href="/features" replace>
                <span className="text-base">もっと詳しく確認する</span>
              </Link>
            </Button>
          </div>
        </div>
        <Image src={PCConsoleAppsFeatureGraphic} alt="phone-management" />
      </div>
    </section>
  );
}
