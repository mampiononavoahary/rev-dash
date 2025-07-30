"use client";
import { useEffect, useState } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { lusitana } from '@/app/ui/fonts';
import { getLatestTransactions } from './getAllGeneralPage';

export default function LatestTransaction() {
  const [latestTransactions, setLatestTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLatestTransactions = async () => {
      try {
        const transactions = await getLatestTransactions();
        setLatestTransactions(transactions);
      } catch (error) {
        console.error('Error fetching latest transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestTransactions();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col md:col-span-4">
        <h2 className={`${lusitana.className} mb-2 text-xl md:text-2xl`}>
           Voici la liste des trois dernières transactions.
        </h2>
        <div className="flex grow flex-col justify-between rounded-xl bg-teal-100 p-2 w-full">
          <div className="bg-white px-2 py-6">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-2 text-xl md:text-2xl`}>
        Voici la liste des trois dernières transactions.
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-teal-100 p-2 w-full">
        <div className="bg-white px-2 py-6">
          {latestTransactions?.map((transaction: any, i: any) => {
            return (
              <div
                key={transaction.id_transaction}
                className={clsx(
                  'flex flex-row items-center justify-between py-4',
                  {
                    'border-t': i !== 0,
                  }
                )}
              >
                <div className="flex flex-col items-start w-full">
                  {/* Nom */}
                  <p className="text-sm font-semibold md:text-base truncate">
                    {transaction.nom}
                  </p>
                  
                  {/* Date */}
                  <p className="text-sm text-gray-500 sm:block truncate w-full">
                    {transaction.date_de_transaction}
                  </p>
                  
                  {/* Nom du produit */}
                  <p className="text-sm font-semibold md:text-base truncate">
                    {transaction.nom_detail}
                  </p>
                  
                  {/* Quantité et unité */}
                  <div className="flex flex-wrap gap-2">
                    <p className="truncate text-sm text-gray-500">
                      Quantité: {transaction.quantite}
                    </p>
                    <p className="truncate text-sm text-gray-500">
                      Unité: {transaction.unite}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center pb-2 pt-4">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500">Mis à jour à l'instant</h3>
        </div>
      </div>
    </div>
  );
}

