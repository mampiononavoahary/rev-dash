'use client'
import React, { useEffect, useState } from 'react';
import { getAllClients } from '../customers/getClients';
import {getIdAndName } from '../produits/getproduits';
import { postDetailTransaction,postDetailTransaction2 } from './gettransaction';
import { SubmitButton } from './submit_button';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CreateTransaction (){
  const [clients, setClients] = useState<any[]>([]);
  const [produits, setProduits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedClients = await getAllClients();
        const fetchedProduits = await getIdAndName();
        setClients(fetchedClients);
        setProduits(fetchedProduits);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Chargement des données...</p>;
  }
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Créer une Transaction
      </h2>
      <form className="space-y-4" action={postDetailTransaction}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1 text-center p-2 bg-green-200 rounded-full">
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
            <label className="block font-medium mb-1 text-center p-2 bg-green-200 rounded-full">
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
              <option value="AMBATONDRAZAKA">AMBATONDRAZAKA</option>
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
          <label className="block font-medium mb-1 text-center p-2 rounded-full bg-green-200">
            Nom Clients:
          </label>
          <select
            id="id_client"
            name="id_client"
            defaultValue=""
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Selectionneeer un client
            </option>
            {clients?.map((client: any) => {
              return (
                <option key={client.id_clients} value={client.id_clients}>
                  {client.nom}
                </option>
              );
            })}
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
      <form action={postDetailTransaction2}>
        <div className="grid gap-4 grid-cols-2gap-x-6">
          <h4 className="text-lg font-semibold mb-4 text-center mt-2">Ajouter des Produits</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <select
              id="id_produit_avec_detail"
              name="id_produit_avec_detail"
              defaultValue=""
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Produits
              </option>
              {produits?.map((produit: any) => {
                return (
                  <option
                    key={produit.id_produit_avec_detail}
                    value={produit.id_produit_avec_detail}
                  >
                    {produit.nom_detail}
                  </option>
                );
              })}
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
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Unité
              </option>
              <option value="KG">KG</option>
              <option value="T">T</option>
              <option value="AR">AR</option>
            </select>
            <select
              id="status"
              name="status"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Statut
              </option>
              <option value="PAYE">PAYE</option>
              <option value="EN_ATTENTE">EN ATTENTE</option>
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
              <Button className="mt-6">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
};

