import "server-only";

import { OAuth2Client } from "google-auth-library";
import { headers } from "next/headers";
import { getPubsubEndpointBaseUrl } from "@/lib/base-url";

/**
 * Pub/Subのトークンを検証する
 * @param request
 * @returns トークンの検証結果
 */
export async function verifyPubSubToken() {
  const authHeader = (await headers()).get("authorization");
  // スキーム部分とトークン部分を分離
  const [scheme, token] = authHeader?.split(" ") ?? [];
  if (scheme !== "Bearer" || !token) {
    throw new Error("Invalid authorization header format");
  }
  const pubsubEndpointBaseUrl = getPubsubEndpointBaseUrl();
  const audience = `${pubsubEndpointBaseUrl}/api/emm/pubsub`;

  // OAuth2クライアントの初期化
  const authClient = new OAuth2Client();
  try {
    // トークンの検証
    const ticket = await authClient.verifyIdToken({
      idToken: token,
      audience, // プッシュエンドポイントのURL
    });

    const claim = ticket.getPayload();
    if (!claim) throw new Error("Invalid claim");

    // Pub/Subサービスアカウントの検証
    const expectedServiceAccount = process.env.GCP_SERVICE_ACCOUNT_EMAIL;
    if (claim.email !== expectedServiceAccount) {
      throw new Error("Invalid service account");
    } else if (claim.email === expectedServiceAccount) {
      // console.log("Pub/Sub service account is valid");
    }

    return claim;
  } catch (error) {
    console.error("Token verification failed:", error);
    throw new Error("Invalid token");
  }
}
