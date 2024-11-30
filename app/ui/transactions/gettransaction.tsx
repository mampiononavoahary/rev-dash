"use server"
import axios from 'axios';
import { BASE_URL } from '../../lib/db';
import { cookies } from 'next/headers';
import { z, ZodError } from 'zod';
import { redirect } from 'next/navigation';


export async function getAllTransactions() {
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
    });

    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions :', error);
    return []; // Retourne une liste vide pour éviter de casser la page
  }
}

const formChema = z.object({
  type_de_transaction: z.string(),
  date_de_transaction: z.string(),
  lieu_de_transaction: z.string(),
  id_client: z.string(),
});

function formatZodErrors(error: ZodError): string[] {
  return error.errors.map((err) => {
    const field = err.path.join('.');
    return `${field}: ${err.message}`;
  });
}

const CreateTransaction = formChema.omit({ date_de_transaction: true });

export async function postDetailTransaction(formData: FormData) {
  try {
    const { type_de_transaction, lieu_de_transaction, id_client } = CreateTransaction.parse({
      type_de_transaction: formData.get('type_de_transaction'),
      lieu_de_transaction: formData.get('lieu_de_transaction'),
      id_client: formData.get('id_client'),
    });

    const date = new Date().toISOString().split('T')[0];

    const token = (await cookies()).get('token');

    if (!token || !token.value) {
      return { success: false, error: 'Token introuvable ou invalide.' };
    }

    const requestData = {
      type_de_transaction,
      date_de_transaction: date,
      lieu_de_transaction,
      id_client,
    };

    const response = await axios.post(`${BASE_URL}/api/detailtransaction/post`, requestData, {
      headers: {
        Authorization: `Bearer ${token?.value}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 201 || response.status === 200) {
      return { success: true, data: response.data };
    } else {
      alert('Détail ransaction non créer')
    }
  } catch (error: any) {
    if (error instanceof ZodError) {
      redirect("/transactions/create/error")
    }

    // Gère les autres erreurs
    console.error('Erreur lors de la création de la transaction :', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
}

export async function getLastDetailTransaction(){
  try {
    const token = (await cookies()).get('token');
    console.log('Token récupéré :', token?.value); // Vérifiez le token récupéré
  
    if (!token) {
      console.warn('Token introuvable dans les cookies.');
      return null;
    }
  
    const produits = await axios.get(`${BASE_URL}/api/detailtransaction/lastdetail`, {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    });
  
   return produits.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions:', error);
    throw error;
  }
}

const formChema2 = z.object({
  id_produit_avec_detail: z.string().nonempty('Produit requis.'),
  id_detail_transaction: z.string().optional(),
  quantite: z.string().nonempty('Quantité requise.'),
  unite: z.string().nonempty('Unité requise.'),
  status: z.string().nonempty('Status requis.'),
});


export async function postDetailTransaction2(formData: FormData) {
  try {
    const { id_produit_avec_detail,quantite,unite,status} = formChema2.parse({
      id_produit_avec_detail: formData.get('id_produit_avec_detail'),
      quantite: formData.get('quantite'),
      unite: formData.get('unite'),
      status:formData.get('status'),
    });

    const lastDetailTransaction = await getLastDetailTransaction();
    if (!lastDetailTransaction || typeof lastDetailTransaction.id_detail_transaction !== 'number') {
      console.error('id_detail_transaction est introuvable ou incorrect.');
      throw new Error('Impossible de récupérer un id_detail_transaction valide.');
    }
    


    const token = (await cookies()).get('token');

    if (!token || !token.value) {
      return { success: false, error: 'Token introuvable ou invalide.' };
    }

    const requestData = [{
      id_produit_avec_detail,
      id_detail_transaction:lastDetailTransaction.id_detail_transaction,
      quantite,
      unite,
      status
    },];
    console.log('Données de la requête:', requestData);

    const response = await axios.post(`${BASE_URL}/api/transactions/create`, requestData, {
      headers: {
        Authorization: `Bearer ${token?.value}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 201 || response.status === 200) {
      return { success: true, data: response.data };
    } else {
      alert('Détail ransaction non créer')
    }
  } catch (error: any) {
    if (error instanceof ZodError) {
      console.error('Validation échouée :', error.errors);
      redirect('/transactions/create');
    }

    // Gère les autres erreurs
    console.error('Erreur lors de la création de la transaction :', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
}
