import { headers } from "next/headers";
import IPinfoWrapper from "node-ipinfo";

const ipinfoClient = new IPinfoWrapper(process.env.IPINFO_TOKEN || "");

type UserContextData = {
  ip_address: string;
  location: string;
  city?: string;
  country?: string;
};

export async function getUserContextData(): Promise<UserContextData> {
  try {
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0] : undefined;
    // console.log("IP address:", ip);
    if (!ip) {
      throw new Error("IP address is required");
    }
    const ipData = await ipinfoClient.lookupIp(ip);

    return {
      ip_address: ipData.ip || "unknown",
      location:
        ipData.city || ipData.country
          ? `${ipData.city}, ${ipData.country}`
          : "unknown",
    };
  } catch (error) {
    console.error("Failed to fetch user context data:", error);
    return {
      ip_address: "unknown",
      location: "unknown",
    };
  }
}
