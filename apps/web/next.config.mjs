import bundleAnalyzer from "@next/bundle-analyzer";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: "",
        pathname:
          "/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/**",
      },
      {
        //Android Enterpriseで必要なホスト
        protocol: "https",
        hostname: "*.gstatic.com",
        port: "",
        pathname: "/**",
      },
      {
        //Android Enterpriseで必要なホスト
        protocol: "https",
        hostname: "*.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        //Android Enterpriseで必要なホスト
        protocol: "https",
        hostname: "*.gvt1.com",
        port: "",
        pathname: "/**",
      },
      {
        //Android Enterpriseで必要なホスト
        protocol: "https",
        hostname: "*.ggpht.com",
        port: "",
        pathname: "/**",
      },
      {
        //Android Enterpriseで必要なホスト
        protocol: "https",
        hostname: "dl.google.com",
        port: "",
        pathname: "/**",
      },
      {
        //Android Enterpriseで必要なホスト
        protocol: "https",
        hostname: "dl-ssl.google.com",
        port: "",
        pathname: "/**",
      },
      {
        //Android Enterpriseで必要なホスト
        protocol: "https",
        hostname: "android.clients.google.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        port: "",
        pathname: "/9.x/**",
      },
    ],
    dangerouslyAllowSVG: true,
    // 同一オリジンからのリソース読み込みのみを許可
    // スクリプトの実行を完全に禁止
    // コンテンツを厳格にサンドボックス化
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

// export default nextConfig;

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

// export default withBundleAnalyzer(nextConfig);
// export default withNextIntl(nextConfig);
export default withNextIntl(withBundleAnalyzer(nextConfig));
