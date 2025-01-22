/**
 * ベースURLを取得
 * @param parentUrl? 親フレームURL
 * @returns ベースURL
 */
export const getBaseSubscriptionURL = () => {
  try {
    const isProd = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";
    const prodUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL; //my-site.com
    const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL; //my-site.vercel.app
    const branchUrl = process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL; // my-site-git-improve-about-page.vercel.app
    const devUrl = process.env.PUBSUB_SUBSCRIPTION_PUSH_URL;
    // console.log("prodUrl", prodUrl);
    // console.log("vercelUrl", vercelUrl);
    // console.log("branchUrl", branchUrl);
    // console.log("devUrl", devUrl);
    const url = isProd
      ? prodUrl
      : devUrl
        ? devUrl
        : vercelUrl
          ? vercelUrl
          : branchUrl
            ? branchUrl
            : devUrl;

    return url
      ? `https://${url}`
      : `http://localhost:${process.env.PORT || 3000}`;
  } catch (error) {
    console.error("Failed to get base subscription URL", error);
    throw new Error("Failed to get base subscription URL");
  }
};

export const currentBaseUrl = () => {
  const env = process.env.NEXT_PUBLIC_VERCEL_ENV;
  console.log("env", env);
  switch (env) {
    case "production": {
      const customDomain =
        process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL; //my-site.com
      if (customDomain) {
        return `https://${customDomain}`;
      }
      const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL; //my-site.vercel.app, *-vercel.app
      return `https://${vercelUrl}`;
    }
    case "preview": {
      const branchUrl = process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL;
      if (branchUrl) {
        return `https://${branchUrl}`;
      }
    }
    case "development": {
      const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL; //my-site.vercel.app, *-vercel.app
      if (vercelUrl) {
        return `https://${vercelUrl}`;
      }
      return `http://localhost:${process.env.PORT || 3000}`;
    }
    default:
      return `http://localhost:${process.env.PORT || 3000}`;
  }
};
