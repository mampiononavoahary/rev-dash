"use server"
import axios from 'axios';
import { cookies } from 'next/headers';
import { z, ZodError } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { BASE_URL } from '@/app/lib/db';


export async function getAllVentes(
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

    const response = await axios.get(`${BASE_URL}/api/transactions/ventes`, {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
      params: {
        query,
        currentPage
      }
    });

    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions :', error);
    return []; // Retourne une liste vide pour éviter de casser la page
  }
}