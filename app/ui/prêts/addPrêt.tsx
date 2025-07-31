'use client'
import { PlusIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { z } from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getNameProduit, getTypeProduit } from '../produits/getproduits';
import { savePret } from './pret-api';
import { loadEnvFile } from 'process';
import { toast } from 'react-toastify';

const pretSchema = z.object({
  dateDePret: z.string().min(1, "Date requise"),
  produit: z.coerce.number().positive("Doit être un nombre positif"),
  quantite: z.coerce.number().positive("Doit être un nombre positif"),
  unite: z.string().min(1, "Unité requise"),
  prixUnitaire: z.coerce.number().positive("Doit être un nombre positif"),
  tauxAugmentation: z.coerce.number().min(0, "Ne peut pas être négatif"),
  tauxMensuel: z.coerce.number().min(0, "Ne peut pas être négatif"),
  dateDeRemboursement: z.string().min(1, "Date requise"),
});

type PretFormValues = z.infer<typeof pretSchema>;

export default function AddPret() {
  const [showForm, setShowForm] = useState(false);
  const [typeProduit, setTypeProduit] = useState<any[]>([]);
  const [loading,setLoading] = useState(false);
  const handleClick = () => {
    setShowForm(true);
  }
  useEffect(() => {
    const fetchTypeProuit = async () => {
      const typeProduit = await getNameProduit();
      setTypeProduit(typeProduit);
    }
    fetchTypeProuit();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PretFormValues>({
    resolver: zodResolver(pretSchema),
  });


  const onSubmit = async (data: PretFormValues) => {
    console.log("Données soumises :", data);
    setLoading(true);
    const response = await savePret(data); // Envoie l'objet JSON directement

    if (response.success) {
      toast.success("Prêt bancaire creer avec succes.");
      setLoading(false);
      setShowForm(false); // Ferme le formulaire après succès
    } else {
      toast.error("Error lors de la création de prêt bancaire");
    }
  };
  return (
    <>
      <button
        onClick={handleClick}
        className="rounded-md border p-2 hover:bg-green-400"
      >
        <span className="sr-only">Ajouter</span>
        <PlusIcon className="w-5" />
      </button>
      {
        showForm && (
          <div className='fixed inset-0 bg-black bg-opacity-50 p-6'>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="max-w-lg mx-auto max-h-[800px] overflow-y-auto p-6 rounded-lg shadow-md space-y-auto bg-white"
            >
              <h2 className="text-xl font-bold text-gray-900">Nouveau Prêt Bancaire</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700">Date de prêt</label>
                <input
                  type="date"
                  {...register("dateDePret")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                />
                {errors.dateDePret && <p className="text-red-500 text-sm">{errors.dateDePret.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Produit</label>
                <select
                  {...register("produit")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-white">
                  <option disabled>Selectionner un produit</option>
                  {typeProduit?.map((produit, index) => (
                    <option key={index} value={produit.id_produit}>{produit.nom_produit}</option>
                  ))}
                </select>
                {errors.produit && <p className="text-red-500 text-sm">{errors.produit.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Quantité</label>
                <input
                  type="number"
                  step="0.01"
                  {...register("quantite", { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                />
                {errors.quantite && <p className="text-red-500 text-sm">{errors.quantite.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Unité</label>
                <select
                  {...register("unite")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-white"
                >
                  <option disabled>Sélectionnez une unité</option>
                  <option value="KG">KG</option>
                  <option value="T">T</option>
                </select>
                {errors.unite && <p className="text-red-500 text-sm">{errors.unite.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Prix/KG</label>
                <input
                  type="number"
                  step="0.01"
                  {...register("prixUnitaire", { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                />
                {errors.prixUnitaire && <p className="text-red-500 text-sm">{errors.prixUnitaire.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Taux d'augmentation (%)</label>
                <input
                  type="number"
                  step="0.001"
                  {...register("tauxAugmentation", { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                />
                {errors.tauxAugmentation && <p className="text-red-500 text-sm">{errors.tauxAugmentation.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Taux mensuel (%)</label>
                <input
                  type="number"
                  step="0.001"
                  {...register("tauxMensuel", { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                />
                {errors.tauxMensuel && <p className="text-red-500 text-sm">{errors.tauxMensuel.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Date de remboursement</label>
                <input
                  type="date"
                  {...register("dateDeRemboursement")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                />
                {errors.dateDeRemboursement && <p className="text-red-500 text-sm">{errors.dateDeRemboursement.message}</p>}
              </div>
              <div className='flex justify-center gap-4'>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                  disabled={loading}
                >
                {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>// Spinner
                  :(
                  "Enregistrer"
                  )
                }
                </button>
                <button
                  type="submit"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-md"
                >
                  Annuler
                </button>
              </div>

            </form>
          </div>
        )
      }

    </>
  );
}

