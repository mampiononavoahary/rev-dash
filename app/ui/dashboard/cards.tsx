import { GlobeAltIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { getAllTransactionsEnterAndExit } from './getAllGeneralPage';
import { formatCurrency } from '@/app/lib/utils';

const iconMap = {
  vente: GlobeAltIcon,
  achat: GlobeAltIcon,
  sumAchat: BanknotesIcon,
  sumVente: BanknotesIcon,
};

export default async function CardWrapper({ lieu, date }: { lieu: string, date: string }) {
  const enter = await getAllTransactionsEnterAndExit(lieu,date);
    const enterWithCurrency = formatCurrency(enter?.sum_sortie ?? 0);  // Utilisation de l'opérateur de chaîne sécurisée
  const exitWithCurrency = formatCurrency(enter?.sum_entre ?? 0);

  return (
    <>
      <Card title="Nombre total de vente" value={enter?.total_sortie ?? 0} type="vente" />
      <Card title="Nombre total d'achat" value={enter?.total_entre ?? 0} type="achat" />
      <Card title="Somme des ventes" value={enterWithCurrency} type="sumVente" />
      <Card title="Somme d'achat" value={exitWithCurrency} type="sumAchat" />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: BigInteger | string | number;
  type: 'vente' | 'achat' | 'sumAchat' | 'sumVente';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-teal-100 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}

