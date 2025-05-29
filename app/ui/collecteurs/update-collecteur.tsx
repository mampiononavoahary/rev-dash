'use client';
import Link from "next/link";
import { SubmitButton } from "../transactions/submit_button";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { getCollecteursById, UpdateOnCollecteur } from "./collecteur-api";
import { use, useEffect, useState } from "react";

export default function UpdateCollecteurForm({ params }: { params: Promise<{ id_collecteur: string }> }) {
  const [collecteurs, setCollecteurs] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const id_collecteur = use(params);
  const id = Number(id_collecteur);
  const router = useRouter();

  useEffect(() => {
    const fetchCollecteur = async () => {
      try {
        console.log("id du collecteurs", id);
        const collecte = await getCollecteursById(id);
        if (!collecte) {
          toast.error('Collecteur non trouvé!');
        }
        setCollecteurs(collecte);
      } catch (error) {
        console.log("Erreur lors de la récupération de collecteur");
      } finally {
        setLoading(false);
      }
    };
    fetchCollecteur();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto">
        <div role="status">
          <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );

  }
  if (!collecteurs || Object.keys(collecteurs).length === 0) {
    return <p className="text-center text-gray-500 mt-6">Aucun collecteur trouvé.</p>;
  }

  return (
    <form
      className="w-full max-w-lg mx-auto mt-6 shadow-md rounded-md"
      action={async (formData) => {
        const update = await UpdateOnCollecteur(id, formData);
        if (update.success) {
          toast.success('Collecteur à jour');
          setTimeout(() => {
            router.push('/dashboard/collecteurs')
          }, 2000);
        } else {
          toast.error('Erreur lors de la mise à jour du collecteur');
        }
      }}
    >
      <h2 className="flex justify-center">
        Mettre à jour le collecteur
      </h2>


      <div>
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
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3"
              type="text"
              defaultValue={collecteurs.nom}
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
              defaultValue={collecteurs.prenom}
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
              defaultValue={collecteurs.adresse}
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
              defaultValue={collecteurs.telephone}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-center gap-6 md:flex-col mb-6">
        <SubmitButton
          className="mt-4 p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-6"
          type="submit"
        >
          Enregistrer
        </SubmitButton>
        <Link href="/dashboard/collecteurs">
          <Button className="mt-4 mb-6">Annuler</Button>
        </Link>
      </div>
    </form>
  );
}

