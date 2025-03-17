import { CircleCheck } from "lucide-react";
import Image from "next/image";
import PCConsoleAppsFeatureGraphic from "../images/pc-console-apps-management.png";
import StartFreeAccountButton from "./start-free-account-button";
import { getTranslations } from "next-intl/server";

export default async function PCConsoleAppsManagementSection() {
  const t = await getTranslations("marketing.pcConsoleAppsManagement");
  const features = [
    "appInfo",
    "personalGoogleAccount",
    "limitedPublicAndroidApp",
    "pwa",
  ] as const;
  return (
    <section className="pt-20">
      <div className="w-full grid gap-y-8 lg:grid-cols-2 items-center justify-between md:gap-x-6 py-0 ">
        <div className="lg:order-last">
          <Image
            src={PCConsoleAppsFeatureGraphic}
            alt="pc-console-apps-management"
            priority
          />
        </div>
        <div className="md:pr-16 ">
          <h2 className="text-[25.5px]/[30.6px] md:text-[40px]/[46px] font-bold mb-[8.5px] mb:mb-6">
            {t("title")}
          </h2>
          <ul className="flex flex-col gap-y-4 mt-10">
            {features.map((feature) => (
              <li key={feature} className="flex gap-x-4 items-center">
                <CircleCheck className="w-6 h-6 text-green-500 shrink-0" />
                <span className="text-[15.3px]/[23.8px] md:text-lg">
                  {t(`features.${feature}.description`)}
                </span>
              </li>
            ))}
          </ul>
          <StartFreeAccountButton className="mt-16" />
        </div>
      </div>
    </section>
  );
}
