import { Achat } from '@/app/lib/definitions';
import { DeleteTransaction, UpdateTransaction } from '../buttons';
import TransactionStatus from '../status';
import { getAllAchats } from './getAllAchats';

export default async function Achats({query,currentPage}:{query:string,currentPage:number}) {

  try {
    const achats = await getAllAchats(query,currentPage);


    return (
      <div className="mt-6 flow-root">
        <div className="inline-block w-full align-middle">
          <div className="rounded-lg bg-teal-100 p-2 md:pt-0">
            {/* Affichage pour petits écrans (moins de 1341px de largeur OU 760px de hauteur) */}
            <div className="custom-lg:block custom-sm:block xl:hidden space-y-4">
              {achats?.map((achat: Achat, index: string) => (
                <div
                  key={achat.id_transaction || index}
                  className="flex flex-col space-y-2 rounded-md bg-white p-4 shadow-md"
                >
                  <div className="flex items-center justify-between border-b pb-3">
                    <p className="text-sm font-semibold text-gray-600">
                      {achat.nom_client}
                    </p>
                    <p className="text-xs text-gray-500">
                      {achat.date_transaction}
                    </p>
                  </div>
                  <div className="text-sm">
                    <p>
                      <span className="font-medium">Produit :</span> {achat.nom_produit}
                    </p>
                    <p>
                      <span className="font-medium">Quantité :</span> {achat.quantite} {achat.unite}
                    </p>
                    <p>
                      <span className="font-medium">Statut :</span> {achat.status}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateTransaction id_transaction={achat.id_transaction} />
                    <DeleteTransaction id_transaction={achat.id_transaction} />
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
                  <th scope="col" className="px-3 py-5">Date achat</th>
                  <th scope="col" className="px-3 py-5">Lieu achat</th>
                  <th scope="col" className="px-3 py-5">Quantité</th>
                  <th scope="col" className="px-3 py-5">Unité</th>
                  <th scope="col" className="px-3 py-5">Statut</th>
                  <th scope="col" className="relative py-3 pl-6 pr-3">
                    <span className="sr-only">Modifier</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {achats?.map((achat: Achat, index: string) => (
                  <tr
                    key={achat.id_transaction || index}
                    className="w-full border-b py-3 text-sm last-of-type:border-none"
                  >
                    <td className="whitespace-nowrap px-3 py-3">{achat.nom_client}</td>
                    <td className="whitespace-nowrap px-3 py-3">{achat.nom_produit}</td>
                    <td className="whitespace-nowrap px-3 py-3">{achat.date_transaction}</td>
                    <td className="whitespace-nowrap px-3 py-3">{achat.lieu_transaction}</td>
                    <td className="whitespace-nowrap px-3 py-3">{achat.quantite}</td>
                    <td className="whitespace-nowrap px-3 py-3">{achat.unite}</td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <TransactionStatus status={achat.status} />
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        <UpdateTransaction id_transaction={achat.id_transaction} />
                        <DeleteTransaction id_transaction={achat.id_transaction} />
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


