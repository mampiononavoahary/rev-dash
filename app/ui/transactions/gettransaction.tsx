"use server"
import axios from 'axios';
import { BASE_URL } from '../../lib/db';
import { cookies } from 'next/headers';
import { z, ZodError } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { log } from 'console';


export async function getAllTransactions(
  query: string,
  currentPage: number
) {
  try {
    const token = (await cookies()).get('token');
    console.log('Token récupéré :', token?.value);

    if (!token || !token.value) {
      console.warn('Token introuvable ou invalide.');
      return []; // Retourne une liste vide par défaut
    }

    const response = await axios.get(`${BASE_URL}/api/transactions`, {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
      params: {
        query,
        currentPage
      }
    });

    return response.data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions :', error);
    return []; // Retourne une liste vide pour éviter de casser la page
  }
}
export async function getCountTransactions(query: string): Promise<number> {
  try {
    const token = (await cookies()).get('token');

    if (!token || !token.value) {
      console.warn('Token introuvable ou invalide.');
      return 0;
    }

    const total = await axios.get(`${BASE_URL}/api/transactions/count`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      params: {
        query,
      },
    });
    console.log(total.data);

    const countValue = Number(total.data);
    if (isNaN(countValue)) {
      console.error('Valeur de "total" invalide:', total.data);
      return 0; // Valeur par défaut
    }

    const totalPages = Math.ceil(countValue / 6);
    console.log('Total des pages calculé:', totalPages);
    return totalPages;
  } catch (error) {
    console.error('Erreur lors de la récupération des totals des transactions :', error);
    return 0; // Valeur par défaut en cas d'erreur
  }
}



// Schéma de validation pour le DetailTransaction
const formSchemaDetail = z.object({
  type_de_transaction: z.string(),
  date_de_transaction: z.string(),
  lieu_de_transaction: z.string(),
  id_client: z.string(),
});

// Schéma de validation pour la Transaction
const formSchemaTransaction = z.object({
  id_produit_avec_detail: z.string(),
  quantite: z.string(),
  unite: z.string(),
  prix_unitaire: z.number(),
  status: z.string(),
  lieu_stock: z.string(),
});

export async function createDetailAndTransaction(detailFormData: FormData, transactionRequests: any[]) {
  try {
    // Étape 1 : Validation des données du DetailTransaction
    const detailData = formSchemaDetail.parse({
      type_de_transaction: detailFormData.get('type_de_transaction'),
      date_de_transaction: new Date().toISOString(),
      lieu_de_transaction: detailFormData.get('lieu_de_transaction'),
      id_client: detailFormData.get('id_client'),
    });

    const token = (await cookies()).get('token');
    if (!token || !token.value) {
      return { success: false, error: 'Token introuvable ou invalide.' };
    }

    // Étape 2 : Validation des données de la Transaction
    const validatedTransactions = transactionRequests.map((transaction) =>
      formSchemaTransaction.parse(transaction)
    );

    // Étape 3 : Structurer les données pour correspondre à TransactionWrapper
    const transactionWrapper = {
      transactionRequests: validatedTransactions, // Liste des transactions
      detailTransactionRequest: detailData, // Détails de la transaction
    };

    // Étape 4 : Envoyer les données au serveur
    const response = await axios.post(
      `${BASE_URL}/api/transactions/create`,
      transactionWrapper, // Envoyer l'objet TransactionWrapper
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response.data);

    if (response.status === 201 || response.status === 200) {
      return { success: true, data: response.data };
    } else {
      return { success: false, error: 'Erreur lors de la création de la transaction.' };
    }
  } catch (error: any) {
    if (error instanceof ZodError) {
      return { success: false, error: 'Erreur de validation des données.' };
    }

    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
}

// Supposons que deleteTransaction est une fonction qui supprime une transaction via un appel API
export async function deleteTransaction(id_transaction: string) {
  // Exemple d'appel réseau
  const token = (await cookies()).get('token');
  if (!token) {
    console.warn('token introuvable dans les cookies ');
    return null;
  }
  const response = await fetch(`${BASE_URL}/api/transactions/delete/${id_transaction}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la suppression de la transaction");
  }

  return null;
}

export const updateTransactionStatus = async (id: string, status: string) => {
  try {
    const token = (await cookies()).get('token');
    if (!token) {
      console.warn('token introuvable dans les cookies ');
      return null;
    }
    const response = await axios.put(`${BASE_URL}/api/transactions/update/${id}`, {status}, {
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    throw error;
  }
};
