'use server';

import { BASE_URL } from "@/app/lib/db";
import axios from "axios";
import { cookies } from "next/headers";

export default async function getAllFacture() {
  try {
    const token = (await cookies()).get('token');

    if (!token) {
      console.warn('Token not found');
    }

    const response = await axios.get(`${BASE_URL}/api/facture`, {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    });

    const data = response.data;
    console.log(data);
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des factures :', error);
    throw error;
  }

}
