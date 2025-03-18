import Image from "next/image";

import { useTranslations } from "next-intl";
import heroImageConsole from "../images/hero-image-console.png";
import StartFreeAccountButton from "./start-free-account-button";

export default function HeroSection() {
  ``;
  const t = useTranslations("marketing.hero");

  return (
    <section className="pt-1.5 pb-28">
      <div className="lg:pt-16 pt-5 grid lg:grid-cols-2 items-center">
        <div className="lg:text-left text-center mr-0 md:mr-18">
          <div className="mb-5 text-4xl md:text-6xl font-bold">
            <h1 className="leading-[1.17]">
              {t.rich("title", {
                br: () => <br />,
              })}
            </h1>
          </div>
          <div className="mb-5 text-base md:text-lg">
            <p className="leading-relaxed">{t("description")}</p>
          </div>
          <StartFreeAccountButton className="my-8" />
        </div>
        <div className="flex flex-col items-center justify-center">
          <Image src={heroImageConsole} alt="hero-image-console-ui" priority />
        </div>
      </div>
    </section>
  );
}
