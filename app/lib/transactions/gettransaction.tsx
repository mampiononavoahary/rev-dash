import axios from 'axios';
import { BASE_URL } from '../db';
import { cookies } from 'next/headers';

export async function getAllTransactions() {
  try {
    const token = (await cookies()).get('token');
    console.log('Token récupéré :', token?.value); // Vérifiez le token récupéré
  
    if (!token) {
      console.warn('Token introuvable dans les cookies.');
      return null;
    }
  
    const transaction = await axios.get(`${BASE_URL}/api/transactions`, {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    });
  
    const res = transaction.data;
    console.log("Données des transactions :", res);
    return res;
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions:', error);
    throw error;
  }
}