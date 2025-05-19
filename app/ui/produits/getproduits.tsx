'use server'
import axios from 'axios';
import { BASE_URL } from '../../lib/db';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { ZodError } from 'zod';

export async function getAllProduits() {
  try {
    const token = (await cookies()).get('token');
    console.log('Token récupéré :', token?.value); // Vérifiez le token récupéré

    if (!token) {
      console.warn('Token introuvable dans les cookies.');
      return null;
    }

    const produits = await axios.get(`${BASE_URL}/api/produits`, {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    });

    const res = produits.data;
    console.log("Données des transactions :", res);
    return res || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions:', error);
    throw error;
  }
}
export async function getAllProduitsWithDetail() {
  try {
    const token = (await cookies()).get('token');
    console.log('Token récupéré :', token?.value); // Vérifiez le token récupéré

    if (!token) {
      console.warn('Token introuvable dans les cookies.');
      return null;
    }

    const produits = await axios.get(`${BASE_URL}/api/detailproduits`, {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    });

    const res = produits.data;
    console.log("Données des transactions :", res);
    return res || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions:', error);
    throw error;
  }
}

export async function getIdAndName() {
  try {
    const token = (await cookies()).get('token');
    console.log('Token récupéré :', token?.value); // Vérifiez le token récupéré

    if (!token) {
      console.warn('Token introuvable dans les cookies.');
      return null;
    }

    const produits = await axios.get(`${BASE_URL}/api/produitavecdetails/idandname`, {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    });

    const res = produits.data;
    console.log("Données des transactions :", res);
    return res || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions:', error);
    throw error;
  }
}
const formSchema = z.object({
  produit: z.number().min(1, "Produit requis"),
  type_produit: z.number().nullable(),
  nom_detail: z.string().min(1, "Nom requis"),
  symbole: z.string().min(1, "Symbole requis"),
  categorie_produit: z.string().min(1, "Catégorie requise"),
  description: z.string().optional(),
  prix_d_achat: z.number().min(0, "Prix d'achat requis"),
  prix_de_vente: z.number().min(0, "Prix de vente requis"),
  unite: z.string().min(1, "Unité requise"),
});

export async function createProduit(formdata: FormData) {
  try {
    const produit = Number(formdata.get("produit"));
    const type_produit = formdata.get("type_produit") === "" ? null : Number(formdata.get("type_produit"));
    const prix_d_achat = Number(formdata.get("prix_d_achat"));
    const prix_de_vente = Number(formdata.get("prix_de_vente"));

    // Valider les données avec Zod
    const validatedData = formSchema.parse({
      produit,
      type_produit,
      nom_detail: formdata.get("nom_detail"),
      symbole: formdata.get("symbole"),
      categorie_produit: formdata.get("categorie_produit"),
      description: formdata.get("description"),
      prix_d_achat,
      prix_de_vente,
      unite: formdata.get("unite"),
    });

    const token = (await cookies()).get("token");

    if (!token || !token.value) {
      return { success: false, error: "Token introuvable ou invalide." };
    }

    // Structurer les données selon le format attendu par l'API
    const requestData = {
      produit: validatedData.produit,
      type_produit: validatedData.type_produit,
      detailProduitRequest: {
        nom_detail: validatedData.nom_detail,
        symbole: validatedData.symbole,
        categorie_produit: validatedData.categorie_produit,
        description: validatedData.description,
        prix_d_achat: validatedData.prix_d_achat,
        prix_de_vente: validatedData.prix_de_vente,
        unite: validatedData.unite,
      },
    };

    // Préparer FormData pour l'envoi
    const formDataToSend = new FormData();
    formDataToSend.append("produitAndDetail", JSON.stringify(requestData));

    console.log("Données de la requête:", requestData);

    // Envoyer la requête à l'API
    const response = await axios.post(`${BASE_URL}/api/produitavecdetails`, formDataToSend, {
      headers: {
        Authorization: `Bearer ${token.value}`,
        "Content-Type": "multipart/form-data",
      },
      timeout: 120000,
    });

    if (response.status === 201 || response.status === 200) {
      return { success: true, data: response.data };
    } else {
      console.error("Erreur inattendue lors de la création:", response);
      return {
        success: false,
        error: "Produit non créé",
      };
    }
  } catch (error: any) {
    if (error instanceof ZodError) {
      console.error("Validation échouée :", error.errors);
      return {
        success: false,
        error: "Formulaire invalide, veuillez vérifier le formulaire",
      };
    }

    console.error("Erreur lors de la création de l'utilisateur :", error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
}
export async function addProduit(nomTypeProduit: string) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    throw new Error("Token non trouvé");
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/api/produit/post`,
      {
        nom_produit: nomTypeProduit,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const res = response.data;
    console.log(res);
    return res;
  } catch (error) {
    console.error("Erreur lors de l'ajout du type de produit :", error);
    throw error;
  }
}
export async function addTypeProduit(nomTypeProduit: string, symbole: string) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    throw new Error("Token non trouvé");
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/api/produit/type/post`,
      {
        nom_type_produit: nomTypeProduit,
        symbole: symbole
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const res = response.data;
    console.log(res);
    return res;
  } catch (error) {
    console.error("Erreur lors de l'ajout du type de produit :", error);
    throw error;
  }
}
export async function getTypeProduit() {
  try {
    const token = (await cookies()).get('token');
    console.log('Token récupéré :', token?.value); // Vérifiez le token récupéré

    if (!token) {
      console.warn('Token introuvable dans les cookies.');
      return null;
    }

    const produits = await axios.get(`${BASE_URL}/api/produit/type`, {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    });

    const res = produits.data;
    console.log("Données des transactions :", res);
    return res || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions:', error);
    throw error;
  }
}
export async function getNameProduit() {
  try {
    const token = (await cookies()).get('token');
    console.log('Token récupéré :', token?.value); // Vérifiez le token récupéré

    if (!token) {
      console.warn('Token introuvable dans les cookies.');
      return null;
    }

    const produits = await axios.get(`${BASE_URL}/api/produits`, {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    });

    const res = produits.data;
    console.log("Données des transactions :", res);
    return res || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions:', error);
    throw error;
  }
}
