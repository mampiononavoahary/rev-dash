"use client";

import SideNav from "@/app/ui/dashboard/sidenav";
import { useAuth } from "@/app/lib/userContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const experimental_ppr = true;

export default function Layout({ children }: { children: React.ReactNode }) {
  const { verify } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const token = verify();
    if (!token) {
      router.push("/"); // Redirige vers la page de connexion si non authentifié
    }
  }, [router, verify]);

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
