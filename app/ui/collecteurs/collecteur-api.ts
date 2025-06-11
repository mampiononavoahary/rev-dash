"use server"

import { BASE_URL } from "@/app/lib/db";
import axios from "axios";
import { cookies, headers } from "next/headers"
import { cache } from "react";
import { number, z, ZodError } from "zod";

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
const formChema = z.object({
  nom: z.string().nonempty('Nom ne peut pas être vide'),
  prenom: z.string().optional(),
  adresse: z.string().nonempty('Adress requise.'),
  telephone: z.string().nonempty('Téléphone requise.'),
  categorie: z.string().nonempty('categorie requise'),
});

export async function CreateCollecteurs(formData: FormData) {
  try {
    const { nom, prenom, adresse, telephone, categorie } = formChema.parse({
      nom: formData.get('nom'),
      prenom: formData.get('prenom'),
      adresse: formData.get('adresse'),
      telephone: formData.get('telephone'),
      categorie: formData.get('categorie'),
    });
    const token = (await cookies()).get('token');

    if (!token || !token.value) {
      return { success: false, error: 'Token introuvable ou invalide.' };
    }
    const requestData = {
      nom,
      prenom,
      adresse,
      telephone,
      categorie,
    }

    const save = await axios.post(`${BASE_URL}/api/collecteurs/save`, requestData, {
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'Application/json',
      },
    });
    if (save.status === 201 || save.status === 200) {
      return { success: true, data: save.data };
    } else {
      console.error('Erreur inattendue lors de la création du collecteur:', save);
      return { success: false, error: 'collecteur non créé.' };
    }

  } catch (error: any) {
    if (error instanceof ZodError) {
      console.error('Erreur de validation:', error.errors);
      return {
        success: false,
        error: 'Données invalides. Veuillez vérifier les champs du formulaire.',
      };
    }

    console.error('Erreur lors de la création du collecteur:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
}
const formSchemaUpdate = z.object({
  nom: z.string().nonempty('Nom ne peut pas être vide'),
  prenom: z.string().optional(),
  adresse: z.string().nonempty('Adresse requise.'),
  telephone: z.string().nonempty('Téléphone requis.'),
});

export async function UpdateOnCollecteur(id: number, formData: FormData) {
  try {
    const { nom, prenom, adresse, telephone } = formSchemaUpdate.parse({
      nom: formData.get('nom'),
      prenom: formData.get('prenom'),
      adresse: formData.get('adresse'),
      telephone: formData.get('telephone'),
    });

    const token = (await cookies()).get('token');

    if (!token || !token.value) {
      return { success: false, error: 'Token introuvable ou invalide.' };
    }

    const requestData = { nom, prenom, adresse, telephone };

    const response = await axios.put(`${BASE_URL}/api/collecteurs/update/${id}`, requestData, {
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {
      console.error('Erreur inattendue lors de la mise à jour du collecteur:', response);
      return { success: false, error: 'Collecteur non mis à jour.' };
    }
  } catch (error: any) {
    if (error instanceof ZodError) {
      console.error('Erreur de validation:', error.errors);
      return {
        success: false,
        error: 'Données invalides. Veuillez vérifier les champs du formulaire.',
      };
    }

    console.error('Erreur lors de la mise à jour du collecteur:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
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
    const rawData = {
      id_collecteur: Number(formdata.get('collecteur')),
      dateDeCredit: String(formdata.get('dateDeCredit')),
      montant: Number(formdata.get('montant')),
      description: String(formdata.get('description')),
    };

    const parsed = formSchema.parse(rawData);

    const creditRequest = JSON.stringify({
      dateDeCredit: parsed.dateDeCredit + "T00:00:00",
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

export async function deleteProduitCollecter(id_produit_collecter: number) {
  const token = (await cookies()).get('token');
  if (!token) {
    console.warn('token introuvable dans les cookies ');
    return null;
  }
  const response = await fetch(`${BASE_URL}/api/debit/produitscollecter/delete/${id_produit_collecter}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la suppression de produit collecter");
  }

  return null;
}

export async function getLastCredit(id_collecteur: number) {
  try {
    const token = (await cookies()).get('token');
    if (!token || !token.value) {
      return { success: false, error: 'Token introuvable ou invalide.' };
    }

    const response = await axios.get(`${BASE_URL}/api/collecteur/credit/lastcredit/${id_collecteur}`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      }
    });
    console.log("crédit récupérer", response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de credit :', error);
  }
}

const formSchemaDebit = z.object({
  lieuDeCollection: z.string(),
  dateDeDebit: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)"),
  depense: z.number(),
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

export async function createDebit(debitForm: FormData, produitsRequests: any[]) {
  try {
    const rawData = {
      lieuDeCollection: String(debitForm.get('lieuDeCollection')),
      dateDeDebit: String(debitForm.get('dateDeDebit')),
      description: String(debitForm.get('description')),
      depense: Number(debitForm.get('depense')),
      creditCollecteur: Number(debitForm.get('creditCollecteur'))
    };

    const parsedDebit = formSchemaDebit.parse(rawData);

    const formatProduits = produitsRequests.map((produit) =>
      formSchemaProduits.parse(produit)
    );

    const debitRequest = {
      debitCollecteur: {
        lieuDeCollection: parsedDebit.lieuDeCollection,
        dateDeDebit: parsedDebit.dateDeDebit + "T00:00:00",
        depense: parsedDebit.depense,
        description: parsedDebit.description,
        id_credit_collecteur: {
          idCreditCollecteur: parsedDebit.creditCollecteur
        },
      },
      produitsCollecterRequests: formatProduits
    };

    const token = (await cookies()).get('token');
    if (!token?.value) {
      return { success: false, error: 'Token introuvable ou invalide.' };
    }

    console.log("corps de la requette de debit", debitRequest);
    const response = await axios.post(`${BASE_URL}/api/debit/produitscollecter`, JSON.stringify(debitRequest), {
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
    });

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

export async function UpdateProduitsCollecter(
  id_produit_collecter: number,
  quantite: number,
  unite: string,
  prix_unitaire: number
) {
  try {
    const token = (await cookies()).get('token');
    if (!token || !token.value) {
      console.warn("Token introuvable dans les cookies");
      return;
    }

    const update = await axios.put(`${BASE_URL}/api/debit/produitscollecter/update/${id_produit_collecter}`, null, {
      headers: {
        "Authorization": `Bearer ${token?.value}`,
        "Content-Type": "application/json",
      },
      params: {
        quantite,
        unite,
        prix_unitaire
      }
    })
    return update.data;
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour :", error?.message || error);
    throw error;
  }
}

