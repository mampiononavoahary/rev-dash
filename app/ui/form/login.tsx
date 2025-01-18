'use client';

import { useAuth } from "@/app/lib/userContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Login = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [succes, setSucces] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSucces('');
    setIsLoading(true);
    try {
      await login(username, password);
      setSucces('Authentifié');
      setTimeout(() => {
        router.push('/dashboard');
      },2000)
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid w-full max-w-sm items-center gap-4 bg-emerald-100 px-2 py-4 rounded-lg mb-4"
    >
      <Label htmlFor="username" className="text-gray-900">Nom d'utilisateur</Label>
      <Input
        type="username"
        id="username"
        className="text-gray-900 border-yellow-600"
        placeholder="Nom d'utilisateur"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <Label htmlFor="password" className="text-gray-900">Mot de passe</Label>
      <Input
        type="password"
        className="text-gray-900 border-yellow-600"
        id="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p className="text-red-500 text-sm mx-auto">{error}</p>}
      {succes && <p className="text-green-800 text-sm mx-auto">{succes}</p>}
      <Button type="submit" disabled={isLoading} className="bg-blue-400 hover:bg-blue-500">
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"
              ></path>
            </svg>
            Chargement...
          </>
        ) : (
          "Se connecter"
        )}
      </Button>
    </form>
  );
};

export default Login;

