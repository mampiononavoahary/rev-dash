
'use client';
import React, { useEffect, useState } from 'react';
import { getBilanCollecteur } from './getAllGeneralPage';
import { lusitana } from '../fonts';

type ProduitTotal = {
  [nom: string]: number;
};

export default function BilanCollecteur({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) {
  const [bilan, setBilan] = useState<any[]>([]);
  const [totauxParProduit, setTotauxParProduit] = useState<ProduitTotal>({});
  const [totalCreditGlobal, setTotalCreditGlobal] = useState<number>(0);
  const [prixMoyenParProduit, setPrixMoyenParProduit] = useState<{ [nom: string]: number }>({});


  const handlePrixMoyenChange = (nomProduit: string, value: string) => {
    if (value === '') {
      setPrixMoyenParProduit((prev) => ({ ...prev, [nomProduit]: 0 }));
      return;
    }

    const prix = parseFloat(value);
    if (!isNaN(prix)) {
      setPrixMoyenParProduit((prev) => ({ ...prev, [nomProduit]: prix }));
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBilanCollecteur(startDate, endDate);
        setBilan(data);

        const totaux: ProduitTotal = {};
        let totalCredit = 0;

        if (Array.isArray(data) && data.length > 0) {
          data.forEach((bilans: any) => {
            totalCredit += bilans.total_credit || 0;

            if (Array.isArray(bilans.produits)) {
              bilans.produits.forEach((produit: any) => {
                if (!totaux[produit.nom_produit]) {
                  totaux[produit.nom_produit] = 0;
                }
                totaux[produit.nom_produit] += produit.total_quantite;
              });
            }
          });
        }
        setTotauxParProduit(totaux);
        setTotalCreditGlobal(totalCredit);
      } catch (error) {
        console.error('Erreur lors de la récupération des bilans collecteur', error);
      }
    };
    fetchData();
  }, [startDate, endDate]);


  const exportToCSV = () => {
    const csvHeader = "Collecteur,Total Crédit,Produit,Quantité Totale,Unité\n";
    const csvRows: string[] = [];


    if (Array.isArray(bilan) && bilan.length > 0) {
      bilan.forEach((bilans) => {
        if (!Array.isArray(bilans.produits) || bilans.produits.length === 0) {
          csvRows.push([
            bilans.collecteur,
            bilans.total_credit,
            "Aucun produit",
            "",
            ""
          ].join(","));
          return;
        }

        bilans.produits.forEach((produit: any, i: number) => {
          const row = [
            i === 0 ? bilans.collecteur : "",
            i === 0 ? bilans.total_credit : "",
            produit.nom_produit,
            produit.total_quantite,
            "KG",
          ];
          csvRows.push(row.join(","));
        });
      });
    }


    csvRows.push("");

    csvRows.push("Produit,Total Quantité, Prix Moyen (Ar/KG), Prix Total Estimé (Ar)");

    Object.entries(totauxParProduit).forEach(([nom, total]) => {
      const prixMoyen = prixMoyenParProduit[nom] || 0;
      const prixTotal = prixMoyen * total;
      csvRows.push(`${nom},${total},${prixMoyen.toFixed(2)},${prixTotal.toFixed(2)}`);
    });

    csvRows.push("");

    csvRows.push(`Total Crédit Global,${totalCreditGlobal}`);

    const sommeTotaleEstimee = Object.entries(totauxParProduit).reduce((acc, [nom, total]) => {
      const prixMoyen = prixMoyenParProduit[nom] || 0;
      return acc + prixMoyen * total;
    }, 0);
    csvRows.push(`Somme Totale Estimée,${sommeTotaleEstimee.toFixed(2)}`);

    const csvContent = csvHeader + csvRows.join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "bilan_collecteur.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div>
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Bilan des crédits et débits collecteur/clients tantsaha
      </h2>

      <div className='flex'>
        <button
          onClick={exportToCSV}
          className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Exporter en CSV
        </button>

      </div>
      {bilan.length > 0 ? (
        <div className="overflow-y-auto max-h-[500px] border rounded mb-4">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100 text-center">
              <tr>
                <th className="border p-2">Collecteur</th>
                <th className="border p-2">Total Crédit</th>
                <th className="border p-2">Produit</th>
                <th className="border p-2">Quantité Totale</th>
                <th className="border p-2">Unité</th>
              </tr>
            </thead>
            <tbody>
              {
                bilan.map((bilans: any, index: number) => {
                  if (!bilans.produits || bilans.produits.length === 0) {
                    return (
                      <tr key={index} className="text-center">
                        <td className="border p-2">{bilans.collecteur}</td>
                        <td className="border p-2">{bilans.total_credit}</td>
                        <td className="border p-2 italic text-gray-500" colSpan={3}>
                          Aucun produit
                        </td>
                      </tr>
                    );
                  }

                  return bilans.produits.map((produit: any, i: number) => (
                    <tr key={`${index}-${i}`} className="text-center">
                      <td className="border p-2">{i === 0 ? bilans.collecteur : ''}</td>
                      <td className="border p-2">{i === 0 ? bilans.total_credit : ''}</td>
                      <td className="border p-2">{produit.nom_produit}</td>
                      <td className="border p-2">{produit.total_quantite}</td>
                      <td className="border p-2">KG</td>
                    </tr>
                  ));
                })
              }
              <tr className="bg-gray-200 font-semibold text-center">
                <td className="border p-2">Total général</td>
                <td className="border p-2">{totalCreditGlobal}</td>
                <td className="border p-2" colSpan={3}></td>
              </tr>


              {Object.entries(totauxParProduit).map(([nom, total], idx) => {
                const prixMoyen = prixMoyenParProduit[nom] || 0;
                const prixTotal = prixMoyen * total;

                return (
                  <React.Fragment key={`total-produit-${idx}`}>
                    <tr className="bg-gray-100 text-center text-sm">
                      <td className="border p-2 italic text-left" colSpan={3}>
                        Total du produit : <strong>{nom}</strong>
                      </td>
                      <td className="border p-2">{total}</td>
                      <td className="border p-2">KG</td>
                    </tr>
                    <tr className="text-center text-sm">
                      <td className="border p-2 italic text-left" colSpan={3}>
                        Prix moyen (Ar / KG) :
                      </td>
                      <td className="border p-2" colSpan={2}>
                        <input
                          type="number"
                          value={prixMoyenParProduit[nom] !== undefined ? String(prixMoyenParProduit[nom]) : ''}
                          onChange={(e) => handlePrixMoyenChange(nom, e.target.value)}
                          className="border rounded px-2 py-1 w-24 text-right"
                          placeholder="0"
                        />

                      </td>
                    </tr>
                    <tr className="bg-yellow-100 text-center text-sm font-semibold">
                      <td className="border p-2 italic text-left" colSpan={3}>
                        Prix total estimé :
                      </td>
                      <td className="border p-2" colSpan={2}>
                        {prixTotal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} Ar
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}

              <tr className="bg-green-200 font-bold text-center text-lg">
                <td className="border p-2 italic text-left" colSpan={3}>
                  Somme totale estimée (tous produits)
                </td>
                <td className="border p-2" colSpan={2}>
                  {Object.entries(totauxParProduit)
                    .reduce((acc, [nom, total]) => {
                      const prixMoyen = prixMoyenParProduit[nom] || 0;
                      return acc + prixMoyen * total;
                    }, 0)
                    .toLocaleString('fr-FR', { minimumFractionDigits: 2 })}{" "}
                  Ar
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p>Aucune donnée disponible pour cette période.</p>
      )}
    </div>
  );
}

