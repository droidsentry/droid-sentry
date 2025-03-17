import { MarketingPage } from "@/app/types/locale";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import AppDistribution from "../images/app-distribution.png";
import ManUsingDevice from "../images/man-using-device.png";
import LostDeviceMapsAndNavigation from "../images/lost-device-maps-and-navigation.png";

export default async function UseCaseSection() {
  const t = await getTranslations("marketing.useCase");
  const usageExperiencs = [
    "appDistribution",
    "autoSetup",
    "lostDevice",
  ] as const;
  const images = {
    appDistribution: AppDistribution,
    autoSetup: ManUsingDevice,
    lostDevice: LostDeviceMapsAndNavigation,
  } as const;

  return (
    <section className="py-28">
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-[40px]/[46px] font-bold mb-[34px] md:px-0 lg:mb-20 text-center">
          {t("title")}
        </h2>
      </div>
      <div className="pb-5 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb:pb-0 ">
        {usageExperiencs.map((usageExperience) => (
          <Card
            key={usageExperience}
            className="rounded-3xl md:size-full dark:bg-muted/50 bg-muted/10 p-6 border"
          >
            <div className="aspect-square flex items-center justify-center dark:bg-white bg-muted/50 rounded-3xl border mb-6">
              <Image
                src={images[usageExperience]}
                alt={t(`usageExperience.${usageExperience}.title`)}
                priority
              />
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">
                {t(`usageExperience.${usageExperience}.title`)}
              </h3>
              <p className="text-base/relaxed ">
                {t(`usageExperience.${usageExperience}.description`)}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
