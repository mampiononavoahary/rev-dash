import InitializeToken from '@/app/lib/initializer'
import { lusitana } from '@/app/ui/fonts'
import Pagination from '@/app/ui/invoices/pagination'
import Search from '@/app/ui/search'
import { CreateTransaction } from '@/app/ui/transactions/buttons'
import { getCountTransactions } from '@/app/ui/transactions/gettransaction'
import Transactions from '@/app/ui/transactions/transaction'
import React from 'react'

export const dynamic = 'force-dynamic';

export default async function page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = Number(await getCountTransactions(query)) || 1;
 
  return (
    <div>
      <InitializeToken />
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Transactions</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Rechercher un produit..." />
        <CreateTransaction />
      </div>
      <Transactions query={query} currentPage={currentPage}/>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
      </div>
  )
}

