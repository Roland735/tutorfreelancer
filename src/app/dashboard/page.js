"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      const role = session?.user?.role;
      if (role === "student") {
        router.push("/dashboard/student");
      } else if (role === "tutor") {
        router.push("/dashboard/tutor");
      } else if (role === "admin") {
        router.push("/admin");
      } else {
        // Default fallback or for 'both' role
        router.push("/dashboard/student");
      }
    }
  }, [status, router, session]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex items-center justify-center">
      <Loader2 className="animate-spin text-4xl text-primary" />
    </div>
  );
}
