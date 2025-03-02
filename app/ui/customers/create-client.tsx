'use client';
import Link from "next/link";
import { SubmitButton } from "../transactions/submit_button";
import { CreateClient } from "./getClients";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function CreateClients() {
  const router = useRouter();
  return (
    <form
      className="w-full max-w-lg mx-auto mt-6 shadow-md rounded-md"
      action={async (formData) => {
        const result = await CreateClient(formData);
        if (result.success) {
          toast.success('Client creer avec succes');
          setTimeout(()=>{
            router.push('/dashboard/clients')
          },2000)
        } else {
          toast.error('Erreur lors de la creation du client');
        }
      }}
    >
      <h2 className="flex justify-center">
        Ajouter un nouveau client
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
            placeholder="Nom du client..."
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
            placeholder="Prénom du client..."
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
            placeholder="Adresse du client..."
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
            placeholder="Téléphone du client..."
          />
        </div>
      </div>
      <div className="flex flex-row justify-center gap-6 md:flex-col mb-6">
        <SubmitButton
          className="mt-4 p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-6"
          type="submit"
        >
          Créer un client
        </SubmitButton>
        <Link href="/dashboard/clients">
          <Button className="mt-4 mb-6">Annuler</Button>
        </Link>
      </div>
    </form>
  );
}
 
