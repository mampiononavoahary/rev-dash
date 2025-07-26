import RevenueChart from "@/app/ui/dashboard/revenue-chart"
import { StockRestantChart } from "@/app/ui/dashboard/stock-restant-chart"
import { lusitana } from "@/app/ui/fonts"
import CardWrapper from "@/app/ui/dashboard/cards"
import { Suspense } from "react"
import {
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
} from "@/app/ui/skeletons"
import InitializeToken from "@/app/lib/initializer"
import LatestTransaction from "@/app/ui/dashboard/latest-transactions"
import Filter from "@/app/ui/filter"
import BilanCollecteur from "@/app/ui/dashboard/bilan-collecteur"
import BilanFilter from "@/app/ui/bilan-filter"

export const dynamic = "force-dynamic"

export default async function Page(props: {
  searchParams?: Promise<{
    location?: string;
    date?: string;
    dateDebut?: string;
    dateFin?: string;
    startDate?: string;
    endDate?: string;
  }>;
}) {

  const today = new Date();
  const seveDaysAgo = new Date();
  seveDaysAgo.setDate(today.getDate() - 7);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const searchParams = await props.searchParams;
  const lieu = searchParams?.location || "";
  const date = searchParams?.date || "";
  const dateDebut = searchParams?.dateDebut || formatDate(seveDaysAgo);
  const dateFin = searchParams?.dateFin || formatDate(today);
  const startDate = searchParams?.startDate || formatDate(seveDaysAgo);
  const endDate = searchParams?.endDate || formatDate(today);

  return (
    <main>
      <InitializeToken />
      <h1 className={`${lusitana.className} mb-4 mt-0 text-xl text-gray-500 md:text-2xl flex justify-center animate-bounce`}>
        TABLEAU DE BORD
      </h1>

      <Filter datePlaceholder="Filtrer par date" locationPlaceholder="Filtrer par point de vente ou point d'achat" dateDebutPlaceholder="Date début" dateFinPlaceholder="Date fin" />

      <div className="grid gap-6 sm-conf:grid-cols-1 lg-conf:grid-cols-2 lg:grid-cols-4 ">
        <CardWrapper lieu={lieu} date={date} dateDebut={dateDebut} dateFin={dateFin} />
      </div>

      <div className="mt-6 grid gap-6 grid-cols-1 md:grid-cols-4 lg:grid-cols-8 custom-lg2:grid-cols-4">
        <div className="col-span-1 md:col-span-4 lg:col-span-6 custom-lg2:col-span-4">
          <Suspense fallback={<RevenueChartSkeleton />}>
            <RevenueChart />
          </Suspense>
        </div>

        <div className="col-span-1 md:col-span-4 lg:col-span-2 custom-lg2:col-span-4">
          <Suspense fallback={<LatestInvoicesSkeleton />}>
            <LatestTransaction />
          </Suspense>
        </div>
      </div>
      <div className="w-full mt-4">
        <StockRestantChart />
      </div>

      <BilanFilter />
      <div className="w-full mt-4">
        <BilanCollecteur startDate={startDate} endDate={endDate} />
      </div>
    </main>
  )
}

