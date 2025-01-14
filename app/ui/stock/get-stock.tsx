'use server'

import { BASE_URL } from "@/app/lib/db";
import axios from "axios";
import { cookies } from "next/headers";

export async function getAllStock(){
  try {
    const token = (await cookies()).get('token');

    if (!token || !token.value) {
      console.warn('Token not found');
      return [];
    }
    const stocks = await axios.get(`${BASE_URL}/api/extract/stock`,{
      headers:{
        Authorization: `Bearer ${token?.value}`,
      },
    });
    const data = stocks.data;
    console.log(data);
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des stocks :', error);
    return [];
  }
}

export async function getStockByLieuAndProduit(lieu_stock: string, nom_produit: string) {
  try {
    const token = (await cookies()).get('token');

    if (!token) {
      console.warn('Token not found');
    }

    const response = await axios.get(`${BASE_URL}/api/stock/${lieu_stock}/${nom_produit}`, {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    });

    const data = response.data;
    console.log(data);
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des stocks par lieu et produit :', error);
    throw error;
  }
}
export async function getStockByLieuAndProduit2(lieu_stock: string, nom_produit: string) {
  try {
    const token = (await cookies()).get('token');

    if (!token) {
      console.warn('Token not found');
    }

    const response = await axios.get(`${BASE_URL}/api/extract/stock/${lieu_stock}/${nom_produit}`, {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    });

    const data = response.data;
    console.log(data);
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des stocks par lieu et produit :', error);
    throw error;
  }
}
