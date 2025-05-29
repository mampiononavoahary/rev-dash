import React from 'react'
import Collecteurs from '@/app/ui/collecteurs/collecteur'
import { CreateCollecteurs } from '@/app/ui/collecteurs/buttons';
import InitializeToken from '@/app/lib/initializer';
export const dynamic = "force-dynamic";

const page = () => {
  return (
    <>
      <InitializeToken />
      <div className='flex justify-end w-full mb-4'>
        <CreateCollecteurs />
      </div>
      <Collecteurs />
    </>
  )
}

export default page
