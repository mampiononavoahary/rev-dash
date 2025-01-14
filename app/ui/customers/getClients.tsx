'use server'
import axios from 'axios';
import { BASE_URL } from '../../lib/db';
import { cookies } from 'next/headers';
import { z, ZodError } from 'zod';


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
    return response.data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des clients :', error);
    return []; // Retourne une liste vide pour éviter de casser la page
  }
}
export async function getClientsExtracts(
  query: string,
  currentPage: number) {
  try {
    const token = (await cookies()).get('token');
    console.log('Token récupéré :', token?.value);

    if (!token || !token.value) {
      console.warn('Token introuvable ou invalide.');
      return []; // Retourne une liste vide par défaut
    }

    const response = await axios.get(`${BASE_URL}/api/clients/extracts`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      params: {
        query,
        currentPage
      }
    });

    console.log('Données des Clients récupérées :', response.data);
    return response.data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des clients :', error);
    return []; // Retourne une liste vide pour éviter de casser la page
  }
}
const formChema = z.object({
  nom: z.string().nonempty('Nom ne peut pas être vide'),
  prenom: z.string().optional(),
  adresse: z.string().nonempty('Adress requise.'),
  telephone: z.string().nonempty('Téléphone requise.'),
});

export async function CreateClient(formData: FormData) {
  try {
    const { nom, prenom, adresse, telephone } = formChema.parse({
      nom: formData.get('nom'),
      prenom: formData.get('prenom'),
      adresse: formData.get('adresse'),
      telephone: formData.get('telephone'),
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
    }

    const save = await axios.post(`${BASE_URL}/api/clients`, requestData, {
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'Application/json',
      },
    });
    if (save.status === 201 || save.status === 200) {
      return { success: true, data: save.data };
    } else {
      console.error('Erreur inattendue lors de la création du client:', save);
      return { success: false, error: 'Client non créé.' };
    }

  } catch (error: any) {
    if (error instanceof ZodError) {
      console.error('Erreur de validation:', error.errors);
      return {
        success: false,
        error: 'Données invalides. Veuillez vérifier les champs du formulaire.',
      };
    }

    // Gère les autres erreurs
    console.error('Erreur lors de la création du client:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
}
