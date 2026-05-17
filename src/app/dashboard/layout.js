import AppShell from "@/components/layout/AppShell";

export default function DashboardLayout({ children }) {
  return <AppShell roleScope="user">{children}</AppShell>;
}
