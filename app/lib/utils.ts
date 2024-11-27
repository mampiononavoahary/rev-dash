import { Revenue } from './definitions';

export const formatCurrency = (amount: number) => {
  return amount.toLocaleString('fr-MG', {
    style: 'currency',
    currency: 'MGA', // Code pour Ariary
    minimumFractionDigits: 0, // Les Ariary n'ont pas de sous-unité officielle
  });
};


export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

const formatNumber = (value: number): string => {
  if (value >= 1000) {
    return `${value / 1000}k`; // Convertir en milliers
  }
  return `${value}`; // Sinon, renvoyer directement
};

// Mettre à jour generateYAxis
export const generateYAxis = (revenue: any) => {
  if (!revenue || revenue.length === 0) {
    return { yAxisLabels: [], topLabel: 0 };
  }

  // Trouver la valeur maximale de la somme
  const maxSum = revenue.reduce((acc: any, month: any) => Math.max(acc, month.sum), 0);

  // Calculer un intervalle dynamique en fonction de la valeur maximale
  let interval;
  if (maxSum > 1000000) {
    interval = 100000; // Intervalles de 100k pour des valeurs très élevées
  } else if (maxSum > 500000) {
    interval = 50000; // Intervalles de 50k pour des valeurs moyennes
  } else if (maxSum > 100000) {
    interval = 20000; // Intervalles de 20k pour des valeurs plus petites
  } else {
    interval = 10000; // Intervalles de 10k pour des valeurs très petites
  }

  // Calculer le label supérieur en arrondissant à l'intervalle supérieur
  const topLabel = Math.ceil(maxSum / interval) * interval;

  // Générer les étiquettes de l'axe Y
  const yAxisLabels = [];
  for (let i = 0; i <= topLabel; i += interval) {
    // Ajouter des unités simplifiées (k pour mille)
    yAxisLabels.unshift(`Ar${(i / 1000).toFixed(0)}k`);
  }

  return { yAxisLabels, topLabel };
};


export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};
