'use client';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { getCollecteursById, UpdateOnCollecteur } from "@/app/ui/collecteurs/collecteur-api";
import { SubmitButton } from "@/app/ui/transactions/submit_button";

export default function page({ params }: { params: Promise<{ id_collecteur: string }> }) {
  const [collecteurs, setCollecteurs] = useState<any>(null);
  const { id_collecteur } = use(params);
  const id = Number(id_collecteur);
  const router = useRouter();

  useEffect(() => {
    const fetchCollecteur = async () => {
      try {
        console.log("id du collecteurs", id);
        const collecte = await getCollecteursById(id);
        setCollecteurs(collecte);
      } catch (error) {
        console.log("Erreur lors de la récupération de collecteur");
      }
    };
    fetchCollecteur();
  }, [id_collecteur]);

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

      {collecteurs && (
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

        </div>
      )}
    </form>
  );
}

