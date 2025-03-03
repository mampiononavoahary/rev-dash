'use client'
import { PlusIcon } from 'lucide-react';
import React, { useState } from 'react'
import { z } from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const pretSchema = z.object({
  date_de_pret: z.string().min(1, "Date requise"),
  quantite: z.number().positive("Doit être un nombre positif"),
  prix_unitaire: z.number().positive("Doit être un nombre positif"),
  taux_augmentation: z.number().min(0, "Ne peut pas être négatif"),
  taux_mensuel: z.number().min(0, "Ne peut pas être négatif"),
  date_de_remboursement: z.string().min(1, "Date requise"),
});

type PretFormValues = z.infer<typeof pretSchema>;

export default function AddPret() {
  const [showForm, setShowForm] = useState(false);
  const handleClick = () => {
    setShowForm(true);
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PretFormValues>({
    resolver: zodResolver(pretSchema),
  });

  const onSubmit = (data: PretFormValues) => {
    console.log("Données soumises :", data);
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
              className="max-w-lg mx-auto p-6 rounded-lg shadow-md space-y-4 bg-white"
            >
              <h2 className="text-xl font-bold text-gray-900">Nouveau Prêt Bancaire</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700">Date de prêt</label>
                <input
                  type="date"
                  {...register("date_de_pret")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                />
                {errors.date_de_pret && <p className="text-red-500 text-sm">{errors.date_de_pret.message}</p>}
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
                <label className="block text-sm font-medium text-gray-700">Prix unitaire</label>
                <input
                  type="number"
                  step="0.01"
                  {...register("prix_unitaire", { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                />
                {errors.prix_unitaire && <p className="text-red-500 text-sm">{errors.prix_unitaire.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Taux d'augmentation (%)</label>
                <input
                  type="number"
                  step="0.001"
                  {...register("taux_augmentation", { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                />
                {errors.taux_augmentation && <p className="text-red-500 text-sm">{errors.taux_augmentation.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Taux mensuel (%)</label>
                <input
                  type="number"
                  step="0.001"
                  {...register("taux_mensuel", { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                />
                {errors.taux_mensuel && <p className="text-red-500 text-sm">{errors.taux_mensuel.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Date de remboursement</label>
                <input
                  type="date"
                  {...register("date_de_remboursement")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                />
                {errors.date_de_remboursement && <p className="text-red-500 text-sm">{errors.date_de_remboursement.message}</p>}
              </div>
              <div className='flex justify-center gap-4'>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                >
                  Enregistrer
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

