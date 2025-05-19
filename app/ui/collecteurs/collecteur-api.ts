"use server"

import { BASE_URL } from "@/app/lib/db";
import axios from "axios";
import { cookies } from "next/headers"
import { z, ZodError } from "zod";

export async function getAllCollecteurs() {
  try {
    const token = (await cookies()).get('token');
    if (!token || !token.value) {
      console.warn('Token introuvable ou invalide.');
      return [];
    }

    const response = await axios.get(`${BASE_URL}/api/collecteurs`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    console.log('Données des Collecteurs récupérées :', response.data);
    return response.data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des collecteurs :', error);
    return [];
  }
}
export async function getCollecteursById(id_collecteur: number) {
  try {
    const token = (await cookies()).get('token');
    if (!token) {
      console.warn('token introuvable dans les cookies');
      return null;
    }
    const collecteur = await axios.get(`${BASE_URL}/api/collecteurs/${id_collecteur}`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      }
    })
    console.log("collecteur récupérées: ", collecteur.data)
    return collecteur.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de collecteur:', error);
    return [];
  }
}

export async function getCreditByIdCollecteur(id_collecteur: number) {
  try {
    const token = (await cookies()).get('token');
    if (!token) {
      console.warn('token introuvable dans les cookies');
      return null;
    }
    const credits = await axios.get(`${BASE_URL}/api/credits/debits/collecteur/${id_collecteur}`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      }
    })
    console.log("crédits récupérées: ", credits.data)
    return credits.data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des credits:', error);
    return [];
  }
}
export async function getCreditWithDebits() {
  try {
    const token = (await cookies()).get('token');
    if (!token) {
      console.warn('token introuvable dans les cookies');
      return null;
    }
    const credits = await axios.get(`${BASE_URL}/api/credits/debits/collecteur`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      }
    })
    console.log("crédits récupérées: ", credits.data)
    return credits.data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des credits:', error);
    return [];
  }
}

const formSchema = z.object({
  id_collecteur: z.number(),
  dateDeCredit: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)"),
  montant: z.number(),
  description: z.string()
});

export async function createCredit(formdata: FormData) {
  try {
    // Extraction et formatage
    const rawData = {
      id_collecteur: Number(formdata.get('collecteur')),
      dateDeCredit: String(formdata.get('dateDeCredit')), // format: 'YYYY-MM-DD'
      montant: Number(formdata.get('montant')),
      description: String(formdata.get('description')),
    };

    const parsed = formSchema.parse(rawData);

    const creditRequest = JSON.stringify({
      dateDeCredit: parsed.dateDeCredit + "T00:00:00", // Convertir en LocalDateTime ISO
      description: parsed.description,
      montant: parsed.montant,
      status: false,
      id_collecteur: {
        idCollecteur: parsed.id_collecteur,
      }
    });

    const token = (await cookies()).get("token");
    if (!token) {
      console.warn("token introuvable dans les cookies");
      return null;
    }

    const credit = await axios.post(`${BASE_URL}/api/collecteur/credit/savewithreste`, creditRequest, {
      headers: {
        Authorization: `Bearer ${token.value}`,
        "Content-Type": "application/json",
      },
      timeout: 120000,
    });

    console.log(creditRequest)
    if (credit.status === 201 || credit.status === 200) {
      return { success: true, data: credit.data };
    } else {
      console.error("Erreur inattendue lors de la création:", credit);
      return { success: false, error: "Credit non créé" };
    }
  } catch (error: any) {
    if (error instanceof ZodError) {
      console.error("Validation échouée :", error.errors);
      return {
        success: false,
        error: "Formulaire invalide, veuillez vérifier le formulaire",
      };
    }

    console.error("Erreur lors de la création de crédit :", error?.response?.data || error.message);
    return {
      success: false,
      error: error?.response?.data?.message || error.message,
    };
  }
}

export async function deleteCollecteur(id_collecteur: number) {
  // Exemple d'appel réseau
  const token = (await cookies()).get('token');
  if (!token) {
    console.warn('token introuvable dans les cookies ');
    return null;
  }
  const response = await fetch(`${BASE_URL}/api/collecteurs/${id_collecteur}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la suppression de collecteur");
  }

  return null;
}


export async function getCreditByRef(ref: string) {
  try {
    const token = (await cookies()).get('token');
    if (!token || !token.value) {
      return { success: false, error: 'Token introuvable ou invalide.' };
    }

    const response = await axios.get(`${BASE_URL}/api/collecteur/credit/ref`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      params: {
        referanceCredit: ref,
      },
    });
    console.log("crédit récupérer", response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de credit :', error);
  }
}

// Validation Zod
const formSchemaDebit = z.object({
  lieuDeCollection: z.string(),
  dateDeDebit: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)"),
  description: z.string(),
  creditCollecteur: z.number()
});

const formSchemaProduits = z.object({
  id_produit_avec_detail: z.number(),
  quantite: z.number(),
  unite: z.string(),
  prix_unitaire: z.number(),
  lieu_stock: z.string()
});

// Fonction principale
export async function createDebit(debitForm: FormData, produitsRequests: any[]) {
  try {
    // Extraction + parsing des données
    const rawData = {
      lieuDeCollection: String(debitForm.get('lieuDeCollection')),
      dateDeDebit: String(debitForm.get('dateDeDebit')), // 💡 bonne clé ici !
      description: String(debitForm.get('description')),
      creditCollecteur: Number(debitForm.get('creditCollecteur'))
    };

    const parsedDebit = formSchemaDebit.parse(rawData);

    // Validation des produits
    const formatProduits = produitsRequests.map((produit) =>
      formSchemaProduits.parse(produit)
    );

    // Formatage final de la requête
    const debitRequest = {
      debitCollecteur: {
        lieuDeCollection: parsedDebit.lieuDeCollection,
        dateDeDebit: parsedDebit.dateDeDebit + "T00:00:00",
        description: parsedDebit.description,
        creditCollecteur: {
          idCreditCollecteur: parsedDebit.creditCollecteur
        },
      },
           produitsCollecterRequests: formatProduits
    };

    // Auth
    const token = (await cookies()).get('token');
    if (!token?.value) {
      return { success: false, error: 'Token introuvable ou invalide.' };
    }

    // Requête
    console.log("corps de la requette de debit", debitRequest);
    const response = await axios.post(`${BASE_URL}/api/debit/produitscollecter`, JSON.stringify(debitRequest), {
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
    });

    // Résultat
    if (response.status === 201 || response.status === 200) {
      return { success: true, data: response.data };
    } else {
      return { success: false, error: 'Erreur lors de la création de débits.' };
    }

  } catch (error: any) {
    if (error instanceof ZodError) {
      console.error("Erreur Zod :", error.errors);
      return { success: false, error: 'Erreur de validation des données.' };
    }

    console.error("Erreur API :", error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
}

