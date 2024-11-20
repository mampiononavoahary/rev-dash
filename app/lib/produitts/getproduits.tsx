import axios from 'axios';
import { BASE_URL } from '../db';
import { cookies } from 'next/headers';

export async function getAllProduitsWithDetail() {
  try {
    const token = (await cookies()).get('token');
    
    if (!token?.value) {
      console.warn('Le token est introuvable. Essayez d’attendre qu’il soit défini.');
      return null; // Ou renvoyer une structure vide pour gérer ce cas
    }

    const produits = await axios.get(`${BASE_URL}/api/detailproduits`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    return produits.data;
  } catch (error) {
    return null;
  }
}


  