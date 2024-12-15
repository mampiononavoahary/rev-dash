import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { deleteTransaction } from "../transactions/gettransaction";

export function CreateClients() {
  return (
    <Link
      href="/dashboard/clients/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Ajouter un nouveau clients</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateClients({ id_clients }: { id_clients: string }) {
  return (
    <Link
      href="/dashboard/clients"
      className="rounded-md border p-2 hover:bg-yellow-200"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteClients({ id_clients }: { id_clients: string }) {
  const deletetransaction = deleteTransaction.bind(null,id_clients) 
  return (
    <form action={deletetransaction}>
      <button className="rounded-md border p-2 hover:bg-red-300">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
