import { stockDetail } from "@/app/lib/definitions";
import { getStockByLieuAndProduit, getStockByLieuAndProduit2 } from "@/app/ui/stock/get-stock";

type tParams = Promise<{ lieu_stock: string; nom_produit: string }>;

export default async function Page({ params }: { params: tParams }) {
  // Attendez que les paramètres soient résolus avant de les utiliser
  const { lieu_stock, nom_produit } = await params;  // Récupérer les stocks
  const stocks = await getStockByLieuAndProduit(lieu_stock, nom_produit);
  const stocksNoTransaction = await getStockByLieuAndProduit2(lieu_stock, nom_produit);

  if (!stocks || stocks.length === 0) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Détails du stock</h1>
        <div className="flex justify-center mb-4">
          <span className="bg-green-100 text-green-800 text-md font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Lieu: {stocksNoTransaction.lieu_stock}</span>
          <span className="bg-yellow-100 text-yellow-800 text-md font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">Produit: {stocksNoTransaction.nom_detail}</span>
          <span className="bg-yellow-100 text-yellow-800 text-md font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">Reste: {stocksNoTransaction.quantite_stock}</span>
        </div>
        <p className="text-gray-500">Aucun transactions trouver pour cette produit.</p>
      </div>
    );
  }

  const quantite_actuel = stocks[0].quantite_stock || "Quantité indisponible";
  const unite_stock = stocks[0].unite_stock || "Unité indisponible";
  const produit = stocks[0].nom_detail || "Produit inconnu";
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Détails du stock</h1>
      <div className="flex justify-center mb-4">
        <span className="bg-green-100 text-green-800 text-md font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Lieu: {lieu_stock}</span>
        <span className="bg-yellow-100 text-yellow-800 text-md font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">Produit: {produit}</span>
        <span className="bg-indigo-100 text-indigo-800 text-md font-medium me-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300">Reste: {quantite_actuel} {unite_stock}</span>
      </div>
      <h3 className="text-blue-600 text-center mb-2 bg-gray-200">Les transactions passé pour cette produits</h3>
      <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
        {/* Affichage pour petits écrans (moins de 1341px de largeur OU 760px de hauteur) */}
        <div className="custom-lg:block custom-sm:block xl:hidden space-y-4">
          {stocks?.map((transaction: stockDetail, index: string) => (
            <div
              key={`${transaction.id_stock}-${index}`}
              className="flex flex-col space-y-2 rounded-md bg-white p-4 shadow-md hover:shadow-2xl"
            >
              <div className="flex items-center justify-between border-b pb-3">
                <p className="text-sm font-semibold text-gray-600">
                  {transaction.nom_client}
                </p>
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-gray-500">
                    {transaction.date_transaction}
                  </p>
                  <p className="text-xs text-gray-500">
                    {transaction.lieuDeTransaction}
                  </p>
                </div>
              </div>
              <div className="text-sm">
                <p>
                  <span className="font-medium">Type :</span> {transaction.typeDeTransaction}
                </p>
                <p>
                  <span className="font-medium">Quantité :</span> {transaction.quantite} {transaction.unite}
                </p>
                <p>
                  <span className="font-medium">Statut :</span> {transaction.status}
                </p>
              </div>
            </div>
          ))}
        </div>
        <table className="table-auto w-full border-collapse border border-gray-200 custom-lg:hidden custom-sm:hidden">
          {/* En-tête du tableau */}
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Quantité</th>
              <th className="border border-gray-300 px-4 py-2">Unité</th>
              <th className="border border-gray-300 px-4 py-2">Statut</th>
              <th className="border border-gray-300 px-4 py-2">Type de transaction</th>
              <th className="border border-gray-300 px-4 py-2">Lieu de transaction</th>
              <th className="border border-gray-300 px-4 py-2">Date de transaction</th>
              <th className="border border-gray-300 px-4 py-2">Nom du client</th>
            </tr>
          </thead>

          {/* Corps du tableau */}

          <tbody>
            {stocks?.map((stock: stockDetail, index: number) => (
              <tr key={`${stock.id_stock}-${index}`} className="hover:bg-green-100">
                <td className="border border-gray-300 px-4 py-2">{stock.quantite}</td>
                <td className="border border-gray-300 px-4 py-2">{stock.unite}</td>
                <td className="border border-gray-300 px-4 py-2">{stock.status}</td>
                <td className="border border-gray-300 px-4 py-2">{stock.typeDeTransaction}</td>
                <td className="border border-gray-300 px-4 py-2">{stock.lieuDeTransaction}</td>
                <td className="border border-gray-300 px-4 py-2">{stock.date_transaction}</td>
                <td className="border border-gray-300 px-4 py-2">{stock.nom_client}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}

