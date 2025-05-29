'use client'
import React from "react";
import { useEffect, useState } from "react";
import { DeleteCollecteur, Explorer, UpdateCollecteur } from "./buttons";
import { getAllCollecteurs, getCreditByIdCollecteur, getCreditWithDebits } from "./collecteur-api";

export default function Collecteurs() {
  const [creditAndDebit, setCreditAndDebit] = useState<any[]>([]);
  const [allCollecteur, setAllCollecteur] = useState<any[]>([]);

  const updateListCollecteur = async () => {
    try {
      const collecte = await getAllCollecteurs();
      const debitcredit = await getCreditWithDebits();
      setAllCollecteur(collecte);
      setCreditAndDebit(debitcredit);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des collecteurs :", error);
    }
  };

  useEffect(() => {
    const fetchCreditWithDebit = async () => {
      try {
        const collecte = await getAllCollecteurs();
        const creditsdebits = await getCreditWithDebits();
        setCreditAndDebit(creditsdebits);
        setAllCollecteur(collecte);
      } catch (error) {
        console.log("Erreur lors de la récupération des données", error);
      }
    }; fetchCreditWithDebit()
  }, [])
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block w-full align-middle">
        <div>

          <div className="rounded-lg bg-teal-100 p-2 md:pt-0">
            <h2 className="flex justify-center text-lg font-medium">
              Liste des tout les collecteurs
            </h2>
            <div className="custom-lg:block custom-sm:block hidden space-y-4">
              {Array.isArray(allCollecteur) && allCollecteur.map((collecteur, index) => (
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
                    <p>
                      <span className="font-medium">Catégorie :</span> {collecteur.categorie}
                    </p>

                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateCollecteur id_collecteur={collecteur.idCollecteur} />
                    <DeleteCollecteur id_collecteur={collecteur.idCollecteur} onDelete={updateListCollecteur} />
                    <Explorer id_collecteur={collecteur.idCollecteur} />
                  </div>


                </div>
              ))}
            </div>
            <div className="block custom-lg:hidden custom-sm:hidden md:block overflow-x-auto max-h-[400px]">
              <table className="hidden min-w-full text-gray-900 custom-lg:hidden custom-sm:hidden md:table">
                <thead className="sticky top-0 bg-teal-100 text-left text-sm font-medium shadow-md">
                  <tr>
                    <th scope="col" className="px-4 py-5">Nom</th>
                    <th scope="col" className="px-3 py-5">Prenom</th>
                    <th scope="col" className="px-3 py-5">Adresse</th>
                    <th scope="col" className="px-3 py-5">Contact</th>
                    <th scope="col" className="px-3 py-5">Catégorie</th>
                    <th scope="col" className="relative py-3 pl-6 pr-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {Array.isArray(allCollecteur) && allCollecteur.map((collecteur, index) => (
                    <tr
                      key={collecteur.idCollecteur || index}
                      className="w-full border-b py-3 text-sm last-of-type:border-none"
                    >
                      <td className="whitespace-nowrap px-3 py-3">{collecteur.nom}</td>
                      <td className="whitespace-nowrap px-3 py-3">{collecteur.prenom}</td>
                      <td className="whitespace-nowrap px-3 py-3">{collecteur.adresse}</td>
                      <td className="whitespace-nowrap px-3 py-3">{collecteur.telephone}</td>
                      <td className="whitespace-nowrap px-3 py-3">{collecteur.categorie}</td>
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <UpdateCollecteur id_collecteur={collecteur.idCollecteur} />
                          <DeleteCollecteur id_collecteur={collecteur.idCollecteur} onDelete={updateListCollecteur} />
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

      <div>
        <h1 className="mt-6 flex justify-center font-bold">
          Liste des crédits avec leurs débits
        </h1>

        <div className="rounded-lg bg-teal-100 p-2 md:pt-0">
          <div className="custom-lg:block custom-sm:block hidden space-y-4">
            {creditAndDebit?.map((credit: any, index: number) => (
              <div
                key={credit.id_credit_collecteur || index}
                className="flex flex-col space-y-2 rounded-md bg-white p-4 shadow-md"
              >
                <div className="text-sm">
                  <p>
                    <span className="font-medium">Réf:</span> {credit.referance_credit}
                  </p>
                  <p>
                    <span className="font-medium">Date de crédit :</span> {credit.date_de_credit.split('T')[0]}
                  </p>
                  <p>
                    <span className="font-medium">Montant :</span> {credit.montant_credit}
                  </p>
                  <div>
                    <span className="font-medium">Debits :</span>
                    <div className="max-h-40 overflow-y-auto pr-2">
                      {credit.debit_extract?.map((debit: any, i: number) => (
                        <div key={i} className="mb-4 border-b border-gray-300 pb-2">
                          <div className="font-semibold text-sm text-gray-700">
                            📅 {debit.date_de_debit?.split("T")[0]}
                          </div>
                          <div className="text-sm text-gray-700">
                            💸 <strong>Depense:</strong>{debit.depense} Ar
                          </div>
                          {debit.produits_collecter_extract?.map((prod: any, j: number) => (
                            <div key={j} className="ml-4 mt-1 text-sm text-gray-800">
                              <div><strong>Produit:</strong> {prod.nom_detail}</div>
                              <div><strong>Quantité:</strong> {prod.quantite}</div>
                              <div><strong>Unité:</strong> {prod.unite}</div>
                              <div><strong>Prix:</strong> {prod.prix_unitaire}</div>
                              <hr className="my-1" />
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>

                  </div>
                  <p>
                    <span className="font-medium">Total debit :</span> {credit.total_debit}
                  </p>
                  <p>
                    <span className="font-medium">Reste :</span> {credit.reste}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <table className="hidden min-w-full text-gray-900 custom-lg:hidden custom-sm:hidden md:table mt-6">
          <thead className="sticky top-0 bg-teal-100 text-left text-sm shadow-md">
            <tr>
              <th scope="col" rowSpan={2} className="px-4 py-5">Collecteur</th>
              <th scope="col" rowSpan={2} className="px-3 py-5">Date crédit</th>
              <th scope="col" rowSpan={2} className="px-3 py-5">Montant</th>
              <th scope="col" rowSpan={2} className="px-4 py-5">Débits</th>
              <th scope="col" rowSpan={2} className="px-3 py-5">Total débit</th>
              <th scope="col" rowSpan={2} className="px-3 py-5">Reste</th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {creditAndDebit?.map((credit: any, index: number) => (
              <tr key={credit.id_credit_collecteur || index}>
                <td className="whitespace-nowrap px-3 py-3">{credit.referance_credit}</td>

                <td className="whitespace-nowrap px-3 py-3">
                  {credit.date_de_credit?.split('T')[0]}
                </td>

                <td className="whitespace-nowrap px-3 py-3">
                  {credit.montant_credit}
                </td>

                <td className="whitespace-nowrap px-3 py-3">
                  <div className="max-h-40 overflow-y-auto pr-2">
                    {credit.debit_extract?.map((debit: any, i: number) => (
                      <div key={i} className="mb-4 border-b border-gray-300 pb-2">
                        <div className="font-semibold text-sm text-gray-700">
                          📅 {debit.date_de_debit?.split("T")[0]}
                        </div>
                        <div className="text-sm text-gray-700">
                          💸 <strong>Depense:</strong>{debit.depense} Ar
                        </div>
                        {debit.produits_collecter_extract?.map((prod: any, j: number) => (
                          <div key={j} className="ml-4 mt-1 text-sm text-gray-800">
                            <div><strong>Produit:</strong> {prod.nom_detail}</div>
                            <div><strong>Quantité:</strong> {prod.quantite}</div>
                            <div><strong>Unité:</strong> {prod.unite}</div>
                            <div><strong>Prix:</strong> {prod.prix_unitaire}</div>
                            <hr className="my-1" />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </td>

                <td className="whitespace-nowrap px-3 py-3">{credit.total_debit}</td>

                <td className="whitespace-nowrap px-3 py-3">{credit.reste}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 
