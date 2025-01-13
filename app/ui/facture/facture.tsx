'use client';
import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PaperClipIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import getAllFacture from './get-facture';
import { toast } from 'react-toastify';
export default function Invoice() {
  const [facture, setFacture] = useState<any[]>([]);
  useEffect(() => {

    const fetchData = async () => {
      try {
        const facture = await getAllFacture();
        setFacture(facture);
      } catch (error) {
        console.error('Erreur lors du chargement des données :', error);
        toast.error('Erreur lors du chargement des données.');
      }
    };

    fetchData();
  }, []);


  if (!facture) {
    console.warn('Donnés des facture non récupérer!')
  }
  
const handlePrint = () => {
  const invoiceElement = document.getElementById('invoice');
  if (!invoiceElement) {
    console.error("L'élément avec l'ID 'invoice' est introuvable.");
    toast.error("Impossible de trouver l'élément de la facture à imprimer.");
    return;
  }

  const originalContents = document.body.innerHTML;

  // Masquer tout le contenu sauf la facture
  document.body.innerHTML = invoiceElement.outerHTML;

  window.print();

  // Restaurer le contenu original de la page après l'impression
  document.body.innerHTML = originalContents;
};


 const handleDownload = async () => {
  const invoiceElement = document.getElementById('invoice');
  if (!invoiceElement) {
    console.error("L'élément avec l'ID 'invoice' est introuvable.");
    toast.error("Impossible de trouver l'élément de la facture à télécharger.");
    return;
  }

  const canvas = await html2canvas(invoiceElement);
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgWidth = 210; // Largeur A4 en mm
  const pageHeight = 297; // Hauteur A4 en mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  pdf.save('invoice.pdf');
};
  return (
    <div className='gap-6'>
      {
        facture?.map((invoice: any, index: number) => (
          <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mb-6" id="invoice" key={invoice.id_detail_transaction || index}>
            <header className="flex justify-between items-center mb-6">
              <div className="text-2xl font-bold text-gray-700 bg-cyan-200 px-8 py-8 w-1/2">Facture</div>
              <div className="text-gray-600">
                <div className="font-bold">Facture #{invoice.id_facture}</div>
                <div>Date: {invoice.date_de_transaction}</div>
              </div>
            </header>

            <section className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-bold text-gray-700">De:</h3>
                <div className="text-gray-600">
                  <p>Mi-côlecta</p>
                  <p>Lot 2VB {invoice.lieu_de_transaction}</p>
                  <p>{invoice.lieu_de_transaction}, Madagascar</p>
                  <p>Email: contact@micolecta.com</p>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-700">Vers:</h3>
                <div className="text-gray-600">
                  <p>{invoice.nom_client}</p>
                  <p>{invoice.adresse_client}</p>
                  <p>Téléphone: {invoice.telephone_client}</p>
                </div>
              </div>
            </section>

            <table className="w-full table-auto mb-6">
              <thead className='bg-cyan-200'>
                <tr>
                  <th className="border px-4 py-2 text-left">Produit</th>
                  <th className="border px-4 py-2 text-left">Quantité</th>
                  <th className="border px-4 py-2 text-left">Unité</th>
                  <th className="border px-4 py-2 text-left">Prix</th>
                  <th className="border px-4 py-2 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.lignes_facture.map((ligne: any, ligneIndex: number) => (
                  <tr key={ligneIndex}>
                    <td className="border px-4 py-2">{ligne.produit}</td>
                    <td className="border px-4 py-2">{ligne.quantite}</td>
                    <td className="border px-4 py-2">{ligne.unite}</td>
                    <td className="border px-4 py-2">{ligne.prix}</td>
                    <td className="border px-4 py-2">{ligne.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Totaux:</span>
              <span>{invoice.lignes_facture.reduce((acc: number, ligne: any) => acc + ligne.total, 0)} Ariary</span>
            </div>

            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={handlePrint}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <PaperClipIcon className="mr-2 w-5 h-5" /> Print
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                <ArrowDownTrayIcon className="mr-2 w-5 h-5" /> Download
              </button>
            </div>
          </div>
        ))
      }
    </div>
  );
};
