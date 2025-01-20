export const APP_IFRAME_CONFIG = {
  LOCALE: "ja_JP",
  MODE: "SELECT",
  BASE_URL: "https://play.google.com/work/embedded/search",
  IFRAME_STYLE: {
    style: "width: 100%; height: 100%;",
    scrolling: "yes",
  },
} as const;

export const CONFIGURATIONS_IFRAME_CONFIG = {
  LOCALE: "ja_JP",
  BASE_URL: "https://play.google.com/managed/mcm",
  IFRAME_STYLE: {
    style: "width: 100%; height: 100%;",
    scrolling: "yes",
  },
} as const;
