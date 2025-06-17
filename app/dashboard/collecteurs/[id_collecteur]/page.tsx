'use client'
import React, { use, useEffect, useState } from 'react';
import { createDebit, getCollecteursById, getCreditByIdCollecteur, getCreditByRef, getLastCredit } from '@/app/ui/collecteurs/collecteur-api';
import { createCredit } from '@/app/ui/collecteurs/collecteur-api'; // ← ajuste ce chemin si besoin
import { toast } from 'react-toastify';
import Image from 'next/image';
import { DeleteProduitCollecter, Effectuer, EnAttent, UpdateProduitCollecter } from '@/app/ui/collecteurs/buttons';
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
  const [depense, setDepense] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [descriptionDebit, setDescriptionDebit] = useState<string>("");
  const [lieuCollection, setLieuCollection] = useState<string>("");
  const [produitsCollecter, setProduitsCollecter] = useState<any[]>([]);
  const [produitFiltrer, setProduitFiltrer] = useState<any[]>([]);

  const [produitId, setProduitId] = useState('');
  const [quantite, setQuantite] = useState('');
  const [unite, setUnite] = useState('');
  const [lieuStock, setLieuStock] = useState('');
  const [prixUnitaire, setPrixUnitaire] = useState('');
  const [produits, setProduits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);


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




  const handleUpdateListAfterUpdate = (updatedItem: {
    id_produit_collecter: number;
    quantite: number;
    unite: string;
    prix_unitaire: number;
  }) => {
    setCredits((prevCredits) => {
      const updatedCredits = prevCredits.map((credit) => ({
        ...credit,
        debit_extract: credit.debit_extract?.map((debit: any) => ({
          ...debit,
          produits_collecter_extract: debit.produits_collecter_extract?.map((prod: any) =>
            prod.id_produit_collecter === updatedItem.id_produit_collecter
              ? { ...prod, ...updatedItem }
              : prod
          ),
        })),
      }));

      const found = updatedCredits.find(
        (credit) =>
          credit.id_credit_collecteur === selectedCredit?.id_credit_collecteur
      );

      if (found) {
        setSelectedCredit(found);
      }

      return updatedCredits;
    });
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
    setLoading(true);

    const formData = new FormData();
    formData.append('collecteur', String(id || ''));
    formData.append('dateDeCredit', dateDeCredit);
    formData.append('montant', montant);
    formData.append('description', description);

    try {
      const res = await createCredit(formData);

      if (res?.success) {
        toast.success("Crédit ajouté !");
        const updatedCredits = await getCreditByIdCollecteur(id_collecteur);
        setCredits(updatedCredits);

        setDateDeCredit("");
        setMontant("");
        setDescription("");
      } else {
        toast.error(res?.error || "Erreur lors de l'ajout du crédit.");
      }
    } catch (error) {
      console.error("Erreur lors de la création du crédit :", error);
      toast.error("Erreur inattendue lors de la création du crédit.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateListAfterDelete = async () => {
    try {
      const debits = await getCreditByIdCollecteur(id_collecteur);
      setCredits(debits);
    } catch (error) {
      console.error("Erreur lors de la création du crédit :", error);
    }
  }


  const handleSubmitDebit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {

      const idCredit = await getLastCredit(id);

      console.log("Credit recuperéé:  ", idCredit);

      if (!idCredit || !idCredit.idCreditCollecteur) {
        toast.error("Collecteur non trouvé ou aucun crédit disponible");
        return;
      }


      const creditCollecteurId = Number(idCredit.idCreditCollecteur);

      const formData = new FormData();
      formData.append('lieuDeCollection', lieuCollection);
      formData.append('dateDeDebit', dateDeDebit);
      formData.append('description', descriptionDebit);
      formData.append('depense', depense);
      formData.append('creditCollecteur', String(creditCollecteurId));

      const produitRequests = produitsCollecter.map((produit) => ({
        id_produit_avec_detail: Number(produit.id_produit_avec_detail),
        quantite: Number(produit.quantite),
        unite: produit.unite,
        prix_unitaire: Number(produit.prix_unitaire),
        lieu_stock: produit.lieu_stock
      }));

      console.log("formData: ", formData);
      console.log("produitRequests: ", produitRequests);

      const res = await createDebit(formData, produitRequests);

      if (res?.success) {
        toast.success('Débit ajouté !');
        const updateDebit = await getCreditByIdCollecteur(id_collecteur);
        setCredits(updateDebit);

        setProduitsCollecter([]);
        setLieuCollection("");
        setDepense("");
        setDateDeDebit("");
        setDescriptionDebit("");
      } else {
        toast.error(res?.error || 'Échec lors de la création du débit.');
      }
    } catch (error) {
      console.error('Erreur lors de la création du débit :', error);
      toast.error('Erreur inattendue lors de la création du débit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-center">
        <div className={`max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 ${selectedCredit && selectedCredit.debit_extract.length > 0 ? "blur-sm" : ""}`}>

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
                      name='lieuCollection'
                      id='lieuCollection'
                      autoComplete='on'
                      type="text"
                      value={lieuCollection}
                      onChange={(e) => setLieuCollection(e.target.value)}
                      className="w-full border rounded-md p-2"
                      placeholder="Lieu de collection"
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
                {montant && !isNaN(Number(montant)) && (
                  <p className="text-sm text-gray-600 mt-1">
                    {Number(montant).toLocaleString('fr-FR')} Ar
                  </p>
                )}
              </div> : null}
              {formType == "debit" ? (
                <div>
                  <label className="block text-sm font-medium mb-1">Depense</label>
                  <input
                    type="number"
                    className="w-full border rounded-md p-2"
                    value={depense}
                    onChange={(e) => setDepense(e.target.value)}
                  />
                </div>
              ) : null}
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
                        <option value="ANOSIZATO">IMERINTSIATOSIKA</option>
                        <option value="AMPASIKA">ALATSINAINIKELY</option>
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
                className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 flex items-center justify-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white "></div>
                ) : (
                  <>Confirmer le {formType === 'credit' ? 'crédit' : 'débit'}</>
                )}
              </button>
            </form>
          </div>

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
                      <div className="font-semibold">Montant: {credit.montant_credit} Ar</div>
                      <div className="text-sm text-gray-500">{credit.date_de_credit.split('T')[0]}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span>M+R: {credit.montant_credit + credit.recentreste} Ar</span>
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
              onClick={() => setSelectedCredit(null)}
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
                          <div key={`${debits.id_produit_collecter}`} className='flex'>
                            <div>
                              <hr className="border-t-4 border-green-300 w-[200px]" />
                              <div className="text-sm text-gray-500">Produit: {debits.nom_detail}</div>
                              <div className='flex gap-2'>
                                <div className="text-sm text-gray-500">Quantité: {debits.quantite}</div>
                                <div className="text-sm text-gray-500">{debits.unite}</div>
                              </div>
                              <div className="text-sm text-gray-500">Prix/KG: {debits.prix_unitaire}</div>
                            </div>
                            <div className='flex gap-4'>
                              <UpdateProduitCollecter
                                id_produit_collecter={debits.id_produit_collecter}
                                initialQuantite={debits.quantite}
                                initialUnite={debits.unite}
                                initialPrix={debits.prix_unitaire}
                                updateList={handleUpdateListAfterUpdate}
                              />
                              <DeleteProduitCollecter
                                id_produit_collecter={debits.id_produit_collecter}
                                onDelete={handleUpdateListAfterDelete} />
                            </div>
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
      <div>
        <h1 className="mt-6 flex justify-center font-bold">
          Liste des crédits avec leurs débits
        </h1>
        <div className="rounded-lg bg-teal-100 p-2 md:pt-0">
          <div className="custom-lg:block custom-sm:block hidden space-y-4">
            {credits?.map((credit: any, index: number) => (
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
              <th scope="col" rowSpan={2} className="px-4 py-5">Réf crédit</th>
              <th scope="col" rowSpan={2} className="px-3 py-5">Date crédit</th>
              <th scope="col" rowSpan={2} className="px-3 py-5">Montant</th>
              <th scope="col" rowSpan={2} className="px-4 py-5">Débits</th>
              <th scope="col" rowSpan={2} className="px-3 py-5">Total débit</th>
              <th scope="col" rowSpan={2} className="px-3 py-5">Reste</th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {credits?.map((credit: any, index: number) => (
              <tr key={credit.id_credit_collecteur || index}>
                <td className="whitespace-nowrap px-3 py-3">{credit.referance_credit}</td>

                <td className="whitespace-nowrap px-3 py-3">
                  {credit.date_de_credit?.split('T')[0]}
                </td>

                <td className="whitespace-nowrap px-3 py-3">
                  <p>
                    M: {credit.montant_credit}
                  </p>
                  <p>
                    M+R: {credit.montant_credit + credit.recentreste}
                  </p>
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

