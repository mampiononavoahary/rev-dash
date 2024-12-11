import { log } from "console";
import getAllStock from "./get-stock";

export default async function getAllStocks() {
  const stocks = await getAllStock();
  if (!stocks) {
    console.warn('Donnés des stocks non récupérer!')
  }
  return(
    <div>
    
    </div>
  );

} 
