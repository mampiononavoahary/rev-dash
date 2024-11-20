import { getAllProduitsWithDetail } from '@/app/lib/produitts/getproduits';

export default async function Produits() {
  try {
    const produits = await getAllProduitsWithDetail();

    if (!Array.isArray(produits)) {
      throw new Error('Les données retournées ne sont pas un tableau.');
    }

    return (
      <ul>
        {produits.map((produit: any) => (
          <li key={produit.id_detail_produit}>{produit.nom_detail}</li>
        ))}
      </ul>
    );
  } catch (error) {
    console.error('Erreur dans le composant Produits:', error);
    return <p>Impossible de charger les produits.</p>;
  }
}


