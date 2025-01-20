"use client";

import { SheetAppInfo } from "@/app/types/apps";
import { useSearchParams } from "next/navigation";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";
import { getSheetAppInfo } from "../apps/actions/get-app-info";
import AppSheet from "./components/app-sheet";

type ContextType = {
  isPending?: boolean;
};

const Context = createContext<ContextType>({
  isPending: false,
} as ContextType);

export function AppsInfoSheetProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [appInfo, setAppInfo] = useState<SheetAppInfo>();
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const appId = searchParams.get("appId");

  useEffect(() => {
    const fetchData = async () => {
      if (!appId) return null;
      startTransition(async () => {
        const appInfo = await getSheetAppInfo(appId);
        //5秒待機
        // await new Promise((resolve) => setTimeout(resolve, 5000));
        setAppInfo(appInfo);
        if (appInfo) {
          setIsOpen(true);
        }
      });
    };

    fetchData();
  }, [appId]);

  return (
    <Context.Provider
      value={{
        isPending,
      }}
    >
      {children}
      <AppSheet isOpen={isOpen} setIsOpen={setIsOpen} appInfo={appInfo} />
    </Context.Provider>
  );
}

export const useAppsInfoSheet = () => useContext(Context);
