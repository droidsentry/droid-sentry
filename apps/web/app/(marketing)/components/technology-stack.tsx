import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import nextjsLogo from "../images/brands/nextjs-logotype-light-background.svg";
import resendLogo from "../images/brands/resend-wordmark-black.svg";
import sentryLogo from "../images/brands/sentry-wordmark-dark-400x88.svg";
import supabaseLogo from "../images/brands/supabase-logo-wordmark--light.svg";
import vercelLogo from "../images/brands/vercel-logotype-light.svg";

export default function TechnologyStack() {
  return (
    <section className="pt-10 ">
      <div className="mx-auto md:px-6 xl:px-0 flex flex-wrap justify-evenly px-4 mb-16">
        <Image
          src={nextjsLogo}
          alt="nextjs"
          className="md:h-6 h-5 mb-5 mx-2 rounded-none opacity-50 w-fit dark:invert"
        />
        <Image
          src={vercelLogo}
          alt="vercel"
          className="md:h-6 h-5 mb-5 mx-2 rounded-none opacity-50 w-fit dark:invert"
        />
        <Image
          src={resendLogo}
          alt="resend"
          className="md:h-6 h-5 mb-5 mx-2 rounded-none opacity-50 w-fit dark:invert"
        />
        <Image
          src={sentryLogo}
          alt="sentry"
          className="md:h-6 h-5 mb-5 mx-2 rounded-none opacity-50 w-fit dark:invert"
        />
        <Image
          src={supabaseLogo}
          alt="supabase"
          className="md:h-6 h-5 mb-5 mx-2 rounded-none opacity-50 w-fit dark:invert"
        />
      </div>
      <div className="md:px-6 lg:px-0 flex flex-col justify-center items-center px-4">
        <div className="mb-8 md:mb-14 text-center max-w-[850px]">
          <h2 className="text-[25.5px]/[30.6px] md:text-5xl font-semibold mb-[8.5px] md:mb-6 leading-tight">
            モダンな技術スタックで
            <br />
            運用しています。
          </h2>
          <p className="text-[17px]/[23.8px] md:text-xl">
            Next.js、Vercel、Supabaseなどの最新技術を採用することで、
            <br />
            効率的な開発・運用を可能にしています。
          </p>
        </div>
        <Button
          className="text-16 rounded-full text-center w-full h-[52px] px-6 py-4 md:w-auto"
          asChild
        >
          <Link href="/features" replace>
            <span className="text-base">無料アカウントで始める</span>
          </Link>
        </Button>
      </div>
    </section>
  );
}
