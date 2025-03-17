import FreeTrailSection from "./components/free-trail-section";
import HeroSection from "./components/hero-section";
import PCConsoleAppsManagementSection from "./components/pc-console-apps-management-section";
import PhoneManagement from "./components/phone-management";
import TechnologyStackSection from "./components/technology-stack-section";
import UseCaseSection from "./components/use-case-section";

export default async function () {
  return (
    <>
      <div className="container mx-auto px-4 md:px-6 xl:px-[70px] flex flex-col">
        <HeroSection />
        <PhoneManagement />
        <PCConsoleAppsManagementSection />
        <UseCaseSection />
        <TechnologyStackSection />
      </div>
      <FreeTrailSection />
    </>
  );
}
