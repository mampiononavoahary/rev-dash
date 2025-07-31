
'use client';
import { useEffect, useState } from "react";
import { getAllUsers } from "./user-api";
import Image from "next/image";
import Search from "../search";
import { CreateUser } from "./buttons";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const result = await getAllUsers();
        if (!result.success) {
          throw new Error(result.error);
        }
        setUsers(result.data);
      } catch (err: any) {
        setError(err.message || "Une erreur s'est produite.");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  // Affichage en cas de chargement
  if (loading) {
    return <p className="text-blue-500">Chargement des utilisateurs...</p>;
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <p className="font-semibold">Erreur :</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block w-full align-middle">
        <div className="rounded-lg bg-teal-100 p-2 md:pt-0">
          {/* Affichage pour petits écrans */}
          <div className="custom-lg:block custom-sm:block hidden space-y-4">
            {users?.map((user: any, index: number) => (
              <div
                key={user.id_user || index}
                className="flex flex-col space-y-2 rounded-md bg-white p-4 shadow-md"
              >
                <div className="flex items-center justify-between border-b pb-3">
                  <p className="text-sm font-semibold text-gray-600">
                    {user.nom}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user.prenom}
                  </p>
                </div>
                <div className="text-sm">
                  <p><span className="font-medium">Contact :</span> {user.contact}</p>
                  <p><span className="font-medium">Address :</span> {user.address}</p>
                  <p><span className="font-medium">Rôle :</span> {user.role}</p>
                  <p><span className="font-medium">Nom d'Utilisateur :</span> {user.username}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Affichage pour grands écrans */}
          <table className="block min-w-full text-gray-900 custom-lg:hidden custom-sm:hidden md:table">
            <thead className="rounded-lg text-left text-sm font-medium">
              <tr>
                <th scope="col" className="px-3 py-5">Profile</th>
                <th scope="col" className="px-4 py-5 sm:pl-6">Nom</th>
                <th scope="col" className="px-3 py-5">Prénom(s)</th>
                <th scope="col" className="px-3 py-5">Adresse</th>
                <th scope="col" className="px-3 py-5">Contact</th>
                <th scope="col" className="px-3 py-5">Rôle</th>
                <th scope="col" className="px-3 py-5">Nom d'Utilisateur</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {users?.map((user: any, index: number) => (
                <tr
                  key={user.id_user || index}
                  className="w-full border-b py-3 text-sm last-of-type:border-none"
                >
                  <td className="whitespace-nowrap px-3 py-3">
                    {user.image ? (
                      <Image
                        className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
                        src={user.image}
                        alt="user-image"
                        width={80}
                        height={80}
                      />
                    ) : (
                      <div className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500 bg-gray-200"></div>
                    )}                  </td>

                  <td className="whitespace-nowrap px-3 py-3">{user.nom}</td>
                  <td className="whitespace-nowrap px-3 py-3">{user.prenom}</td>
                  <td className="whitespace-nowrap px-3 py-3">{user.address}</td>
                  <td className="whitespace-nowrap px-3 py-3">{user.contact}</td>
                  <td className="whitespace-nowrap px-3 py-3">{user.role}</td>
                  <td className="whitespace-nowrap px-3 py-3">{user.username}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

