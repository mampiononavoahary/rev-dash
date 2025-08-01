import InitializeToken from "@/app/lib/initializer";
import { lusitana } from "@/app/ui/fonts";
import Pagination from "@/app/ui/invoices/pagination";
import { getCountTransactions } from "@/app/ui/transactions/gettransaction";
import React from "react";
import { Suspense } from "react";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import Search from "@/app/ui/search";
import Client from "@/app/ui/customers/client";
import { CreateClients } from "@/app/ui/customers/buttons";

export const dynamic = "force-dynamic";

export default async function page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <div>
      <InitializeToken />
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Liste des clients</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Rechercher un produit..." />
        <CreateClients />
      </div>
      <Suspense fallback={<InvoicesTableSkeleton />}>
        <Client query={query} currentPage={currentPage} />
      </Suspense>
    </div>
  );
}
