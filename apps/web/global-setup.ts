import type { FullConfig } from "@playwright/test";

async function globalSetup(config: FullConfig) {
  const userId = process.env.USER_ID; // SupabaseのユーザーID
  // Or a more complicated data structure as JSON:
  process.env.BAR = JSON.stringify({ some: "data" });
}

export default globalSetup;
