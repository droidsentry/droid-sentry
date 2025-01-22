"use client";

import { ReactNode, createContext, useContext, useState } from "react";

type ContextType = {};

const Context = createContext<ContextType>({} as ContextType);

export function ProjectProviderProvider({ children }: { children: ReactNode }) {
  const [_, __] = useState<any>(1);

  return <Context.Provider value={{}}>{children}</Context.Provider>;
}

export const useProjectProvider = () => useContext(Context);
