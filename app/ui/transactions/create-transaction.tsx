'use client';
import React, { useEffect, useState } from 'react';
import { getAllClients } from '../customers/getClients';
import { getIdAndName } from '../produits/getproduits';
import { SubmitButton } from './submit_button';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { createDetailAndTransaction } from './gettransaction';

export default function CreateTransaction() {
  const [clients, setClients] = useState<any[]>([]);
  const [produits, setProduits] = useState<any[]>([]);
  const [produitsFilter, setProduitsFilter] = useState<any[]>([]);
  const [typeTransaction, setTypeTransaction] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [produitsAjoutes, setProduitsAjoutes] = useState<any[]>([]);
  const [produitId, setProduitId] = useState('');
  const [quantite, setQuantite] = useState('');
  const [unite, setUnite] = useState('');
  const [lieuStock, setLieuStock] = useState('');
  const [status, setStatus] = useState('');
  const [prixUnitaire, setPrixUnitaire] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedClients = await getAllClients();
        const fetchedProduits = await getIdAndName();
        setClients(fetchedClients);
        setProduits(fetchedProduits);
      } catch (error) {
        console.error('Erreur lors du chargement des données :', error);
        toast.error('Erreur lors du chargement des données.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    if (typeTransaction === "ENTRE") {
      setProduitsFilter(produits.filter((e) => e.categorie === "PRODUIT_PREMIER"));
      console.log(produitsFilter);
    } else if (typeTransaction === "SORTIE") {
      setProduitsFilter(produits.filter((e) => e.categorie === "PRODUIT_FINI"));
      console.log(produitsFilter);
    } else {
      setProduitsFilter(produits);
    }
  }, [typeTransaction, produits]);

  const getNomProduit = (id: string) => {
    const produit = produits.find((p) => p.id_produit_avec_detail === id);
    return produit ? produit.nom_detail : 'Produit inconnu';
  };

  const handleAddProduit = () => {
    if (!produitId || !quantite || !unite || !prixUnitaire || !lieuStock || !status) {
      toast.error('Tous les champs doivent être remplis.');
      return;
    }

    const newProduit = {
      id_produit_avec_detail: produitId,
      quantite,
      unite,
      status,
      lieu_stock: lieuStock,
      prix_unitaire: Number(prixUnitaire), // Convert to number
    };

    setProduitsAjoutes((prev) => [...prev, newProduit]);
    setProduitId('');
    setQuantite('');
    setUnite('');
    setStatus('');
    setLieuStock('');
    setPrixUnitaire('');
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create FormData for detailData
    const detailFormData = new FormData();
    detailFormData.append('type_de_transaction', (e.target as HTMLFormElement).type_de_transaction.value);
    detailFormData.append('lieu_de_transaction', (e.target as HTMLFormElement).lieu_de_transaction.value);
    detailFormData.append('id_client', (e.target as HTMLFormElement).id_client.value);

    // Create an array of transaction data
    const transactionRequests = produitsAjoutes.map((produit) => ({
      id_produit_avec_detail: produit.id_produit_avec_detail,
      quantite: produit.quantite,
      unite: produit.unite,
      prix_unitaire: produit.prix_unitaire,
      status: produit.status,
      lieu_stock: produit.lieu_stock,
    }));

    try {
      const result = await createDetailAndTransaction(detailFormData, transactionRequests);
      if (result?.success) {
        toast.success('Transaction créé avec succès');
        setProduitsAjoutes([]); // Réinitialiser la liste des produits ajoutés
      } else {
        toast.error('Erreur lors de la création de transaction');
      }
    } catch (error) {
      console.error('Erreur lors de la création de la transaction', error);
      toast.error('Erreur lors de la création de la transaction');
    }
  }; if (loading) {
    return (
      <div className="mx-auto">
        <div role="status">
          <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Créer une Transaction</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1 text-center p-2 bg-emerald-200 rounded-full">Type de transaction:</label>
            <select
              id="type_de_transaction"
              name="type_de_transaction"
              value={typeTransaction}
              onChange={(e) => setTypeTransaction(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md">
              <option value="" disabled>Type de transaction</option>
              <option value="SORTIE">VENTE</option>
              <option value="ENTRE">ACHAT</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1 text-center p-2 bg-emerald-200 rounded-full">Lieu de Transaction:</label>
            <select id="lieu_de_transaction" name="lieu_de_transaction" defaultValue="" className="w-full p-2 border border-gray-300 rounded-md">
              <option value="" disabled>Lieu de transaction</option>
              <option value="ITAOSY">ITAOSY</option>
              <option value="IMERINTSIATOSIKA">IMERINTSIATOSIKA</option>
              <option value="ALATSINAINIKELY">ALATSINAINIKELY</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block font-medium mb-1 text-center p-2 rounded-full bg-emerald-200">Nom Clients:</label>
          <select id="id_client" name="id_client" defaultValue="" className="w-full p-2 border border-gray-300 rounded-md">
            <option value="" disabled>Sélectionner un client</option>
            {clients.length > 0 ? (
              clients.map((client: any) => (
                <option key={client.id_clients} value={client.id_clients}>
                  {client.nom} {client.prenom}
                </option>
              ))
            ) : (
              <option disabled>Aucun client</option>
            )}
          </select>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4 text-center mt-2">Ajouter des Produits</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-2">
            <select
              id="id_produit_avec_detail"
              name="id_produit_avec_detail"
              value={produitId}
              onChange={(e) => setProduitId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled>Produits</option>
              {produitsFilter?.map((produit: any) => (
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
              id="status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled>Status</option> <option value="PAYE">PAYE</option> <option value="EN_ATTENTE">EN ATTENTE</option>
            </select>
            <select
              id="lieu_stock"
              name="lieu_stock"
              value={lieuStock}
              onChange={(e) => setLieuStock(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled>Lieu de stock</option>
              <option value="ITAOSY">ITAOSY</option>
              <option value="IMERINTSIATOSIKA">IMERINTSIATOSIKA</option>
            </select>
          </div>
          <button
            type="button"
            onClick={handleAddProduit}
            className="mt-4 p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Ajouter Produit
          </button>
          <div className="mt-4">
            <h4 className="text-lg font-semibold text-center mb-2">Produits Ajoutés</h4>
            {produitsAjoutes.length > 0 ? (
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border border-gray-300">Point de vente</th>
                    <th className="p-2 border border-gray-300">Produit</th>
                    <th className="p-2 border border-gray-300">Quantité</th>
                    <th className="p-2 border border-gray-300">Unité</th>
                    <th className="p-2 border border-gray-300">Prix</th>
                    <th className="p-2 border border-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {produitsAjoutes.map((produit, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-2 border border-gray-300">{produit.lieu_stock}</td>
                      <td className="p-2 border border-gray-300">{getNomProduit(produit.id_produit_avec_detail)}</td>
                      <td className="p-2 border border-gray-300">{produit.quantite}</td>
                      <td className="p-2 border border-gray-300">{produit.unite}</td>
                      <td className="p-2 border border-gray-300">{produit.prix_unitaire}</td>
                      <td className="p-2 border border-gray-300">{produit.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-500">Aucun produit ajouté.</p>
            )}
          </div>
        </div>
        <div className="flex flex-row justify-center gap-6">
          <SubmitButton
            className="mt-6 p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            type="submit"
          >
            Créer Transaction
          </SubmitButton>
          <Link href="/dashboard/transactions">
            <Button className="mt-6">Annuler</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
