'use client'
import { SubmitButton } from "@/app/ui/transactions/submit_button";
import { Button } from "@/components/ui/button";
import FileInputWithPreview from "@/app/ui/produits/image-input";
import { Input, Select } from "@mui/material";
import Link from "next/link";
import React from "react";
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

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      // Étape 1 : Créer un produit
      const produitResponse = await fetch("/api/produit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom_produit: values.nom_produit }),
      });

      const produit = await produitResponse.json();

      // Étape 2 : Créer les détails du produit
      const detailResponse = await fetch("/api/detail_produit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom_detail: values.nom_detail,
          symbole: values.symbole,
          description: values.description,
          prix_d_achat: values.prix_d_achat,
          prix_de_vente: values.prix_de_vente,
          unite: values.unite,
          image_url: values.image_url,
        }),
      });

      const detail = await detailResponse.json();

      // Étape 3 : Lier produit et détail
      await fetch("/api/produit_avec_detail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_produit: produit.id_produit,
          id_detail_produit: detail.id_detail_produit,
        }),
      });

      alert("Produit créé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la création du produit :", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Créer un nouveau produit
      </h2>
      <form>
        <div className="grid gap-4 grid-cols-2gap-x-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            <div className="w-full">
              <input
                id="nom_produit"
                name="nom_produit"
                list="type-de-produit-options"
                placeholder="Type de produit"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <datalist id="type-de-produit-options">
                <option value="Produit A" />
                <option value="Produit B" />
                <option value="Produit C" />
                <option value="Produit D" />
              </datalist>
            </div>
            <input
              id="nom_detail"
              name="nom_detail"
              placeholder="Nom détail"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              id="symbole"
              name="symbole"
              placeholder="Symbole"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              id="description"
              name="description"
              placeholder="Description"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              id="prix_d_achat"
              name="prix_d_achat"
              placeholder="Prix d'achat"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              id="prix_de_vente"
              name="prix_de_vente"
              placeholder="Prix de vente"
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
            <FileInputWithPreview/>
          </div>
        </div>
        <div className="flex flex-row justify-center gap-6 md-flex-col">
          <SubmitButton
            className="mt-6 p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            type="submit"
          >
            Créer Produit
          </SubmitButton>
          <Link href="/dashboard/produits">
            <Button className="mt-6">Annuler</Button>
          </Link>
        </div>
      </form>
    </div>
  );

};

export default CreateProduct;

