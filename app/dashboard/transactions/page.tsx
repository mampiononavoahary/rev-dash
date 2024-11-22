import InitializeToken from '@/app/lib/initializer'
import { lusitana } from '@/app/ui/fonts'
import Search from '@/app/ui/search'
import { CreateTransaction } from '@/app/ui/transactions/buttons'
import Transactions from '@/app/ui/transactions/transaction'
import React from 'react'

export const dynamic = 'force-dynamic';

const page = () => {
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
      <Transactions />
    </div>
  )
}

export default page
