import { androidmanagement_v1, google } from "googleapis";
import { googleServiceAuth } from "./auth";

export async function createAndroidManagementClient() {
  const auth = await googleServiceAuth();
  const androidmanagement: androidmanagement_v1.Androidmanagement =
    google.androidmanagement({
      version: "v1",
      auth,
    });
  return androidmanagement;
}
