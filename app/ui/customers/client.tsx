import clsx from "clsx";
import { Clients } from "@/app/lib/definitions";
import { getClientsExtracts } from "./getClients";
import { DeleteClients, UpdateClients } from "./buttons";

export default async function Client({ query, currentPage }: { query: string, currentPage: number }) {

  try {
    const clients = await getClientsExtracts(query, currentPage);


    return (
      <div className="mt-6 flow-root">
        <div className="inline-block w-full align-middle">
          <div className="rounded-lg bg-teal-100 p-2 md:pt-0">
            {/* Affichage pour petits écrans (moins de 1341px de largeur OU 760px de hauteur) */}
            <div className="custom-lg:block custom-sm:block xl:hidden space-y-4">
              {clients?.map((client: Clients, index: string) => (
                <div
                  key={client.id_client || index}
                  className="flex flex-col space-y-2 rounded-md bg-white p-4 shadow-md"
                >
                  <div className="text-sm">
                    <p>
                      <span className="font-medium">Nom Client :</span> {client.nom}
                    </p>
                    <p>
                      <span className="font-medium">Prenom Client :</span> {client.prenom}
                    </p>

                    <p className="font-medium">
                      Total transaction:
                      <span className={clsx(
                        "whitespace-nowrap px-3 py-3",
                        client.total_transaction > 20 ? "text-green-500" : client.total_transaction >= 10 ? "text-blue-500" : "text-red-500"
                      )}>{client.total_transaction}</span>
                    </p>
                    <p className="font-medium">
                      Total paye
                      <span className={clsx(
                        "whitespace-nowrap px-3 py-3",
                        client.total_vente_paye > 200 ? "text-green-500" : client.total_vente_paye >= 100 ? "text-blue-500" : "text-red-500"
                      )}>{client.total_vente_paye}</span>
                    </p>
                    <p className="font-medium">
                      Total en attente
                      <span className={clsx(
                        "whitespace-nowrap px-3 py-3",
                        client.total_vente_paye < client.total_vente_en_attente ? "text-red-500" : client.total_vente_paye > 200 ? "text-green-500" : client.total_vente_paye >= 100 ? "text-blue-500" : "text-red-500"
                      )}>{client.total_vente_en_attente}</span>
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateClients id_clients={client.id_client} />
                    <DeleteClients id_clients={client.id_client} />
                  </div>
                </div>
              ))}
            </div>

            {/* Affichage pour grands écrans */}
            <table className="hidden min-w-full text-gray-900 custom-lg:hidden custom-sm:hidden md:table">
              <thead className="rounded-lg text-left text-sm font-medium">
                <tr>
                  <th scope="col" className="px-4 py-5">Nom Client</th>
                  <th scope="col" className="px-3 py-5">Prenom Client</th>
                  <th scope="col" className="px-3 py-5">Total transaction</th>
                  <th scope="col" className="px-3 py-5">Total de vente</th>
                  <th scope="col" className="px-3 py-5">Q/té vente payé en KG</th>
                  <th scope="col" className="px-3 py-5">Q/té vente en attente en KG</th>
                  <th scope="col" className="px-3 py-5">Total d'achat</th>
                  <th scope="col" className="px-3 py-5">Q/té achat payé en KG</th>
                  <th scope="col" className="px-3 py-5">Q/té achat en attente en KG</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {clients?.map((client: Clients, index: string) => (
                  <tr
                    key={client.id_client || index}
                    className="w-full border-b py-3 text-sm last-of-type:border-none"
                  >
                    <td className="whitespace-nowrap px-3 py-3">{client.nom}</td>
                    <td className="whitespace-nowrap px-3 py-3">{client.prenom}</td>
                    <td className={clsx(
                      "whitespace-nowrap px-3 py-3",
                      client.total_transaction > 20 ? "text-green-500" : client.total_transaction >= 10 ? "text-blue-500" : "text-red-500"
                    )}>{client.total_transaction}</td>
                    <td className={clsx(
                      "whitespace-nowrap px-3 py-3",
                      client.total_vente > 20 ? "text-green-500" : client.total_vente >= 10 ? "text-blue-500" : "text-red-500"
                    )}>{client.total_vente}</td>

                    <td className={clsx(
                      "whitespace-nowrap px-3 py-3",
                      client.total_vente_paye < client.total_vente_en_attente ? "text-red-500" : client.total_vente_paye > 200 ? "text-green-500" : client.total_vente_paye >= 100 ? "text-blue-500" : "text-red-500"
                    )}>{client.total_vente_paye}</td>
                    <td className={clsx(
                      "whitespace-nowrap px-3 py-3",
                      client.total_vente_en_attente > 200 ? "text-red-500" : client.total_vente_en_attente >= 100 ? "text-blue-500" : "text-green-500"
                    )}>{client.total_vente_en_attente}</td>
                    <td className={clsx(
                      "whitespace-nowrap px-3 py-3",
                      client.total_achat > 20 ? "text-green-500" : client.total_achat >= 10 ? "text-blue-500" : "text-red-500"
                    )}>{client.total_achat}</td>

                    <td className={clsx(
                      "whitespace-nowrap px-3 py-3",
                      client.total_achat_paye < client.total_achat_en_attente ? "text-red-500" : client.total_achat_paye > 200 ? "text-green-500" : client.total_achat_paye >= 100 ? "text-blue-500" : "text-red-500"
                    )}>{client.total_achat_paye}</td>
                    <td className={clsx(
                      "whitespace-nowrap px-3 py-3",
                      client.total_achat_en_attente > 200 ? "text-red-500" : client.total_achat_en_attente >= 100 ? "text-blue-500" : "text-green-500"
                    )}>{client.total_achat_en_attente}</td>

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


