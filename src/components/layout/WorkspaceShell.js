"use client";

import AppShell from "@/components/layout/AppShell";

export default function WorkspaceShell({ children }) {
  return <AppShell roleScope="user">{children}</AppShell>;
}
