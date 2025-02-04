'use client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { BASE_URL } from '@/app/lib/db';
import { deleteTransaction } from './gettransaction';
import { useState } from 'react';
import { toast } from "react-toastify";
import { Checkbox } from "@/components/ui/checkbox";

export function CreateTransaction() {
  return (
    <Link
      href="/dashboard/transactions/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Ajouter Transaction</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

type AddProduitProps = {
  ajouterProduit: (produit: any) => void;
};

export function AddProduit({ ajouterProduit }: AddProduitProps) {
  return (
    <button
      type="button"
      className="flex items-center justify-center p-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
    >
      <PlusIcon className="h-5" />
      <span className="ml-2">Ajouter</span>
    </button>
  );
}

export function GoToVente() {
  return (
    <Link
      href="/dashboard/transactions/ventes"
      className="flex h-10 items-center rounded-lg bg-cyan-950 px-4 text-sm font-medium text-white transition-colors hover:bg-cyan-600"
    >
      <span>Ventes</span>{' '}
    </Link>
  );
}
export function GoToAchat() {
  return (
    <Link
      href="/dashboard/transactions/achats"
      className="flex h-10 items-center rounded-lg bg-lime-600 px-4 text-sm font-medium text-white transition-colors hover:bg-lime-400"
    >
      <span>Achats</span>{' '}
    </Link>
  );
}

export function UpdateTransaction({ id_transaction }: { id_transaction: string }) {
  return (
    <Link
      href="/dashboard/transactions"
      className="rounded-md border p-2 hover:bg-yellow-200"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteTransaction({ id_transaction }: { id_transaction: string }) {
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteTransaction(id_transaction);
      toast.success("Transaction supprimée avec succès.", {
        position: "top-center"
      }); // Remplacez par un autre composant d'alerte si besoin
      setTimeout(() => {
        window.location.reload();
      }, 2000)
      setOpen(false);
    } catch (error) {
      console.error("Erreur lors de la suppression de la transaction :", error);
      toast.error("Une erreur est survenue. Veuillez réessayer.", {
        position: "top-center"
      });
    }
  }; return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <button
            type="button"
            className="rounded-md border p-2 hover:bg-red-300"
          >
            <span className="sr-only">Supprimer</span>
            <TrashIcon className="w-5" />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La transaction sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-400 hover:bg-red-600">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

