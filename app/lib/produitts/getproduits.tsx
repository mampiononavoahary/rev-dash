import axios from 'axios';
import { BASE_URL } from '../db';
import { cookies } from 'next/headers';

export async function getAllProduitsWithDetail() {
  try {
    const token = (await cookies()).get('token');
    console.log('Token récupéré :', token?.value); // Vérifiez le token récupéré
  
    if (!token) {
      throw new Error('Token introuvable dans les cookies.');
    }
  
    const produits = await axios.get(`${BASE_URL}/api/detailproduits`, {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    });
  
    const res = produits.data;
    console.log("Données des produits :", res);
    return res;
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    throw error;
  }
}

  