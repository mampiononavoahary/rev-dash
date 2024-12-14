import InitializeToken from "@/app/lib/initializer";
import { lusitana } from "@/app/ui/fonts";
import Pagination from "@/app/ui/invoices/pagination";
import { getCountTransactions } from "@/app/ui/transactions/gettransaction";
import React from "react";
import { Suspense } from "react";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import Ventes from "@/app/ui/transactions/ventes/vente";
import Search from "@/app/ui/search";
import { CreateTransaction } from "@/app/ui/transactions/buttons";

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
  const totalPages = Number(await getCountTransactions(query)) || 1;

  return (
    <div>
      <InitializeToken />
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Ventes des produits</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Rechercher un produit..." />
      </div>
      <Suspense fallback={<InvoicesTableSkeleton />}>
        <Ventes query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
