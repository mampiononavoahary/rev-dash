import React from 'react'
import Invoice from '@/app/ui/facture/facture'
import Pret from '@/app/ui/prêts/pretList'
import InitializeToken from '@/app/lib/initializer'

const page = () => {
  return (
    <div>
      <InitializeToken />
      <h1 className='font-medium mb-6 flex justify-center'>Listes des factures</h1>
      <Invoice />
      <h1 className='font-medium mt-6 flex justify-center'>Listes des prêts bancaires</h1>
      <Pret />
    </div>
  )
}

export default page
