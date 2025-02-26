import { AppConfig } from "@/app.config";
import { getI18n } from "@/locales/server";
import { StaticImageData } from "next/image";

export type LocaleId = (typeof AppConfig)["locales"][number]["id"];
export type i18nType = Awaited<ReturnType<typeof getI18n>>;

export type MarketingPage = {
  heroTitle: string[];
  heroText: string;
  PhoneManagementTitle: string;
  PhoneManagementText: string[];
  PCConsoleAppsManagementTitle: string;
  PCConsoleAppsManagementText: string[];
  UsageExperienceTitle: string;
  UsageExperienceCard: {
    title: string;
    text: string;
    image: StaticImageData;
  }[];
  TechnologyStackTitle: string[];
  TechnologyStackText: string[];
  FreeTrialTitle: string;
  FreeTrialText: string;
};
