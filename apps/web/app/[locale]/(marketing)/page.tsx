import { RouteParams } from "@/app/types/enterprise";
import { setStaticParamsLocale } from "next-international/server";
import FreeTrail from "./components/free-trail";
import Hero from "./components/hero";
import PCConsoleAppsManagement from "./components/pc-console-apps-management";
import PhoneManagement from "./components/phone-management";
import TechnologyStack from "./components/technology-stack";
import UseCase from "./components/use-case";
import { getMarketingPage } from "./data";

export default async function ({ params }: { params: Promise<RouteParams> }) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const data = await getMarketingPage();
  return (
    <>
      <div className="container mx-auto px-4 md:px-6 xl:px-[70px] flex flex-col">
        <Hero data={data} />
        <PhoneManagement data={data} />
        <PCConsoleAppsManagement data={data} />
        <UseCase data={data} />
        <TechnologyStack data={data} />
      </div>
      <FreeTrail data={data} />
    </>
  );
}
