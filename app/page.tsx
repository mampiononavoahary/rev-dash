'use client'
import Photo from './ui/Photo';
import Login from './ui/form/login';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function isTokenValid(token: string | null): boolean {
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
  } catch (err) {
    console.error("Erreur de décodage du token :", err);
    return false;
  }
}

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token'); 

    if (isTokenValid(token)) {
      router.push('/dashboard');
    } else {
      localStorage.removeItem('token'); // Supprimer token expiré
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col p-4 overflow-x-hidden !overflow-y-auto bg-gray-100">
      <div className="flex grow flex-col gap-4 md:flex-row md:overflow-auto">
        <div className="flex flex-col justify-center items-center gap-4 rounded-lg bg-white px-2 py-6 md:w-2/5 shadow-lg bg-custom-bg bg-cover bg-center">
          <h1 className="text-3xl font-semibold text-gray-900 text-center">
            Bienvenue chez <span className="text-blue-600">ZOARYNAMBININA</span>
          </h1>
          <Photo />
          <p className="text-center text-gray-700 max-w-sm">
            Cette application va vous aider à gérer la gestion de stock, la vente et l'achat.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center p-2 md:w-3/5 rounded-lg bg-custom-bg2 bg-cover bg-center relative">
          <div className="bg-white bg-opacity-20 backdrop-blur-md shadow-lg rounded-xl p-4 w-full max-w-sm md:max-w-md">
            <h2 className="text-lg font-semibold text-center text-green-800 mb-4 animate-bounce">Connectez-vous</h2>
            <Login />
          </div>
        </div>
      </div>
    </main>
  );
}

