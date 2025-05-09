import { DeleteCollecteur, Explorer, UpdateCollecteur } from "./buttons";
import { getAllCollecteurs } from "./collecteur-api";

export default async function Collecteurs() {
  try {
    const AllCollecteurs = await getAllCollecteurs();
    return (
      <div className="mt-6 flow-root">
        <div className="inline-block w-full align-middle">
          <div>

            <div className="rounded-lg bg-teal-100 p-2 md:pt-0">
              <h2 className="flex justify-center text-lg font-medium">
                Liste des tout les collecteurs
              </h2>
              <div className="custom-lg:block custom-sm:block xl:hidden space-y-4">
                {AllCollecteurs?.map((collecteur: any, index: string) => (
                  <div
                    key={collecteur.id_collecteur || index}
                    className="flex flex-col space-y-2 rounded-md bg-white p-4 shadow-md"
                  >
                    <div className="text-sm">
                      <p>
                        <span className="font-medium">Nom:</span> {collecteur.nom}
                      </p>
                      <p>
                        <span className="font-medium">Prenom :</span> {collecteur.prenom}
                      </p>
                      <p>
                        <span className="font-medium">Addresse :</span> {collecteur.adresse}
                      </p>
                      <p>
                        <span className="font-medium">Contact :</span> {collecteur.telephone}
                      </p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <UpdateCollecteur id_collecteur={collecteur.idCollecteur} />
                      <DeleteCollecteur id_collecteur={collecteur.idCollecteur} />
                      <Explorer id_collecteur={collecteur.idCollecteur} />
                    </div>


                  </div>
                ))}
              </div>
              <div className="hidden custom-lg:hidden custom-sm:hidden md:block overflow-x-auto max-h-[400px]">
                <table className="hidden min-w-full text-gray-900 custom-lg:hidden custom-sm:hidden md:table">
                  <thead className="sticky top-0 bg-teal-100 text-left text-sm font-medium shadow-md">
                    <tr>
                      <th scope="col" className="px-4 py-5">Nom</th>
                      <th scope="col" className="px-3 py-5">Prenom</th>
                      <th scope="col" className="px-3 py-5">Adresse</th>
                      <th scope="col" className="px-3 py-5">Contact</th>
                      <th scope="col" className="relative py-3 pl-6 pr-3">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {AllCollecteurs?.map((collecteur: any, index: string) => (
                      <tr
                        key={collecteur.idCollecteur || index}
                        className="w-full border-b py-3 text-sm last-of-type:border-none"
                      >
                        <td className="whitespace-nowrap px-3 py-3">{collecteur.nom}</td>
                        <td className="whitespace-nowrap px-3 py-3">{collecteur.prenom}</td>
                        <td className="whitespace-nowrap px-3 py-3">{collecteur.adresse}</td>
                        <td className="whitespace-nowrap px-3 py-3">{collecteur.telephone}</td>
                        <td className="whitespace-nowrap py-3 pl-6 pr-3">
                          <div className="flex justify-end gap-3">
                            <UpdateCollecteur id_collecteur={collecteur.idCollecteur} />
                            <DeleteCollecteur id_collecteur={collecteur.idCollecteur} />
                            <Explorer id_collecteur={collecteur.idCollecteur} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Erreur dans le composant Produits:', error);
    return <p>Actualiser la page s'il vous plaît.</p>;
  }
} 
