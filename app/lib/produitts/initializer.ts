'use client';

import { useEffect } from 'react';
import { getTokenFromLocalStorage, setToken } from '@/app/lib/produitts/getToken';

export default function InitializeToken() {
  useEffect(() => {
    const token = getTokenFromLocalStorage();
    if (token) {
      setToken(token); // Stocke le token dans un cookie
    }
  }, []);

  return null; // Pas besoin d'afficher quoi que ce soit
}
