import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import { lusitana } from '@/app/ui/fonts';
import CardWrapper from '@/app/ui/dashboard/cards';
import { Suspense } from 'react'; 
import { RevenueChartSkeleton, LatestInvoicesSkeleton,CardsSkeleton } from '@/app/ui/skeletons';
import InitializeToken from '@/app/lib/initializer';
import LatestTransaction from '@/app/ui/dashboard/latest-transactions';

export const dynamic = 'force-dynamic';

export default async function Page() { 

  return (
      <main>
         <InitializeToken />
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
      Tableau de bord
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
         <Suspense fallback={<RevenueChartSkeleton/>}>
          <RevenueChart/>
        </Suspense>
        
       <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestTransaction />
        </Suspense>
      </div> 
    </main>
  );
}
