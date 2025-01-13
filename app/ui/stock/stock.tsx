import { stock } from "@/app/lib/definitions";
import { getAllStock } from "./get-stock";
import { StockDetail } from "./buttons";
export default async function Stocks() {
  const stocks = await getAllStock();
  if (!stocks) {
    console.warn('Donnés des stocks non récupérer!')
  }
  return (
    <div>
      <div className="flex flex-wrap p-4 gap-4 justify-center mt-4">
        {
          stocks?.map((stock: stock, index: string) => (
            <div className="w-full max-w-sm bg-white border border-double border-4 border-teal-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl" key={stock.id_stock || index} >
              <h4 className="text-blue-800">
                {stock.lieu_stock}
              </h4>
              <div className="px-5 pb-5">
                <div className="flex items-center mt-2.5 mb-5 gap-2">
                  <img className="w-10 h-10 rounded-full" src={stock.image_url} alt="Rounded avatar" />
                  <h5 className="text-gray-900 dark:text-white">{stock.nom_detail}</h5>
                  <h5>{stock.symbole}</h5>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{stock.quantite_stock}  {stock.unite}</span>
                </div>
                <StockDetail lieu_stock={stock.lieu_stock} nom_produit={stock.nom_detail}/>
              </div>
            </div>
          ))
        }
      </div>
      <div>
        <h2 className="text-center text-xl text-gray-900 font-medium mb-4">
          Autres produits dans le stock
        </h2>

      </div>
    </div>
  );

} 
