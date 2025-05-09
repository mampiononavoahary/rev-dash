"use client";
import React, { useState, useEffect } from "react";
import { SubmitButton } from "@/app/ui/transactions/submit_button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { createProduit, getAllProduits, getIdAndName, getTypeProduit } from "./getproduits";
import { AddProduit, AddType } from "./buttons";

interface DecodedToken {
  role: string;
}

interface ProduitFormData {
  produit: number;
  type_produit: number | null,
  nom_detail: string;
  symbole: string;
  categorie_produit: string;
  description: string;
  prix_d_achat: number;
  prix_de_vente: number;
  unite: string;
  image_url: string;
}

export default function CreateProduct() {
  const [roleUser, setRoleUser] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [produits, setProduits] = useState<any[]>([]);
  const [typeProduit, setTypeProduit] = useState<any[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProduitFormData>({
    produit: 1,
    type_produit: null,
    nom_detail: "",
    symbole: "",
    categorie_produit: "PRODUIT_PREMIER",
    description: "",
    prix_d_achat: 1500,
    prix_de_vente: 1700,
    unite: "KG",
    image_url: "",
  });

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setRoleUser(decoded.role);

        if (decoded.role !== "ADMIN") {
          toast.error("Accès refusé : vous n'êtes pas administrateur");
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Erreur de décodage du token :", error);
        router.push("/dashboard");
      }
    } else {
      router.push("/dashboard");
    }
  }, [router]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchProduits = await getAllProduits();
        const fetchTypeProduit = await getTypeProduit();
        if (Array.isArray(fetchProduits) && Array.isArray(fetchTypeProduit)) {
          setProduits(fetchProduits);
          setTypeProduit(fetchTypeProduit);
        } else {
          console.error("Les données produits et type de produit ne sont pas un tableau");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
      }
    };
    fetchData();
  }, []);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? null : name === "type_produit" ? (value === "null" ? null : Number(value)) : value,
    }));
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error("Veuillez sélectionner une image");
      return;
    }

    const formDataToSend = new FormData();

    // Convertir les valeurs avant de les ajouter à FormData
    const dataToSend = {
      ...formData,
      // Si type_produit est null, on ne l'ajoute pas à la requête
      type_produit: formData.type_produit === null ? undefined : Number(formData.type_produit),
    };

    // Ajouter les champs convertis à FormData
    Object.entries(dataToSend).forEach(([key, value]) => {
      if (key !== "image_url" && value !== null && value !== undefined) {
        formDataToSend.append(key, value.toString());
      }
    });

    // Ajouter le fichier image
    formDataToSend.append("image_url", imageFile);

    try {
      const result = await createProduit(formDataToSend);
      if (result.success) {
        toast.success("Produit créé avec succès");
        router.push("/dashboard/produits");
      } else {
        toast.error("Erreur lors de la création du produit");
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
      console.error(error);
    }
  };

  return roleUser === "ADMIN" ? (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Créer un nouveau produit</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Type de produit */}

          <div>
            <label htmlFor="produit" className="block text-sm font-medium text-gray-700">
              Produit :
            </label>
            <div className="flex gap-2">
              <select
                id="produit"
                name="produit"
                value={formData.produit}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="" disabled>Sélectionner un produit</option>

                {Array.isArray(produits) && produits.length > 0 ? (
                  produits
                    .filter((produit) => produit !== undefined && produit !== null)
                    .map((produit) => (
                      <option key={produit.id_produit} value={produit.id_produit}>
                        {produit.nom_produit}
                      </option>
                    ))
                ) : (
                  <option disabled>Aucun produit disponible</option>
                )}
              </select>
              <AddProduit produits={produits} setProduits={setProduits} />
            </div>
          </div>
          <div>
            <label htmlFor="type_produit" className="block text-sm font-medium text-gray-700">
              Type de produit:
            </label>
            <div className="flex gap-2">
              <select
                id="type_produit"
                name="type_produit"
                value={formData.type_produit === null ? "null" : formData.type_produit}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="null">Null</option> {/* Option pour null */}
                {Array.isArray(typeProduit) && typeProduit.length > 0 ? (
                  typeProduit
                    .filter((typeProduit) => typeProduit !== undefined && typeProduit !== null) // Filtrer les valeurs null/undefined
                    .map((typeProduit) => (
                      <option key={typeProduit.id_type_produit} value={typeProduit.id_type_produit}>
                        {typeProduit.nom_type_produit}
                      </option>
                    ))
                ) : (
                  <option disabled>Aucun produit disponible</option>
                )}
              </select>
              <AddType typeProduits={typeProduit} setTypeProduits={setTypeProduit} />
            </div>
          </div>          {/* Nom du détail */}
          <div>
            <label htmlFor="nom_detail" className="block text-sm font-medium text-gray-700">
              Nom détail
            </label>
            <input
              id="nom_detail"
              name="nom_detail"
              placeholder="Nom détail"
              value={formData.nom_detail || ""}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
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
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Catégorie */}
          <div>
            <label htmlFor="categorie_produit" className="block text-sm font-medium text-gray-700">
              Catégorie
            </label>
            <select
              id="categorie_produit"
              name="categorie_produit"
              value={formData.categorie_produit}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="PRODUIT_PREMIER">PRODUIT PREMIER</option>
              <option value="PRODUIT_FINI">PRODUIT FINI</option>
            </select>
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
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
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
              type="number"
              value={formData.prix_d_achat}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
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
              type="number"
              value={formData.prix_de_vente}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
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
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="KG">KG</option>
              <option value="T">T</option>
            </select>
          </div>

          {/* Image du produit */}
          <div className="flex items-center space-x-4">
            <input
              type="file"
              name="image_url"
              id="image_url"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-10 h-10 object-cover rounded-full border border-gray-300"
              />
            )}
          </div>
        </div>

        <div className="flex justify-center gap-6 mt-6">
          <SubmitButton type="submit">Créer Produit</SubmitButton>
          <Link href="/dashboard/produits">
            <Button>Annuler</Button>
          </Link>
        </div>
      </form>
    </div>
  ) : null;
}
