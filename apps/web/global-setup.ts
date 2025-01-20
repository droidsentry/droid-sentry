import type { FullConfig } from "@playwright/test";

async function globalSetup(config: FullConfig) {
  process.env.USER_ID = "b98e80ba-e226-4f4c-8aab-c5328eafa39a";
  // Or a more complicated data structure as JSON:
  process.env.BAR = JSON.stringify({ some: "data" });
}

export default globalSetup;
