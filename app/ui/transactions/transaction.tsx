import { getAllTransactions } from '@/app/ui/transactions/gettransaction';
import { DeleteTransaction, UpdateTransaction } from './buttons';
import TransactionStatus from './status';
import { Transaction } from '@/app/lib/definitions';

export default async function Transactions({query,currentPage}:{query:string,currentPage:number}) {

  try {
    const transactions = await getAllTransactions(query,currentPage);


    return (
      <div className="mt-6 flow-root">
        <div className="inline-block w-full align-middle">
          <div className="rounded-lg bg-teal-100 p-2 md:pt-0">
            {/* Affichage pour petits écrans (moins de 1341px de largeur OU 760px de hauteur) */}
            <div className="custom-lg:block custom-sm:block xl:hidden space-y-4">
              {transactions?.map((transaction: Transaction, index: string) => (
                <div
                  key={transaction.id_transaction || index}
                  className="flex flex-col space-y-2 rounded-md bg-white p-4 shadow-md"
                >
                  <div className="flex items-center justify-between border-b pb-3">
                    <p className="text-sm font-semibold text-gray-600">
                      {transaction.nom_client}
                    </p>
                    <p className="text-xs text-gray-500">
                      {transaction.date_transaction}
                    </p>
                  </div>
                  <div className="text-sm">
                    <p>
                      <span className="font-medium">Produit :</span> {transaction.nom_produit}
                    </p>
                    <p>
                      <span className="font-medium">Quantité :</span> {transaction.quantite} {transaction.unite}
                    </p>
                    <p>
                      <span className="font-medium">Statut :</span> {transaction.status}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateTransaction id_transaction={transaction.id_transaction} />
                    <DeleteTransaction id_transaction={transaction.id_transaction} />
                  </div>
                </div>
              ))}
            </div>

            {/* Affichage pour grands écrans */}
            <table className="hidden min-w-full text-gray-900 custom-lg:hidden custom-sm:hidden md:table">
              <thead className="rounded-lg text-left text-sm font-medium">
                <tr>
                  <th scope="col" className="px-4 py-5 sm:pl-6">Nom Client</th>
                  <th scope="col" className="px-3 py-5">Nom produit</th>
                  <th scope="col" className="px-3 py-5">Date transaction</th>
                  <th scope="col" className="px-3 py-5">Lieu transaction</th>
                  <th scope="col" className="px-3 py-5">Quantité</th>
                  <th scope="col" className="px-3 py-5">Unité</th>
                  <th scope="col" className="px-3 py-5">Statut</th>
                  <th scope="col" className="relative py-3 pl-6 pr-3">
                    <span className="sr-only">Modifier</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {transactions?.map((transaction: Transaction, index: string) => (
                  <tr
                    key={transaction.id_transaction || index}
                    className="w-full border-b py-3 text-sm last-of-type:border-none"
                  >
                    <td className="whitespace-nowrap px-3 py-3">{transaction.nom_client}</td>
                    <td className="whitespace-nowrap px-3 py-3">{transaction.nom_produit}</td>
                    <td className="whitespace-nowrap px-3 py-3">{transaction.date_transaction}</td>
                    <td className="whitespace-nowrap px-3 py-3">{transaction.lieu_transaction}</td>
                    <td className="whitespace-nowrap px-3 py-3">{transaction.quantite}</td>
                    <td className="whitespace-nowrap px-3 py-3">{transaction.unite}</td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <TransactionStatus status={transaction.status} />
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        <UpdateTransaction id_transaction={transaction.id_transaction} />
                        <DeleteTransaction id_transaction={transaction.id_transaction} />
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
    return <p>Actualiser la page s'il vous plaît.</p>;
  }
}


