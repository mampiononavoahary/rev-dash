import axios from 'axios';
import { BASE_URL } from '../../lib/db';
import { cookies } from 'next/headers';

export async function getAllTransactionsEnter() {
  try {
    const token = (await cookies()).get('token');
    console.log('Token récupéré :', token?.value); // Vérifiez le token récupéré
  
    if (!token) {
      console.warn('Token introuvable dans les cookies.');
      return null;
    }
  
    const transactions = await axios.get(`${BASE_URL}/api/transactions/total/enter`, {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    });
  
    const res = transactions.data;
    console.log("Données des transactions :", res);
    return res;
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions:', error);
    throw error;
  }
}
export async function getAllTransactionsExit() {
    try {
      const token = (await cookies()).get('token');
      console.log('Token récupéré :', token?.value); // Vérifiez le token récupéré
    
      if (!token) {
        console.warn('Token introuvable dans les cookies.');
        return null;
      }
    
      const transactions = await axios.get(`${BASE_URL}/api/transactions/total/exit`, {
        headers: {
          Authorization: `Bearer ${token?.value}`,
        },
      });
    
      const res = transactions.data;
      console.log("Données des transactions total sortie:", res);
      return res;
    } catch (error) {
      console.error('Erreur lors de la récupération des transactions total sortie:', error);
      throw error;
    }
  }
  export async function getSumTransactionsEnter() {
    try {
      const token = (await cookies()).get('token');
      console.log('Token récupéré :', token?.value); // Vérifiez le token récupéré
    
      if (!token) {
        console.warn('Token introuvable dans les cookies.');
        return null;
      }
    
      const transactions = await axios.get(`${BASE_URL}/api/transactions/sum/enter`, {
        headers: {
          Authorization: `Bearer ${token?.value}`,
        },
      });
    
      const res = transactions.data;
      console.log("Données des transactions sum enter:", res);
      return res;
    } catch (error) {
      console.error('Erreur lors de la récupération des transactions sum enter:', error);
      throw error;
    }
  }
  export async function getSumTransactionsExit() {
    try {
      const token = (await cookies()).get('token');
      console.log('Token récupéré :', token?.value); // Vérifiez le token récupéré
    
      if (!token) {
        console.warn('Token introuvable dans les cookies.');
        return null;
      }
    
      const transactions = await axios.get(`${BASE_URL}/api/transactions/sum/exit`, {
        headers: {
          Authorization: `Bearer ${token?.value}`,
        },
      });
    
      const res = transactions.data;
      console.log("Données des transactions somme sortie:", res);
      return res;
    } catch (error) {
      console.error('Erreur lors de la récupération des transactions somme sortie:', error);
      throw error;
    }
  }
  export async function getPicBuyTransactions(){
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

export async function getLatestTransactions(){
  try {
    const token = (await cookies()).get('token');
    console.log('Token récupéré :', token?.value); // Vérifiez le token récupéré
  
    if (!token) {
      console.warn('Token introuvable dans les cookies.');
      return null;
    }
  
    const produits = await axios.get(`${BASE_URL}/api/transactions/latest`, {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    });
  
   return produits.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des 6 dernier transactions:', error);
    throw error;
  }
}
