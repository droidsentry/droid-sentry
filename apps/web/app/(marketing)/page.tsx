import { getTranslations } from "next-intl/server";
import Hero from "./components/hero";
import PCConsoleAppsManagement from "./components/pc-console-apps-management";
import PhoneManagement from "./components/phone-management";
import UseCase from "./components/use-case";
import TechnologyStack from "./components/technology-stack";
import FreeTrail from "./components/free-trail";

export default async function () {
  return (
    <>
      <div className="container mx-auto px-4 md:px-6 xl:px-[70px] flex flex-col">
        <Hero />
        <PhoneManagement />
        <PCConsoleAppsManagement />
        <UseCase />
        <TechnologyStack />
      </div>
      <FreeTrail />
    </>
  );
}
