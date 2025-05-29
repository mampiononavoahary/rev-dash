'use client';
import Link from "next/link";
import { SubmitButton } from "../transactions/submit_button";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { CreateCollecteurs } from "./collecteur-api";

export default function CreateCollecteur() {
  const router = useRouter();
  return (
    <form
      className="w-full max-w-lg mx-auto mt-6 shadow-md rounded-md"
      action={async (formData) => {
        const result = await CreateCollecteurs(formData);
        if (result.success) {
          toast.success('Collecteur creer avec succes');
          setTimeout(() => {
            router.push('/dashboard/collecteurs')
          }, 2000)
        } else {
          toast.error('Erreur lors de la creation du collecteur');
        }
      }}
    >
      <h2 className="flex justify-center">
        Ajouter un nouveau Collecteur/Client tantsaha
      </h2>
      <div className="flex flex-wrap -mx-3 mb-6 mt-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label
            htmlFor="nom"
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          >
            Nom
          </label>
          <input
            name="nom"
            id="nom"
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            type="text"
            placeholder="Nom ..."
            required
          />
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label
            htmlFor="prenom"
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          >
            Prénom
          </label>
          <input
            name="prenom"
            id="prenom"
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            type="text"
            placeholder="Prénom ..."
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label
            htmlFor="adresse"
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          >
            Adresse
          </label>
          <input
            name="adresse"
            id="adresse"
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            type="text"
            placeholder="Adresse ..."
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label
            htmlFor="telephone"
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          >
            Téléphone
          </label>
          <input
            name="telephone"
            id="telephone"
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            type="text"
            placeholder="Téléphone ..."
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">

          <label
            htmlFor="categorie"
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          >
            Catégorie 
          </label>          
          <select
            id="categorie"
            name="categorie"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="COLLECTEUR">Collecteur</option>
            <option value="CLIENT_TANTSAHA">Client tantsaha</option>
          </select>

        </div>
      </div>
      <div className="flex flex-row justify-center gap-6 md:flex-col mb-6">
        <SubmitButton
          className="mt-4 p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-6"
          type="submit"
        >
          Ajouter 
        </SubmitButton>
        <Link href="/dashboard/collecteurs">
          <Button className="mt-4 mb-6">Annuler</Button>
        </Link>
      </div>
    </form>
  );
}

