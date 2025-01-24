'use client';
import React, { useEffect, useState } from 'react';
import { getAllClients } from '../customers/getClients';
import { getIdAndName } from '../produits/getproduits';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SubmitButton } from './submit_button';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { getLastDetailTransaction, postDetailTransaction, postDetailTransaction2 } from './gettransaction';
import { Import } from 'lucide-react';
import { CheckboxWithText } from './buttons';

// Composant CircularProgressWithLabel
const CircularProgressWithLabel = ({ value }: { value: number }) => (
  <Box position="relative" display="inline-flex">
    <CircularProgress variant="determinate" value={value} />
    <Box
      top={0}
      left={0}
      bottom={0}
      right={0}
      position="absolute"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Typography variant="caption" component="div" color="text.secondary">
        {`${Math.round(value)}%`}
      </Typography>
    </Box>
  </Box>
);

export default function CreateTransaction() {
  const [clients, setClients] = useState<any[]>([]);
  const [produits, setProduits] = useState<any[]>([]);
  const [detailTransaction, setDetailTransaction] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simule la progression pendant le chargement
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 10));
    }, 800);

    const fetchData = async () => {
      try {
        const fetchedClients = await getAllClients();
        const fetchedProduits = await getIdAndName();
        const fetchDetailTransaction = await getLastDetailTransaction();
        setClients(Array.isArray(fetchedClients) ? fetchedClients : []);
        setProduits(Array.isArray(fetchedProduits) ? fetchedProduits : []);
        setDetailTransaction(Array.isArray(fetchDetailTransaction) ? fetchDetailTransaction : []);
        console.log({ fetchedClients, fetchedProduits, fetchDetailTransaction });
      } catch (error) {
        console.error('Erreur lors du chargement des données :', error);
        toast.error('Erreur lors du chargement des données.');
      } finally {
        setLoading(false);
        clearInterval(interval); // Arrête la progression une fois les données chargées
      }
    };

    fetchData();

    return () => clearInterval(interval); // Nettoie l'intervalle si le composant est démonté
  }, []);

  if (loading) {
    return (
      <div className="mx-auto">
        <CircularProgressWithLabel value={progress} />
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Créer une Transaction
      </h2>
      <form className="space-y-4" action={async (formData) => {
        const result = await postDetailTransaction(formData);
        if (result?.success) {
          toast.success('Détail transactions creer avec succes');
          setTimeout(() => {
            window.location.reload(); // Redirection vers la page de connexion
          }, 2000);

        } else {
          toast.error('Erreur lors de la creation de détail transaction');
        }
      }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1 text-center p-2 bg-emerald-200 rounded-full">
              Type de transactions:
            </label>
            <select
              id="type_de_transaction"
              name="type_de_transaction"
              defaultValue=""
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                type de transaction
              </option>
              <option value="SORTIE">VENTE</option>
              <option value="ENTRE">ACHAT</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1 text-center p-2 bg-emerald-200 rounded-full">
              Lieu de Transaction:
            </label>
            <select
              id="lieu_de_transaction"
              name="lieu_de_transaction"
              defaultValue=""
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Lieu de transaction
              </option>
              <option value="ITAOSY">ITAOSY</option>
              <option value="ALATSINAINIKELY">ALATSINAINIKELY</option>
              <option value="AMPASIKA">AMPASIKA</option>
              <option value="AMBATONDRAZAKA">AMBATONDRAZAKA</option>
              <option value="ANOSIZATO">ANOSIZATO</option>
            </select>
          </div>
          {/*<div>
            <label className="block font-medium mb-1">
              Date de Transaction:
            </label>
            <input
              type="datetime-local"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>*/}
        </div>
        <div>
          <label className="block font-medium mb-1 text-center p-2 rounded-full bg-emerald-200">
            Nom Clients:
          </label>
          <select
            id="id_client"
            name="id_client"
            defaultValue=""
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Selectionner un client
            </option>
            {clients.length > 0 ? (
              clients.map((client: any, index: number) => (
                <option key={client.id_clients || index} value={client.id_clients}>
                  {client.nom} {client.prenom}
                </option>
              ))
            ) : (
              <option disabled>Aucun clients</option>
            )}
          </select>
        </div>
        <div className="flex justify-center">
          <SubmitButton
            type="submit"
            className="mt-6 w-200 p-3 bg-yellow-500 text-gray-500 rounded-md hover:bg-yellow-400 "
          >
            Créer Détail Transaction
          </SubmitButton>
        </div>
      </form>
      <form action={async (formData) => {
        const result = await postDetailTransaction2(formData);
        if (result?.success) {
          toast.success('Transaction créée avec succès');
        } else {
          if (result?.error === 'Quantité insuffisante en stock.') {
            toast.error('La quantité demandée dépasse le stock disponible.');
          } else if (result?.error === 'Le lieu de stock spécifié est introuvable.') {
            toast.error('Le lieu de stock n\'existe pas.');
          } else {
            toast.error(result?.error || 'Erreur lors de la création de la transaction');
          }
        }
      }}>
        <div className="grid gap-4 grid-cols-2gap-x-6">
          <h4 className="text-lg font-semibold mb-4 text-center mt-2">Ajouter des Produits</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <select
              id="id_detail_transaction"
              name="id_detail_transaction"
              defaultValue=""
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Clients
              </option>

              {detailTransaction?.map((detail: any, index: number) => (
                <option key={detail.id_detail_transaction || index} value={detail.id_detail_transaction}>
                  {detail.nom} {detail.prenom}
                </option>
              )) || <option disabled>No transaction details available</option>}

            </select>
            <select
              id="id_produit_avec_detail"
              name="id_produit_avec_detail"
              defaultValue=""
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Produits
              </option>

              {produits?.map((produit: any, index: number) => (
                <option key={produit.id_produit_avec_detail || index} value={produit.id_produit_avec_detail}>
                  {produit.nom_detail}
                </option>
              )) || <option disabled>No products available</option>}

            </select>
            <input
              id="quantite"
              name="quantite"
              placeholder="Quantité"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              id="unite"
              name="unite"
              defaultValue=""
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Unité
              </option>
              <option value="KG">KG</option>
              <option value="T">T</option>
            </select>
            <input
              id="prix_unitaire"
              name="prix_unitaire"
              placeholder="Prix"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              id="status"
              name="status"
              defaultValue=""
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Status
              </option>
              <option value="PAYE">PAYE</option>
              <option value="EN_ATTENTE">EN ATTENTE</option>
            </select>
            <select
              id="lieu_stock"
              name="lieu_stock"
              defaultValue=""
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Lieu de stock
              </option>
              <option value="ITAOSY">ITAOSY</option>
              <option value="ANOSIZATO">ANOSIZATO</option>
              <option value="AMPASIKA">AMPASIKA</option>
              <option value="AMPANDRANA">AMPANDRANA</option>
              <option value="AMBATONDRAZAKA">AMBATONDRAZAKA</option>
              <option value="ALATSINAINIKELY">ALATSINAINIKELY</option>
            </select>
          </div>
        </div>
        <div className="flex flex-row justify-center gap-6 md-flex-col">
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
};

