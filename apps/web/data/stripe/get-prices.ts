import "server-only";
import { stripe } from "@/lib/stripe";

/**
 * 価格のリストをStripeから取得する
 * @param lookupKey[]　 価格のキー配列
 * @returns 価格のリスト
 * 参考URL:https://docs.stripe.com/api/prices/list
 */
export const getListPrices = async (lookupKey: string[]) => {
  const prices = await stripe.prices.list({
    lookup_keys: lookupKey,
    expand: ["data.product"],
  });
  return prices;
};
