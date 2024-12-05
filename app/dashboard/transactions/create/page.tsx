import React from 'react'
import CreateTransaction from '@/app/ui/transactions/create-transaction'
import InitializeToken from '@/app/lib/initializer';

export const dynamic = 'force-dynamic';

const page = () => {
  return (
    <div className='flex mt-6'>
      <InitializeToken/>
      <CreateTransaction/>
    </div>
  )
}

export default page
