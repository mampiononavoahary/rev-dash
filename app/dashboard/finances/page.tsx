import React from 'react'
import Invoice from '@/app/ui/facture/facture' 

const page = () => {
  return (
    <div>
    <h1 className='font-medium mb-6'>Dernier facture</h1>
    <Invoice/>
    <h1 className='font-medium mt-6'>Toutes les factures</h1>
    </div>
  )
}

export default page
