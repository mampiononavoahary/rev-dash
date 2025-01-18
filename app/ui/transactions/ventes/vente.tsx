import { Vente } from '@/app/lib/definitions';
import { getAllVentes } from './getAllVents';
import { DeleteTransaction, UpdateTransaction } from '../buttons';
import TransactionStatus from '../status';

export default async function Ventes({query,currentPage}:{query:string,currentPage:number}) {

  try {
    const ventes = await getAllVentes(query,currentPage);


    return (
      <div className="mt-6 flow-root">
        <div className="inline-block w-full align-middle">
          <div className="rounded-lg bg-teal-100 p-2 md:pt-0">
            {/* Affichage pour petits écrans (moins de 1341px de largeur OU 760px de hauteur) */}
            <div className="custom-lg:block custom-sm:block xl:hidden space-y-4">
              {ventes?.map((vente: Vente, index: string) => (
                <div
                  key={vente.id_transaction || index}
                  className="flex flex-col space-y-2 rounded-md bg-white p-4 shadow-md"
                >
                  <div className="flex items-center justify-between border-b pb-3">
                    <p className="text-sm font-semibold text-gray-600">
                      {vente.nom_client}
                    </p>
                    <p className="text-xs text-gray-500">
                      {vente.date_transaction}
                    </p>
                  </div>
                  <div className="text-sm">
                    <p>
                      <span className="font-medium">Produit :</span> {vente.nom_produit}
                    </p>
                    <p>
                      <span className="font-medium">Quantité :</span> {vente.quantite} {vente.unite}
                    </p>
                    <p>
                      <span className="font-medium">Statut :</span> {vente.status}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateTransaction id_transaction={vente.id_transaction} />
                    <DeleteTransaction id_transaction={vente.id_transaction} />
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
                  <th scope="col" className="px-3 py-5">Date vente</th>
                  <th scope="col" className="px-3 py-5">Lieu vente</th>
                  <th scope="col" className="px-3 py-5">Quantité</th>
                  <th scope="col" className="px-3 py-5">Unité</th>
                  <th scope="col" className="px-3 py-5">Statut</th>
                  <th scope="col" className="relative py-3 pl-6 pr-3">
                    <span className="sr-only">Modifier</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {ventes?.map((vente: Vente, index: string) => (
                  <tr
                    key={vente.id_transaction || index}
                    className="w-full border-b py-3 text-sm last-of-type:border-none"
                  >
                    <td className="whitespace-nowrap px-3 py-3">{vente.nom_client}</td>
                    <td className="whitespace-nowrap px-3 py-3">{vente.nom_produit}</td>
                    <td className="whitespace-nowrap px-3 py-3">{vente.date_transaction}</td>
                    <td className="whitespace-nowrap px-3 py-3">{vente.lieu_transaction}</td>
                    <td className="whitespace-nowrap px-3 py-3">{vente.quantite}</td>
                    <td className="whitespace-nowrap px-3 py-3">{vente.unite}</td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <TransactionStatus status={vente.status} />
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        <UpdateTransaction id_transaction={vente.id_transaction} />
                        <DeleteTransaction id_transaction={vente.id_transaction} />
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


