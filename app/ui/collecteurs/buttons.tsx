'use client'
import { CheckIcon, PencilIcon, PlusIcon, TrashIcon, ArrowRightCircleIcon, ArrowPathIcon, ClockIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { deleteCollecteur } from "../collecteurs/collecteur-api";

export function CreateCollecteurs() {
  return (
    <Link
      href="/dashboard/collecteurs/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Ajouter un nouveau collecteurs</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateCollecteur({ id_collecteur }: { id_collecteur: string }) {
  return (
    <Link
      href="/dashboard/clients"
      className="rounded-md border p-2 hover:bg-yellow-200"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}
export function DeleteCollecteur({ id_collecteur, onDelete }: { id_collecteur: number, onDelete: () => void }) {
  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await deleteCollecteur(id_collecteur);
      onDelete(); 
    } catch (error) {
      console.error("Erreur lors de la suppression du collecteur", error);
    }
  };

  return (
    <form onSubmit={handleDelete}>
      <button type="submit" className="rounded-md border p-2 hover:bg-red-300">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
export function Explorer({ id_collecteur }: { id_collecteur: number }) {

  return (<Link
    href={`/dashboard/collecteurs/${id_collecteur}`}
    className="relative group"
  >
    <button className="rounded-md border p-2 hover:bg-green-300">
      <span className="sr-only">Leur débit et crédit</span>
      <ArrowRightCircleIcon className="w-5" />
    </button>
  </Link>
  );
}
export function Effectuer({ id_collecteur }: { id_collecteur: number }) {
  return (<div
    className="relative group"
  >
    <button className="rounded-full border p-1 bg-green-300">
      <span className="sr-only">Leur débit et crédit</span>
      <CheckIcon className="w-5" />
    </button>
  </div>
  );
}
export function EnAttent({ id_collecteur }: { id_collecteur: number }) {
  return (<div
    className="relative group"
  >
    <button className="rounded-full border p-1 bg-yellow-300">
      <span className="sr-only">Leur débit et crédit</span>
      <ClockIcon className="w-5" />
    </button>
  </div>
  );
}
