import Link from "next/link";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export function StockDetail({ lieu_stock, nom_produit }: { lieu_stock: string; nom_produit: string }) {
  return (
    <Link
      href={`/dashboard/stock/${lieu_stock}/${nom_produit}`} // Utilisation correcte des backticks
    >
      <InformationCircleIcon className="w-7 ml-auto cursor-pointer hover:text-blue-800" />
    </Link>
  );
}

