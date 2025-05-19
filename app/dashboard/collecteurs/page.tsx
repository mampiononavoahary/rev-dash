import React from 'react'
import Collecteurs from '@/app/ui/collecteurs/collecteur'
import { CreateCollecteurs } from '@/app/ui/collecteurs/buttons';
export const dynamic = "force-dynamic";

const page = () => {
  return (
    <>
      <div className='flex justify-end w-full mb-4'>
        <CreateCollecteurs />
      </div>
      <Collecteurs />
    </>
  )
}

export default page
