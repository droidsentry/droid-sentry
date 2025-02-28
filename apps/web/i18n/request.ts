import { getRequestConfig } from "next-intl/server";
import { getUserLocale } from "./locale";

export default getRequestConfig(async () => {
  const locale = await getUserLocale();
  const authMessages = (await import(`../messages/auth/${locale}.json`))
    .default;
  const mainMessages = (await import(`../messages/main/${locale}.json`))
    .default;
  const marketingMessages = (
    await import(`../messages/marketing/${locale}.json`)
  ).default;

  const messages = {
    ...authMessages,
    ...mainMessages,
    ...marketingMessages,
  };

  return {
    locale,
    messages,
  };
});
