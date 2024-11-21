import axios from 'axios';
import { BASE_URL } from '../../lib/db';
import { cookies } from 'next/headers';


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
        Authorization: `Bearer ${token.value}`,
      },
    });

    console.log('Données des transactions récupérées :', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions :', error);
    return []; // Retourne une liste vide pour éviter de casser la page
  }
}
