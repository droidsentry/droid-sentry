import "server-only";

import { androidmanagement_v1, google } from "googleapis";
import { getVercelOidcToken } from "@vercel/functions/oidc";
import { ExternalAccountClient } from "google-auth-library";

const GCP_PROJECT_NUMBER = process.env.GCP_PROJECT_NUMBER;
const GCP_SERVICE_ACCOUNT_EMAIL = process.env.GCP_SERVICE_ACCOUNT_EMAIL;
const GCP_WORKLOAD_IDENTITY_POOL_ID = process.env.GCP_WORKLOAD_IDENTITY_POOL_ID;
const GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID =
  process.env.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID;

/**
 * 認証クライアントの作成
 * Vercel OIDCを使用して認証を行う
 */
export async function googleServiceAuth() {
  // 共通の認証設定
  const authConfig = {
    scopes: ["https://www.googleapis.com/auth/androidmanagement"],
    type: "external_account",
    audience: `//iam.googleapis.com/projects/${GCP_PROJECT_NUMBER}/locations/global/workloadIdentityPools/${GCP_WORKLOAD_IDENTITY_POOL_ID}/providers/${GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID}`,
    subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
    token_url: "https://sts.googleapis.com/v1/token",
    service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${GCP_SERVICE_ACCOUNT_EMAIL}:generateAccessToken`,
  };
  try {
    const auth = ExternalAccountClient.fromJSON({
      ...authConfig,
      subject_token_supplier: {
        getSubjectToken: getVercelOidcToken,
      },
    });

    if (!auth) {
      throw new Error("Failed to create auth client");
    }
    return auth;
  } catch (error) {
    console.error("認証クライアントの作成に失敗しました:", error);
    throw error;
  }
}

/**
 * Android Management APIのクライアントを作成
 * 認証クライアントを使用してAndroid Management APIのクライアントを作成
 */
export async function createAndroidManagementClient() {
  const auth = await googleServiceAuth();
  const androidmanagement: androidmanagement_v1.Androidmanagement =
    google.androidmanagement({
      version: "v1",
      auth,
    });
  return androidmanagement;
}
