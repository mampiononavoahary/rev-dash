import Produits from '@/app/ui/produits/produits-detail';
import InitializeToken from '@/app/lib/initializer';
import React from 'react';
import Search from '@/app/ui/search';
import { CreateDetailProuit } from '@/app/ui/produits/buttons';
import { lusitana } from '@/app/ui/fonts';

const Page = () => {
  return (
    <div>
      <InitializeToken />
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Produits</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Rechercher un produit..." />
        <CreateDetailProuit />
      </div>
      <Produits />
    </div>
  );
};

export default Page;

