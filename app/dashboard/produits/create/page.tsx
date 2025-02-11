
'use client'
import React, { useState, ChangeEvent, FormEvent } from "react";
import { SubmitButton } from "@/app/ui/transactions/submit_button";
import { Button } from "@/components/ui/button";
import FileInputWithPreview from "@/app/ui/produits/image-input";
import Link from "next/link";
import { z } from "zod";

const CreateProduct = () => {
  const initialValues = {
    nom_produit: "",
    nom_detail: "",
    symbole: "",
    description: "",
    prix_d_achat: "",
    prix_de_vente: "",
    unite: "",
    image_url: "",
  };

  // Définition du schéma de validation avec zod
  const validationSchema = z.object({
    nom_produit: z.string().nonempty("Nom du produit requis"),
    nom_detail: z.string().nonempty("Nom du détail requis"),
    symbole: z.string().max(5, "Symbole trop long"),
    description: z.string(),
    prix_d_achat: z.number().min(0, "Prix d'achat invalide"),
    prix_de_vente: z.number().min(0, "Prix de vente invalide"),
    unite: z.string().nonempty("Unité requise"),
    image_url: z.string().url("URL d'image invalide"),
  });

  const [formData, setFormData] = useState(initialValues);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Étape 1 : Créer le produit
      const produitResponse = await fetch("/api/produit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom_produit: formData.nom_produit }),
      });
      const produit = await produitResponse.json();

      // Étape 2 : Créer les détails du produit
      const detailResponse = await fetch("/api/detail_produit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom_detail: formData.nom_detail,
          symbole: formData.symbole,
          description: formData.description,
          prix_d_achat: Number(formData.prix_d_achat),
          prix_de_vente: Number(formData.prix_de_vente),
          unite: formData.unite,
          image_url: formData.image_url,
        }),
      });
      const detail = await detailResponse.json();

      // Étape 3 : Lier le produit et ses détails
      await fetch("/api/produit_avec_detail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_produit: produit.id_produit,
          id_detail_produit: detail.id_detail_produit,
        }),
      });

      alert("Produit créé avec succès !");
      // Réinitialiser le formulaire si besoin
      setFormData(initialValues);
    } catch (error) {
      console.error("Erreur lors de la création du produit :", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Créer un nouveau produit
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Type de produit */}
          <div>
            <label htmlFor="nom_produit" className="block text-sm font-medium text-gray-700">
              Type de produit
            </label>
            <input
              id="nom_produit"
              name="nom_produit"
              list="type-de-produit-options"
              placeholder="Sélectionnez un type"
              value={formData.nom_produit}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <datalist id="type-de-produit-options">
              <option value="Produit A" />
              <option value="Produit B" />
              <option value="Produit C" />
              <option value="Produit D" />
            </datalist>
          </div>

          {/* Nom du détail */}
          <div>
            <label htmlFor="nom_detail" className="block text-sm font-medium text-gray-700">
              Nom détail
            </label>
            <input
              id="nom_detail"
              name="nom_detail"
              placeholder="Nom détail"
              value={formData.nom_detail}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Symbole */}
          <div>
            <label htmlFor="symbole" className="block text-sm font-medium text-gray-700">
              Symbole
            </label>
            <input
              id="symbole"
              name="symbole"
              placeholder="Symbole"
              value={formData.symbole}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              id="description"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Prix d'achat */}
          <div>
            <label htmlFor="prix_d_achat" className="block text-sm font-medium text-gray-700">
              Prix d'achat
            </label>
            <input
              id="prix_d_achat"
              name="prix_d_achat"
              placeholder="Prix d'achat"
              type="number"
              value={formData.prix_d_achat}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Prix de vente */}
          <div>
            <label htmlFor="prix_de_vente" className="block text-sm font-medium text-gray-700">
              Prix de vente
            </label>
            <input
              id="prix_de_vente"
              name="prix_de_vente"
              placeholder="Prix de vente"
              type="number"
              value={formData.prix_de_vente}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Unité */}
          <div>
            <label htmlFor="unite" className="block text-sm font-medium text-gray-700">
              Unité
            </label>
            <select
              id="unite"
              name="unite"
              value={formData.unite}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Sélectionnez une unité
              </option>
              <option value="KG">KG</option>
              <option value="T">T</option>
            </select>
          </div>

          {/* Image du produit */}
          <div>
            <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
              Image du produit
            </label>
            <FileInputWithPreview
              onChange={(url: string) =>
                setFormData((prev) => ({ ...prev, image_url: url }))
              }
            />
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-center gap-6 mt-6">
          <SubmitButton
            type="submit"
            className="p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Créer Produit
          </SubmitButton>
          <Link href="/dashboard/produits">
            <Button className="p-3">Annuler</Button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
