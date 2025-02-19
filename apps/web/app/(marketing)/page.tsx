import FreeTrail from "./components/free-trail";
import Hero from "./components/hero";
import PCConsoleAppsManagement from "./components/pc-console-apps-management";
import PhoneManagement from "./components/phone-management";
import TechnologyStack from "./components/technology-stack";
import UseCase from "./components/use-case";

export default function Home() {
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
