import RevenueChart from "@/app/ui/dashboard/revenue-chart"
import { StockRestantChart } from "@/app/ui/dashboard/stock-restant-chart"
import { lusitana } from "@/app/ui/fonts"
import CardWrapper from "@/app/ui/dashboard/cards"
import { Suspense } from "react"
import {
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
  CardsSkeleton,
} from "@/app/ui/skeletons"
import InitializeToken from "@/app/lib/initializer"
import LatestTransaction from "@/app/ui/dashboard/latest-transactions"
import Filter from "@/app/ui/filter"

export const dynamic = "force-dynamic"

export default async function Page(props: {
  searchParams?: Promise<{
    location?: string;
    date?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const lieu = searchParams?.location || "";
  const date = searchParams?.date || "";

  return (
    <main>
      <InitializeToken />
      <h1 className={`${lusitana.className} mb-2 mt-0 text-xl md:text-2xl`}>
        Tableau de bord
      </h1>

      <Filter datePlaceholder="Filtrer par date" locationPlaceholder="Filtrer par lieu de stock" />
      {/* Section des cartes */}
      <div className="grid gap-6 sm-conf:grid-cols-1 lg-conf:grid-cols-2 lg:grid-cols-4 ">
        <CardWrapper lieu={lieu} date={date} />
      </div>

      {/* Section des graphiques et dernières transactions */}
      <div className="mt-6 grid grid-cols-1 lg-conf:grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <div className="col-span-1 md:col-span-4 lg:col-span-6">
          <Suspense fallback={<RevenueChartSkeleton />}>
            <RevenueChart />
          </Suspense>
        </div>

        <div className="col-span-1 md:col-span-4 lg:col-span-2">
          <Suspense fallback={<LatestInvoicesSkeleton />}>
            <LatestTransaction />
          </Suspense>
        </div>
      </div>
      <div className="w-full mt-4">
        <StockRestantChart/>
      </div>

    </main>
  )
}

