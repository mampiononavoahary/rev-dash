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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid w-full max-w-sm items-center gap-4"
    >
      <Label htmlFor="username">Nom d'utilisateur</Label>
      <Input
        type="username"
        id="username"
        placeholder="Nom d'utilisateur"
         value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <Label htmlFor="password">Mot de passe</Label>
      <Input
        type="password"
        id="password"
        placeholder="Mot de passe"
         value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button type="submit">Se connecter</Button>
    </form>
  );
};

export default Login;
