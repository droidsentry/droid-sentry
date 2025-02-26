import Image from "next/image";

import { MarketingPage } from "@/app/types/locale";
import { Fragment } from "react";
import heroImageConsole from "../images/hero-image-console.png";
import StartFreeAccountButton from "./start-free-account-button";
import { useTranslations } from "next-intl";

export default function Hero({ data }: { data: MarketingPage }) {
  const t = useTranslations("HomePage");
  return (
    <section className="pt-1.5 pb-28">
      <h1>{t("title")}</h1>
      <div className="lg:pt-16 pt-5 grid lg:grid-cols-2 items-center">
        <div className="lg:text-left text-center mr-0 md:mr-18">
          <div className="mb-5 text-4xl md:text-6xl font-bold">
            <h1 className="leading-[1.17]">
              {data.heroTitle.map((line, index) => (
                <Fragment key={index}>
                  {line}
                  {index < data.heroTitle.length - 1 && <br />}
                </Fragment>
              ))}
            </h1>
          </div>
          <div className="mb-5 text-base md:text-lg">
            <p className="leading-relaxed">{data.heroText}</p>
          </div>
          <StartFreeAccountButton className="my-8" />
        </div>
        <div className="flex flex-col items-center justify-center">
          <Image src={heroImageConsole} alt="hero-image-console-ui" />
        </div>
      </div>
    </section>
  );
}
