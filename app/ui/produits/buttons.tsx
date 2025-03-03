'use client'
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';
import { addTypeProduit } from './getproduits';
import { toast } from 'react-toastify';

export function CreateDetailProuit() {
  return (
    <Link
      href="/dashboard/produits/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Ajouter produit</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateProduct({ id }: { id: string }) {
  return (
    <Link
      href="/dashboard/product"
      className="rounded-md border p-2 hover:bg-yellow-200"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteProduct({ id }: { id: string }) {
  return (
    <>
      <button className="rounded-md border p-2 hover:bg-red-300">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </>
  );
}

export function AddType({ produits, setProduits }: { produits: any[]; setProduits: (produits: any[]) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [nomTypeProduit, setNomTypeProduit] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddType = () => {
    setShowForm(true); // Afficher le formulaire
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!nomTypeProduit.trim()) {
      toast.error("Le nom du type de produit ne peut pas être vide");
      setLoading(false);
      return;
    }

    try {
      const type = await addTypeProduit(nomTypeProduit); // Appeler la Server Action
      if (type) {
        toast.success('Type de produit creer avec succès');
      }
      console.log("Type de produit ajouté avec succès");

      const nouveauProduit = type; // Supposons que l'API retourne le nouveau produit
      console.log(nouveauProduit);
      setProduits([...produits, nouveauProduit]);

      setNomTypeProduit("");
      setShowForm(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout du type de produit :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleAddType}
        className="rounded-md border p-2 hover:bg-green-400"
      >
        <span className="sr-only">Ajouter</span>
        <PlusIcon className="w-5" />
      </button>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Ajouter un type de produit</h2>
            <div>
              <div className="mb-4">
                <label
                  htmlFor="nom_produit"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nom du type de produit
                </label>
                <input
                  type="text"
                  id="nom_produit"
                  value={nomTypeProduit}
                  onChange={(e) => setNomTypeProduit(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> // Spinner
                  ) : (
                    "Ajouter"
                  )}                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
