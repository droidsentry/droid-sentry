/**
 * ベースURLを取得
 * @param parentUrl? 親フレームURL
 * @returns ベースURL
 * 参考URL　https://vercel.com/docs/projects/environment-variables/system-environment-variables
 * https://vercel.com/docs/projects/environment-variables/framework-environment-variables#framework-environment-variables
 */
export const getBaseURL = (parentUrl?: string) => {
  const isProd = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";
  // console.log("isProd", isProd);

  // 本番環境の場合
  if (isProd) {
    const prodUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL; //my-site.com
    const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL; //my-site.vercel.app
    const branchUrl = process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL; // my-site-git-improve-about-page.vercel.app
    // console.log("prodUrl", prodUrl);
    // console.log("vercelUrl", vercelUrl);
    // console.log("branchUrl", branchUrl);
    return prodUrl
      ? `https://${prodUrl}`
      : vercelUrl
      ? `https://${vercelUrl}`
      : branchUrl
      ? `https://${branchUrl}`
      : `http://localhost:${process.env.PORT || 3000}`;
  }

  // 開発環境でparentFrameUrlが提供されている場合
  if (parentUrl) {
    return parentUrl; // (ex: https://xxxx.ngrok-free.app)
  }

  // 開発環境 URL
  return `http://localhost:${process.env.PORT || 3000}`;
};
