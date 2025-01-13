import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { lusitana } from '@/app/ui/fonts';
import { getLatestTransactions } from './getAllGeneralPage';
export default async function LatestTransaction() {
  const latesttransactions = await getLatestTransactions();
  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Les trois dernier transactions
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-teal-100 p-4">
        {/* NOTE: Uncomment this code in Chapter 7 */}

         <div className="bg-white px-6">
          {latesttransactions?.map((transaction:any, i:any) => {
            return (
              <div
                key={transaction.id_transaction}
                className={clsx(
                  'flex flex-row items-center justify-between py-4',
                  {
                    'border-t': i !== 0,
                  },
                )}
              >
                <div className="flex items-center">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold md:text-base">
                      {transaction.nom}
                    </p>
                    <p className="hidden text-sm text-gray-500 sm:block">
                      {transaction.date_de_transaction}
                    </p>
                    <p className="truncate text-sm font-semibold md:text-base">
                      {transaction.nom_detail}
                    </p>
                    <p className="hidden text-sm text-gray-500 sm:block">
                      {transaction.quantite}
                    </p>
                    <p className="hidden text-sm text-gray-500 sm:block">
                      {transaction.unite}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}
