import { getAllTransactions } from '@/app/lib/transactions/gettransaction';
import { DeleteTransaction, UpdateTransaction } from './buttons';
import TransactionStatus from './status';

export default async function Transactions() {
  try {
    const transactions = await getAllTransactions();


    return (
      <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {transactions?.map((transactions:any) => (
              <div
                key={transactions.id_transaction}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="text-sm text-gray-500">{transactions.nom_client}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {transactions.date_transaction}
                    </p>
                    <p className="text-xl font-medium">
                      {transactions.nom_produit}
                    </p>
                    <p>{transactions.quantite}</p>
                    <p>{transactions.unite}</p>
                    <p>{transactions.status}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateTransaction id={transactions.id_transaction} />
                    <DeleteTransaction id={transactions.id_transaction} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Nom Client
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Nom produit
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date transaction
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Lieu transaction
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Quantite
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Unite
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {transactions?.map((transaction:any) => (
                <tr
                  key={transaction.id_transaction}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-3 py-3">
                    {transaction.nom_client}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {transaction.nom_produit}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {transaction.date_transaction}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {transaction.lieu_transaction}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {transaction.quantite}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {transaction.unite}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <TransactionStatus status={transaction.status}/>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateTransaction id={transaction.id_transaction} />
                      <DeleteTransaction id={transaction.id_transaction} />
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
    return <p>Impossible de charger les produits.</p>;
  }
}


