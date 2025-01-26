
import React from 'react';

export default async function Page() {
  // Exemple de récupération de données
  const data = await fetchData();

  return <div>{data ? 'Données chargées' : 'Chargement...'}</div>;
}

// Exemple de fonction de récupération de données
async function fetchData() {
  return new Promise((resolve) =>
    setTimeout(() => resolve('Données simulées'), 1000)
  );
}


