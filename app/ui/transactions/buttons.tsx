import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

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

export function UpdateTransaction({ id_transaction }: { id_transaction: number }) {
  return (
    <Link
      href="/dashboard/transactions"
      className="rounded-md border p-2 hover:bg-yellow-200"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteTransaction({ id_transaction }: { id_transaction: number }) {
  return (
    <>
      <button className="rounded-md border p-2 hover:bg-red-300">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </>
  );
}