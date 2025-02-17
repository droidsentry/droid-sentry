import Hero from "./components/hero";

import PCConsoleAppsManegement from "./components/pc-console-apps-manegement";
import PhoneManegement from "./components/phone-manegement";
import TechnologyStack from "./components/technology-stack";
import UseCase from "./components/use-case";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <TechnologyStack />
      <PhoneManegement />
      <PCConsoleAppsManegement />
      <UseCase />
      {/* <FreeTrail /> */}
    </div>
  );
}
