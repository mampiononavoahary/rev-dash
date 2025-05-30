'use client'
import { getAllProduitsWithDetail } from '@/app/ui/produits/getproduits';
import { DeleteProduct, UpdateProduct } from './buttons';
import { useEffect, useState } from 'react';

export default function Produits() {
  const [produits, setProduits] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const allProdutis = await getAllProduitsWithDetail();
        setProduits(allProdutis);
      } catch (error) {
        console.error('Erreur lors de la récupération de produits,', error)
      }
    };
    fetchData()
  }, []);
  try {
    return (
      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-teal-100 p-2 md:pt-0">
            <div className="custom-sm:block custom-lg:block xl:hidden">
              {produits?.map((produit: any) => (
                <div
                  key={produit.id_detail_produit}
                  className="mb-2 w-full rounded-md bg-white p-4"
                >
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="text-sm text-gray-500">{produit.nom_detail}</p>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between pt-4">
                    <div>
                      <p className="text-xl font-medium">
                        {produit.prix_d_achat}
                      </p>
                      <p className="text-xl font-medium">
                        {produit.prix_de_vente}
                      </p>
                      <p>{produit.unite}</p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <UpdateProduct id={produit.id_detail_produit} />
                      <DeleteProduct id={produit.id_detail_produit} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <table className="hidden min-w-full text-gray-900 custom-sm:hidden custom-lg:hidden md:table">
              <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                    Nom detail produit
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Symbole
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Prix d'Achat
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Prix de Vente
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Unite
                  </th>
                  <th scope="col" className="relative py-3 pl-6 pr-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {produits?.map((produit: any) => (
                  <tr
                    key={produit.id_detail_produit}
                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    <td className="whitespace-nowrap px-3 py-3">
                      {produit.nom_detail}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {produit.symbole}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {produit.prix_d_achat}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {produit.prix_de_vente}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {produit.unite}
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        <UpdateProduct id={produit.id_detail_produit} />
                        <DeleteProduct id={produit.id_detail_produit} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Erreur dans le composant Produits:', error);
    return <p>Actualiser la page s'il vous plaît...</p>;
  }
}


