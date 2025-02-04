
import React from 'react';
import { CardWithForm } from '@/app/ui/stock/update-stock';
import { TransformationProduit } from '@/app/ui/stock/update-stock';
export default async function Page() {
  // Exemple de récupération de données
  const data = await fetchData();

  return (
    <div>
      <h1 className='flex justify-center text-xl font-bold'>Mettre à jour le stock</h1>
      <div className='grid justify-center gap-6 mt-6'>

        <div className='flex flex-col gap-4'>
          <h3 className='flex justify-center'>Mise à jour du quantité</h3>
          <CardWithForm />
        </div>
        <div className='flex flex-col gap-4'>
          <h3 className='flex justify-center'>Transformation de produit</h3>
          <TransformationProduit />
        </div>
      </div>
    </div>);
}

// Exemple de fonction de récupération de données
async function fetchData() {
  return new Promise((resolve) =>
    setTimeout(() => resolve('Données simulées'), 1000)
  );
}


