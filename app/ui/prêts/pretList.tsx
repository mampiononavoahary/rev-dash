'use client'
import React, { useEffect, useState } from 'react'
import AddPret from './addPrêt'
import { toast } from 'react-toastify';
import { GetAllPret } from './pret-api';

interface Pret {
  idPretBancaire: number,
  produit: string,
  date_de_pret: string,
  quantite: number,
  unite: string,
  prix: number,
  taux_augmentation: number,
  taux_mensuel: number,
  date_de_remboursement: string
}

export default function Pret() {
  const [pret, setPret] = useState<Pret[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const pret = await GetAllPret();
        setPret(pret);
      } catch {
        toast.error('Error lors de la récupération des données');
      }
    }
    fetchData();
  }, [])
  return (
    <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <AddPret />
      </div>
      <div className=" overflow-y-auto h-[200px] min-h-0">
        <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700 cursor-pointer">
          {pret?.map((pretBancaire, index) => (
            <li className="py-3 sm:py-4" key={index}>
              <div className="flex items-center justify-between">
                <div className="flex flex-col min-w-0 ms-4">
                  <p className="text-sm text-gray-900 truncate dark:text-white">
                    date de prêt: {new Date(pretBancaire.date_de_pret).toLocaleDateString("fr-FR")}
                  </p>
                  <p className="text-sm text-gray-900 truncate dark:text-white">
                    date de remboursement: {new Date(pretBancaire.date_de_remboursement).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                    Produit: {pretBancaire.produit}
                  </p>
                  <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                    prix par kilo de produit: {pretBancaire.prix} AR
                  </p>
                  <div className='flex gap-2'>
                    <p className="text-sm text-gray-500 truncate dark:text-white">
                      Quantité prêter: {pretBancaire.quantite}
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                      {pretBancaire.unite}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-center text-gray-500 dark:text-white mr-6">
                  <p>
                    Taux mensuel: {pretBancaire.taux_mensuel}%
                  </p>
                  <p>
                    Taux d'augementation: {pretBancaire.taux_augmentation}%
                  </p>
                </div>
              </div>
            </li>
          ))
          }
          <hr />
        </ul >
      </div >
    </div >
  )
}

