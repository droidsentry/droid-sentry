import { getBaseURL } from "@/lib/base-url";
import { getPrices } from "./actions/stripe";
import MainSubscriptionsCard from "./components/main-subscriptions-card";
import OptionSubscriptionsCard from "./components/option-subscriptions-card";

export default async function Page() {
  const mainPrices = await getPrices(main);
  const optionPrices = await getPrices(options);
  const url = getBaseURL();

  return (
    <div className="container mx-auto mt-4 px-4 pb-20 lg:mt-6">
      <MainSubscriptionsCard url={url} prices={mainPrices} />
      <OptionSubscriptionsCard url={url} prices={optionPrices} />
    </div>
  );
}

const main = [
  {
    name: "管理デバイス ライセンス",
    lookupKey: "license",
  },
];

const options = [
  {
    name: "ライト",
    lookupKey: "light",
  },
  {
    name: "スタンダード",
    lookupKey: "standard",
  },
  {
    name: "プレミアム",
    lookupKey: "premium",
  },
];
