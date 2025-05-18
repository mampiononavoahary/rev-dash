'use client'
import React, { use, useEffect, useState } from 'react';
import { createDebit, getCollecteursById, getCreditByIdCollecteur, getCreditByRef } from '@/app/ui/collecteurs/collecteur-api';
import { createCredit } from '@/app/ui/collecteurs/collecteur-api'; // ← ajuste ce chemin si besoin
import { toast } from 'react-toastify';
import Image from 'next/image';
import { Effectuer, EnAttent } from '@/app/ui/collecteurs/buttons';
import { getIdAndName } from '@/app/ui/produits/getproduits';

export default function PaymentPage({ params }: { params: Promise<{ id_collecteur: number }> }) {
  const [selectedCredit, setSelectedCredit] = useState<any>(null);
  const [formType, setFormType] = useState<'credit' | 'debit'>('credit');
  const { id_collecteur } = use(params);
  const id = Number(id_collecteur);
  const [collecteur, setCollecteur] = useState<any>(null);
  const [credits, setCredits] = useState<any[]>([]);
  const [dateDeCredit, setDateDeCredit] = useState<string>("");
  const [dateDeDebit, setDateDeDebit] = useState<string>("");
  const [montant, setMontant] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [descriptionDebit, setDescriptionDebit] = useState<string>("");
  const [lieuCollection, setLieuCollection] = useState<string>("");
  const [referance, setReferance] = useState<string>("");
  const [produitsCollecter, setProduitsCollecter] = useState<any[]>([]);
  const [produitFiltrer, setProduitFiltrer] = useState<any[]>([]);

  const [produitId, setProduitId] = useState('');
  const [quantite, setQuantite] = useState('');
  const [unite, setUnite] = useState('');
  const [lieuStock, setLieuStock] = useState('');
  const [prixUnitaire, setPrixUnitaire] = useState('');
  const [produits, setProduits] = useState<any[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCollecteursById(id_collecteur);
        const credit = await getCreditByIdCollecteur(id_collecteur);
        const fetchedProduits = await getIdAndName();
        setCollecteur(res);
        setCredits(credit);
        setProduits(fetchedProduits);
        const produitsFiltrer = fetchedProduits.filter((e: any) => e.categorie === "PRODUIT_PREMIER");
        setProduitFiltrer(produitsFiltrer);
      } catch (error) {
        console.error('Erreur lors de la récupération de collecteur,', error);
      }
    };
    fetchData();
  }, [id_collecteur]);

  const getNomProduit = (id: string) => {
    const produit = produits.find((p) => p.id_produit_avec_detail === id);
    return produit ? produit.nom_detail : 'Produit inconnu';
  };

  const handleAddProduitsCollecter = () => {
    if (!produitId || !quantite || !unite || !prixUnitaire || !lieuStock) {
      toast.error('Tous les champs doivent être remplis.');
      return;
    }

    const newProduit = {
      id_produit_avec_detail: produitId,
      quantite,
      unite,
      prix_unitaire: Number(prixUnitaire), // Convert to number
      lieu_stock: lieuStock,
    };

    setProduitsCollecter((prev) => [...prev, newProduit]);
    setProduitId('');
    setQuantite('');
    setUnite('');
    setPrixUnitaire('');
    setLieuStock('');
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('collecteur', String(id || ''));
    formData.append('dateDeCredit', dateDeCredit);
    formData.append('montant', montant);
    formData.append('description', description);

    const res = await createCredit(formData);

    if (res?.success) {
      toast.success("Crédit ajouté !");

      try {
        const updatedCredits = await getCreditByIdCollecteur(id_collecteur);
        setCredits(updatedCredits);
      } catch (error) {
        console.error("Erreur lors du rafraîchissement des crédits :", error);
      }

      setDateDeCredit("");
      setMontant("");
      setDescription("");
    } else {
      toast.error(res?.error || "Erreur");
    }
  };
  const handleSubmitDebit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Valeur de la référence saisie :", referance);
    const idCreditList = await getCreditByRef(referance);
    const idCredit = idCreditList?.[0];

    if (!idCredit || !idCredit.idCreditCollecteur) {
      toast.error("Référence de crédit introuvable. Veuillez vérifier la référence saisie.");
      return;
    }

    const creditCollecteurId = Number(idCredit.idCreditCollecteur);

    const formData = new FormData();
    formData.append('lieuDeCollection', lieuCollection);
    formData.append('dateDeDebit', dateDeDebit);
    formData.append('description', descriptionDebit);
    formData.append('creditCollecteur', String(creditCollecteurId));

    const produitRequests = produitsCollecter.map((produit) => ({
      id_produit_avec_detail: Number(produit.id_produit_avec_detail),
      quantite: Number(produit.quantite),
      unite: produit.unite,
      prix_unitaire: Number(produit.prix_unitaire),
      lieu_stock: produit.lieu_stock
    }));

    try {
      console.log("formData: ", formData);
      console.log("produitsRequests: ", produitRequests);
      const res = await createDebit(formData, produitRequests);
      console.log(res);
      if (res?.success) {
        try {
          toast.success('Debit ajouter !');
          const updateDebit = await getCreditByIdCollecteur(id_collecteur);
          setCredits(updateDebit);
        } catch (error) {
          console.error('Erreur lors du rafraichissement des débits', error);
        }
        setProduitsCollecter([]);
        setLieuCollection("");
        setReferance("");
        setDateDeDebit("");
        setDescriptionDebit("");
      } else {
        toast.error('Débit non creer!');
      }
    } catch (error) {
      console.error('Erreur lors de la création de débit', error);
      toast.error('Erreur lors de la création de débit');
    }

  }


  return (
    <div className="flex justify-center">
      <div className={`max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 ${selectedCredit && selectedCredit.debit_extract.length > 0 ? "blur-sm" : ""}`}>

        {/* Payment Information */}
        <div className={`bg-white p-8 rounded-lg shadow `}>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold">Information de {formType == 'credit' ? 'crédit' : 'débit'}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setFormType('credit')}
                className={`px-4 py-2 rounded-md text-sm ${formType === 'credit' ? 'bg-teal-100 text-gray' : 'bg-gray-200'
                  }`}
              >
                Credit
              </button>
              <button
                onClick={() => setFormType('debit')}
                className={`px-4 py-2 rounded-md text-sm ${formType === 'debit' ? 'bg-teal-100 text-gray' : 'bg-gray-200'
                  }`}
              >
                Debit
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={formType == 'credit' ? handleSubmit : handleSubmitDebit} className="space-y-2">

            <div>
              {formType === "credit" ? (
                <>
                  <label className="block text-sm font-medium mb-1">Nom de collecteur</label>
                  <select
                    className="w-full border rounded-md p-2"
                    value={id || ""}
                    disabled
                  >
                    {collecteur && (
                      <option value={id}>{collecteur.nom}</option>
                    )}
                  </select>
                </>
              ) : (
                <>
                  <label className="block text-sm font-medium mb-1">Lieu de collection</label>
                  <input
                    type="text"
                    value={lieuCollection}
                    onChange={(e) => setLieuCollection(e.target.value)}
                    className="w-full border rounded-md p-2"
                    placeholder="Ex: Antanimena"
                  />
                </>
              )}
            </div>


            <div>
              {formType == "credit" ? (<>
                <label className="block text-sm font-medium mb-1">Date de crédit</label>
                <input
                  type="date"
                  value={dateDeCredit}
                  onChange={(e) => setDateDeCredit(e.target.value)}
                  className="w-full border rounded-md p-2"
                />
              </>
              ) : (<>
                <label className="block text-sm font-medium mb-1">Date de débit</label>
                <input
                  type="date"
                  value={dateDeDebit}
                  onChange={(e) => setDateDeDebit(e.target.value)}

                  className="w-full border rounded-md p-2"
                />
              </>
              )}
            </div>

            {formType == "credit" ? <div>
              <label className="block text-sm font-medium mb-1">montant de crédit en ARIARY</label>
              <input
                type="number"
                className="w-full border rounded-md p-2"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
              />
            </div> : <div>
              <label className="block text-sm font-medium mb-1">Référance de crédit</label>
              <input
                type="text"
                value={referance}
                onChange={(e) => setReferance(e.target.value)}
                placeholder='CR-20250505-3585'
                className="w-full border rounded-md p-2"
              />
            </div>}
            {formType == "credit" ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    className="w-full border rounded-md p-2 h-20"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    className="w-full border rounded-md p-2 h-20"
                    rows={4}
                    value={descriptionDebit}
                    onChange={(e) => setDescriptionDebit(e.target.value)}
                  />
                </div>
              </>
            )}
            {formType == "debit" ? (
              <>
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-center mt-2">Ajouter des Produits</h4>
                  <div className="flex">
                    <select
                      id="id_produit_avec_detail"
                      name="id_produit_avec_detail"
                      value={produitId}
                      onChange={(e) => setProduitId(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="" disabled>Produits</option>
                      {produitFiltrer?.map((produit: any) => (
                        <option key={produit.id_produit_avec_detail} value={produit.id_produit_avec_detail}>
                          {produit.nom_detail}
                        </option>
                      ))}
                    </select>
                    <input
                      id="quantite"
                      name="quantite"
                      value={quantite}
                      onChange={(e) => setQuantite(e.target.value)}
                      placeholder="Quantité"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <select
                      id="unite"
                      name="unite"
                      value={unite}
                      onChange={(e) => setUnite(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="" disabled>Unité</option>
                      <option value="KG">KG</option>
                      <option value="T">T</option>
                    </select>
                    <input
                      id="prix_unitaire"
                      name="prix_unitaire"
                      value={prixUnitaire}
                      onChange={(e) => setPrixUnitaire(e.target.value)}
                      placeholder="Prix"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <select
                      id="lieu_stock"
                      name="lieu_stock"
                      value={lieuStock}
                      onChange={(e) => setLieuStock(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="" disabled>Lieu de stock</option>
                      <option value="ITAOSY">ITAOSY</option>
                      <option value="ANOSIZATO">ANOSIZATO</option>
                      <option value="AMPASIKA">AMPASIKA</option>
                      <option value="AMPANDRANA">AMPANDRANA</option>
                      <option value="AMBATONDRAZAKA">AMBATONDRAZAKA</option>
                      <option value="ALATSINAINIKELY">ALATSINAINIKELY</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddProduitsCollecter}
                    className="mt-4 p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Ajouter Produit
                  </button>

                  <div className="mt-4">
                    <h4 className="text-lg font-semibold text-center mb-2">Produits Ajoutés</h4>
                    {produitsCollecter.length > 0 ? (
                      // Ce conteneur gère le scroll
                      <div className="max-h-32 overflow-y-auto border border-gray-300 rounded">
                        <table className="w-full border-collapse">
                          <thead className="sticky top-0 bg-gray-100 z-10">
                            <tr>
                              <th className="p-2 border border-gray-300">Point de vente</th>
                              <th className="p-2 border border-gray-300">Produit</th>
                              <th className="p-2 border border-gray-300">Quantité</th>
                              <th className="p-2 border border-gray-300">Unité</th>
                              <th className="p-2 border border-gray-300">Prix</th>
                            </tr>
                          </thead>
                          <tbody>
                            {produitsCollecter.map((produit, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="p-2 border border-gray-300">{produit.lieu_stock}</td>
                                <td className="p-2 border border-gray-300">{getNomProduit(produit.id_produit_avec_detail)}</td>
                                <td className="p-2 border border-gray-300">{produit.quantite}</td>
                                <td className="p-2 border border-gray-300">{produit.unite}</td>
                                <td className="p-2 border border-gray-300">{produit.prix_unitaire}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-center text-gray-500">Aucun produit ajouté.</p>
                    )}
                  </div>

                </div>

              </>
            ) : null}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700"
            >
              Confirmer le {formType === 'credit' ? 'crédit' : 'debit'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl flex justify-center mb-6">Liste des crédits</h2>
          <input
            type="date"
            className="border rounded-md p-1"
          />
          <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
            {credits?.map((credit: any) => (
              <div key={credit.id_credit_collecteur} className="flex items-center justify-between" >
                <div className="flex items-center gap-4" onClick={() => setSelectedCredit(credit)}>

                  <Image className='rounded-full hover:cursor-pointer' src="/credit.png" alt='credit' width={60} height={60} />
                  <div>
                    <div className="font-semibold">Ref: {credit.referance_credit}</div>
                    <div className="text-sm text-gray-500">{credit.date_de_credit.split('T')[0]}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span>{credit.montant_credit} Ar</span>
                  {credit.status == true ? (
                    <>
                      <Effectuer id_collecteur={1} />
                      <p className='text-sm text-green-300'>R: {credit.reste}</p>
                    </>
                  ) : (
                    <>
                      <EnAttent id_collecteur={1} />
                      <p className='text-sm text-red-300'>R: {credit.reste}</p>
                    </>
                  )
                  }
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl flex justify-center mb-6">Liste des débits</h2>
          <input
            type="date"
            className="border rounded-md p-1 mb-1"
          />

          <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
            {credits.map((credit: any) =>
              Array.isArray(credit.debit_extract)
                ? credit.debit_extract.map((debit: any) => (
                  <div key={debit.id_debit_collecteur} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Image className='rounded-full' src="/debit.png" alt='credit' width={60} height={60} />
                      <div>
                        <div className="font-semibold">{debit.lieu_de_collection}</div>
                        <div className="text-sm text-gray-500">{debit.description}</div>
                      </div>
                    </div>
                    <div>
                      <div className="flex flex-col items-end">{debit.date_de_debit.split('T')[0]}</div>
                    </div>
                  </div>
                )) : null)}
          </div>
        </div>
      </div >
      {selectedCredit && selectedCredit.debit_extract.length > 0 && (
        <div className="mt-10 p-4 bg-white w-[60vw] h-[20vw] rounded-lg shadow border-gray-300 absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <button
            onClick={() => setSelectedCredit(null)} // ou ta fonction de fermeture
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold"
          >
            X
          </button>
          <h3 className="text-xl font-semibold mb-4 text-center text-gray-600">Débits associés (aperçu)</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {selectedCredit.debit_extract.map((debit: any) =>
            (
              <div key={`${debit.id_debit_collecteur}`} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Image className='rounded-full' src="/debit.png" alt='debit' width={50} height={50} />
                  <div>
                    <div className="font-semibold text-gray-700">{debit.lieu_de_collection}</div>
                    <div className="text-sm text-gray-500">{debit.description}</div>
                    {Array.isArray(debit.produits_collecter_extract)
                      ? debit.produits_collecter_extract.map((debits: any) => (
                        <div key={`${debits.id_produit_collecter}`} >
                          <hr className="border-t-4 border-green-300 w-[200px]" />
                          <div className="text-sm text-gray-500">Produit: {debits.nom_detail}</div>
                          <div className='flex gap-2'>
                            <div className="text-sm text-gray-500">Quantité: {debits.quantite}</div>
                            <div className="text-sm text-gray-500">{debits.unite}</div>
                          </div>
                          <div className="text-sm text-gray-500">Prix/KG: {debits.prix_unitaire}</div>
                        </div>
                      )) : null}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {debit.date_de_debit.split('T')[0]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div >
  );
}

