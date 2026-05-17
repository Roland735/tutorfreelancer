"use client";

import { createContext, useContext } from "react";

const WorkspaceModeContext = createContext({
  navMode: "student",
  setNavMode: () => {},
});

export function WorkspaceModeProvider({ value, children }) {
  return <WorkspaceModeContext.Provider value={value}>{children}</WorkspaceModeContext.Provider>;
}

export function useWorkspaceMode() {
  return useContext(WorkspaceModeContext);
}
