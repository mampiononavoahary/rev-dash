'use client';
import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PaperClipIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import getAllFacture from './get-facture';
import { toast } from 'react-toastify';
import { EyeIcon } from 'lucide-react';

interface LigneFacture {
  produit: string;
  quantite: number;
  unite: string;
  prix: number;
  total: number;
}

interface Facture {
  id_facture: string;
  id_detail_transaction: string;
  date_de_transaction: string;
  nom_client: string;
  adresse_client: string;
  telephone_client: string;
  lieu_de_transaction: string;
  lignes_facture: LigneFacture[];
}

export default function Invoice() {
  const [facture, setFacture] = useState<Facture[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Facture | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const handleViewDetails = (invoice: Facture) => {
    setSelectedInvoice(invoice);
  };

  const handleCloseDetails = () => {
    setSelectedInvoice(null);
  };

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

  const handlePrint = (id: string) => {
    const invoice = facture.find((inv) => inv.id_facture === id);
    if (!invoice || !invoice.lignes_facture) {
      toast.error("Données de facture incomplètes.");
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Impossible d'ouvrir la fenêtre d'impression.");
      return;
    }

    const printableHTML = `
      <html>
        <head>
          <title>Facture #${invoice.id_facture}</title>
          <style>
            /* Styles... */
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <h2>Facture #${invoice.id_facture}</h2>
            <p><strong>Date:</strong> ${invoice.date_de_transaction}</p>
            <p><strong>Client:</strong> ${invoice.nom_client}</p>
            <p><strong>Adresse:</strong> ${invoice.adresse_client}</p>
            <table>
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Quantité</th>
                  <th>Unité</th>
                  <th>Prix Unitaire</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.lignes_facture
        .map(
          (ligne) => `
                      <tr>
                        <td>${ligne.produit}</td>
                        <td>${ligne.quantite}</td>
                        <td>${ligne.unite}</td>
                        <td>${ligne.prix} Ariary</td>
                        <td>${ligne.total} Ariary</td>
                      </tr>
                    `
        )
        .join('')}
              </tbody>
            </table>
            <div class="total">
              <strong>Total:</strong> ${invoice.lignes_facture.reduce(
          (acc, ligne) => acc + ligne.total,
          0
        )} Ariary
            </div>
            <div class="footer">
              <p>Merci pour votre confiance !</p>
              <p>Contactez-nous en cas de questions.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printableHTML);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  const handleDownload = async (id: string) => {
    const invoiceElement = document.getElementById(id);
    if (!invoiceElement) {
      console.error(`L'élément avec l'ID '${id}' est introuvable.`);
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
    pdf.save(`facture_${id}.pdf`);
  };

  return (
    <div className="gap-6">
      <div className='flex justify-between'>
        <input
          className='border-gray-200'
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <input
          className='border-gray-200'
          type="text"
          placeholder='Rechercher...'
        />

      </div>
      <div className="overflow-auto h-[350px] border-2 rounded-lg p-6">
        {facture?.map((invoice, index) => {
          const uniqueId = `invoice-${index}`;
          return (
            <div
              className="p-2 bg-white rounded-lg mb-6"
              id={uniqueId}
              key={invoice.id_detail_transaction || index}
            >
              <div className="flex gap-6 px-2 py-2">
                <div>
                  <p>{invoice.nom_client}</p>
                  <p>{invoice.adresse_client}</p>
                  <p>{invoice.telephone_client}</p>
                </div>
                {invoice.lignes_facture.map((ligne, ligneIndex) => (
                  <div key={ligneIndex} className="border-1 border-gray-500 bg-gray-500 bg-opacity-5 px-2 rounded-lg">
                    <p>{ligne.produit}</p>
                    <div className="flex gap-2">
                      <p>{ligne.quantite}</p>
                      <p>{ligne.unite}</p>
                    </div>
                  </div>
                ))}
                <div className='ml-auto text-blue-800 font-bold'>
                  <p>{invoice.lieu_de_transaction}</p>
                </div>
              </div>
              <div className="flex justify-end mt-6 space-x-4">
                <button
                  className="text-gray-700 hover:text-gray-900"
                  onClick={() => handleViewDetails(invoice)}
                >
                  <EyeIcon className="w-6 h-6" />
                </button>
              </div>
              <hr/>
            </div>
          );
        })}
      </div>

      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mb-6">
            <header className="flex justify-between items-center mb-6">
              <div className="text-2xl font-bold text-gray-700 bg-cyan-200 px-8 py-8 w-1/2">
                Facture
              </div>
              <div className="text-gray-600">
                <div className="font-bold">Facture #{selectedInvoice.id_facture}</div>
                <div>Date: {selectedInvoice.date_de_transaction}</div>
              </div>
            </header>

            <section className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-bold text-gray-700">De:</h3>
                <div className="text-gray-600">
                  <p>Mi-côlecta</p>
                  <p>Lot 2VB {selectedInvoice.lieu_de_transaction}</p>
                  <p>{selectedInvoice.lieu_de_transaction}, Madagascar</p>
                  <p>Email: contact@micolecta.com</p>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-700">Vers:</h3>
                <div className="text-gray-600">
                  <p>{selectedInvoice.nom_client}</p>
                  <p>{selectedInvoice.adresse_client}</p>
                  <p>Téléphone: {selectedInvoice.telephone_client}</p>
                </div>
              </div>
            </section>

            <table className="w-full table-auto mb-6">
              <thead className="bg-cyan-200">
                <tr>
                  <th className="border px-4 py-2 text-left">Produit</th>
                  <th className="border px-4 py-2 text-left">Quantité</th>
                  <th className="border px-4 py-2 text-left">Unité</th>
                  <th className="border px-4 py-2 text-left">Prix</th>
                  <th className="border px-4 py-2 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice.lignes_facture.map((ligne, ligneIndex) => (
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
              <span>
                {selectedInvoice.lignes_facture.reduce(
                  (acc, ligne) => acc + ligne.total,
                  0
                )}{' '}
                Ariary
              </span>
            </div>

            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={() => handlePrint(selectedInvoice.id_facture)}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                Imprimer
              </button>
              <button
                onClick={() => handleDownload(selectedInvoice.id_facture)}
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                <PaperClipIcon className="w-5 h-5 mr-2" />
                Télécharger
              </button>
              <button
                onClick={handleCloseDetails}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
