import Link from "next/link";
import { InformationCircleIcon, PencilIcon } from "@heroicons/react/24/outline";

export function StockDetail({ lieu_stock, nom_produit }: { lieu_stock: string; nom_produit: string }) {
  return (
    <Link
      href={`/dashboard/stock/${lieu_stock}/${nom_produit}`}
      className="relative group"
    >
      <InformationCircleIcon className="w-6 text-gray-600 group-hover:text-blue-500" />
      <span className="absolute left-8 top-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
        Plus d'information
      </span>
    </Link>
  );
}

export function StockEdit({ lieu_stock, nom_produit }: { lieu_stock: string; nom_produit: string }) {
  return (
    <Link
      href={`/dashboard/stock/edit/${lieu_stock}/${nom_produit}`}
      className="relative group"
    >
      <PencilIcon className="w-6 text-gray-600 group-hover:text-green-500" />
      <span className="absolute left-8 top-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
        Éditer
      </span>
    </Link>
  );
}

