import axios from 'axios';
import { BASE_URL } from '../../lib/db';
import { cookies } from 'next/headers';


export async function getAllClients() {
  try {
    const token = (await cookies()).get('token');
    console.log('Token récupéré :', token?.value);

    if (!token || !token.value) {
      console.warn('Token introuvable ou invalide.');
      return []; // Retourne une liste vide par défaut
    }

    const response = await axios.get(`${BASE_URL}/api/clients`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    console.log('Données des Clients récupérées :', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des clients :', error);
    return []; // Retourne une liste vide pour éviter de casser la page
  }
}