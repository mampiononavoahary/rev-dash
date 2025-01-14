import React from 'react'
import Stocks from '@/app/ui/stock/stock';
import InitializeToken from '@/app/lib/initializer';
import { Suspense } from 'react';
import { CardsSkeleton } from '@/app/ui/skeletons';

export const dynamic = "force-dynamic";

export default async function page(){
  return (
    <div>
      <InitializeToken />
      <h1 className='text-center text-xl text-gray-900 font-medium mb-4'>Stockages des produits</h1>
      <div className='flex flex-wrap p-4 gap-4 justify-center mt-4'>
      <Suspense fallback={<CardsSkeleton/>}>
      <Stocks />
      </Suspense>
      </div>
    </div>
  )
}

