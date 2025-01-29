
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { lusitana } from '@/app/ui/fonts';
import { getLatestTransactions } from './getAllGeneralPage';

export default async function LatestTransaction() {
  const latesttransactions = await getLatestTransactions();
  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-2 text-xl md:text-2xl`}>
        Les trois dernières transactions
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-teal-100 p-4 w-full">
        <div className="bg-white px-6">
          {latesttransactions?.map((transaction: any, i: any) => {
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

