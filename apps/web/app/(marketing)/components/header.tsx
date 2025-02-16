import HeaderLogoButton from "@/components/header-logo-button";
import { Button } from "@/components/ui/button";
import { ArrowRight, Info, JapaneseYen } from "lucide-react";
import Link from "next/link";
import { cn } from "../../../lib/utils";
import SingInButton from "./sign-in-button";

export default async function Header({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "bg-background sticky top-0 z-10 px-4 md:px-0 py-4 flex justify-center h-[84px]",
        className
      )}
    >
      <div
        className={cn(
          // "mx-auto relative md:px-6 xl:px-0 lg:mx-0 flex flex-grow items-center h-full max-w-screen-2lg"
          "md:px-6 xl:px-0 lg:mx-0 flex flex-grow items-center"
          // " mx-auto max-w-full lg:max-w-[1140px] xl:max-w-7xl xl:px-[70px]"
        )}
      >
        <div className="flex items-center flex-1 justify-start">
          <HeaderLogoButton />
          <div className="hidden lg:flex flex-1 ml-5 items-center">
            <Button variant="ghost" className="p-5" asChild>
              <Link href="/features" replace>
                <span className="text-lg">ご利用の流れ</span>
              </Link>
            </Button>
            <Button variant="ghost" className="p-5" asChild>
              <Link href="/features" replace>
                <span className="text-lg">価格</span>
              </Link>
            </Button>
          </div>
        </div>
        <div className="lg:flex items-center gap-4 hidden">
          <SingInButton />
          <Button
            className={cn(
              `text-16 rounded-full text-center w-full h-[52px]
              px-6 py-4
              md:w-auto`
            )}
            asChild
          >
            <Link href="/features" replace>
              <span className="text-base">Open free account</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
