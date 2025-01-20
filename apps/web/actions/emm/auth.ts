import { google, Auth } from "googleapis";

export async function googleServiceAuth() {
  if (process.env.NODE_ENV === "production") {
    const credentials = JSON.parse(
      process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || "{}"
    );
    const auth: Auth.GoogleAuth = new google.auth.GoogleAuth({
      credentials,
      scopes: [
        "https://www.googleapis.com/auth/androidmanagement",
        "https://www.googleapis.com/auth/androidenterprise",
        "https://www.googleapis.com/auth/androidpublisher",
      ],
    });
    return auth;
  } else {
    const auth: Auth.GoogleAuth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: [
        "https://www.googleapis.com/auth/androidmanagement",
        "https://www.googleapis.com/auth/androidenterprise",
        "https://www.googleapis.com/auth/androidpublisher",
      ],
    });

    return auth;
  }
}
