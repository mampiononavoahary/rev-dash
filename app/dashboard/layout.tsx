"use client";

import SideNav from "@/app/ui/dashboard/sidenav";
import { useAuth } from "@/app/lib/userContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const experimental_ppr = true;

export default function Layout({ children }: { children: React.ReactNode }) {
  const { verify, isLoading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const token = verify();

    if (!token) {
      toast.error(
        "Votre session a expiré. Vous allez être redirigé vers la page de connexion."
      );

      setIsRedirecting(true);

      setTimeout(() => {
        router.push("/"); // Redirection vers la page de connexion
      }, 2000);
    }
  }, [router, verify]);

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden relative">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12 relative">
        {!isRedirecting && !isLoading ? (
          children
        ) : (
          <div className="absolute inset-0 bg-gray-800 bg-opacity-75 z-10 flex justify-center items-center">
            <p className="text-white text-lg">Chargement...</p>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}

