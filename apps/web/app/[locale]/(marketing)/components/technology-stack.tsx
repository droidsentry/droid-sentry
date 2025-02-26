import { MarketingPage } from "@/app/types/locale";
import Image from "next/image";
import { Fragment } from "react";
import nextjsLogo from "../images/brands/nextjs-logotype-light-background.svg";
import resendLogo from "../images/brands/resend-wordmark-black.svg";
import sentryLogo from "../images/brands/sentry-wordmark-dark-400x88.svg";
import supabaseLogo from "../images/brands/supabase-logo-wordmark--light.svg";
import vercelLogo from "../images/brands/vercel-logotype-light.svg";
import StartFreeAccountButton from "./start-free-account-button";

export default function TechnologyStack({ data }: { data: MarketingPage }) {
  return (
    <section className="py-20">
      <div className="md:px-6 lg:px-0 flex flex-col justify-center items-center px-4">
        <div className="mb-8 md:mb-14 text-center max-w-[850px]">
          <h2 className="text-[25.5px]/[30.6px] md:text-5xl font-semibold mb-[8.5px] md:mb-6 leading-tight">
            {data.TechnologyStackTitle.map((line, index) => (
              <Fragment key={index}>
                {line}
                {index < data.TechnologyStackTitle.length - 1 && <br />}
              </Fragment>
            ))}
          </h2>
          <p className="text-[17px]/[23.8px] md:text-xl">
            {data.TechnologyStackText.map((line, index) => (
              <Fragment key={index}>
                {line}
                {index < data.TechnologyStackText.length - 1 && <br />}
              </Fragment>
            ))}
          </p>
        </div>
      </div>
      <div className="md:px-6 xl:px-0 flex flex-wrap justify-evenly px-4 mb-8">
        <Image
          src={nextjsLogo}
          alt="Next.js"
          className="md:h-6 h-5 mb-5 mx-2 rounded-none opacity-50 w-fit dark:invert"
        />
        <Image
          src={vercelLogo}
          alt="Vercel"
          className="md:h-6 h-5 mb-5 mx-2 rounded-none opacity-50 w-fit dark:invert"
        />
        <Image
          src={resendLogo}
          alt="Resend"
          className="md:h-6 h-5 mb-5 mx-2 rounded-none opacity-50 w-fit dark:invert"
        />
        <Image
          src={sentryLogo}
          alt="Sentry"
          className="md:h-6 h-5 mb-5 mx-2 rounded-none opacity-50 w-fit dark:invert"
        />
        <Image
          src={supabaseLogo}
          alt="Supabase"
          className="md:h-6 h-5 mb-5 mx-2 rounded-none opacity-50 w-fit dark:invert"
        />
      </div>
      <div className="md:px-6 lg:px-0 flex flex-col justify-center items-center px-4">
        <StartFreeAccountButton />
      </div>
    </section>
  );
}
