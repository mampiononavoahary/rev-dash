import Produits from '@/app/ui/produits/produits-detail';
import InitializeToken from '@/app/lib/initializer';
import React from 'react';

const Page = () => {
  return (
    <div>
      <InitializeToken />
      <Produits />
    </div>
  );
};

export default Page;

