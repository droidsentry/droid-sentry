"use client";

import Script from "next/script";
import { ReactNode, createContext, useEffect, useState } from "react";

type ContextType = {
  isLoaded: boolean;
};

const Context = createContext<ContextType>({
  isLoaded: false,
} as ContextType);

export function GapiIframesProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);

  //isLoadedを監視
  useEffect(() => {
    // console.log("GapiIframesProvider isLoaded", isLoaded);
    // if (window.gapi) {
    //   console.log("gapi is loaded");
    // }
  }, [isLoaded]);

  return (
    <Context.Provider value={{ isLoaded }}>
      {children}
      <Script
        src="https://apis.google.com/js/api.js"
        strategy="afterInteractive"
        onLoad={() => {
          // gapiが利用可能になってから各コンポーネントで初期化を行う
          gapi.load("gapi.iframes", () => {
            // console.log("gapi.iframes loaded");
            setIsLoaded(true);
          });
        }}
      />
    </Context.Provider>
  );
}
