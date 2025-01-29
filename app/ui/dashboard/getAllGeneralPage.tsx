'use server'
import axios from 'axios';
import { BASE_URL } from '../../lib/db';
import { cookies } from 'next/headers';
import { strict, throws } from 'assert';



export async function getAllTransactionsEnterAndExit(lieu: string, date: string,dateDebut:string,dateFin:string) {
  try {
    const token = (await cookies()).get('token');
    if (!token) {
      console.warn('Token introuvable dans les cookies.');
      return null;
    }

    const transactions = await axios.get(`${BASE_URL}/api/transactions/sum/enterandexit`, {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
      params: {
        lieu,
        date,
        dateDebut,
        dateFin
      },
    });

    const res = transactions.data;
    console.log('Données des transactions :', res);
    return res;
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions:', error);
    throw error;
  }
}

export async function getPicBuyTransactions() {
  try {
    const token = (await cookies()).get('token');
    console.log('Token récupéré :', token?.value); // Vérifiez le token récupéré

    if (!token) {
      console.warn('Token introuvable dans les cookies.');
      return null;
    }

    const transactions = await axios.get(`${BASE_URL}/api/transactions/picsum`, {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    });

    const res = transactions.data;
    console.log("Somme vente par date:", res);
    return res;
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions somme sortie:', error);
    throw error;
  }
}

export async function getLatestTransactions() {
  try {
    const token = (await cookies()).get('token');
    console.log('Token récupéré :', token?.value); // Vérifiez le token récupéré

    if (!token) {
      console.warn('Token introuvable dans les cookies.');
      return null;
    }

    const transaction = await axios.get(`${BASE_URL}/api/transactions/latest`, {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    });

    const res = transaction.data;
    return res;
  } catch (error) {
    console.error('Erreur lors de la récupération des 6 dernier transactions:', error);
    throw error;
  }
}
export async function getStockRemaining(){
  try {
    const token = (await cookies()).get('token');
    
    if(!token){
      console.warn('Token introuvable dans les cookies. ');
      return null;
    }
    const stockRemaining = await axios.get(`${BASE_URL}/api/stock/remaining`,{
      headers:{
        Authorization: `Bearer ${token?.value}`,
      },
    });
    const res = stockRemaining.data;
    console.log(res);
    return res;
  } catch (error) {
    console.error("Erreur lors de la récupération des stock restants.", error);
    throw error;
  }
}
