import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { getAllTransactionsEnter, getAllTransactionsExit, getSumTransactionsEnter, getSumTransactionsExit } from './getAllGeneralPage';
import { formatCurrency } from '@/app/lib/utils';

const iconMap = {
  vente: BanknotesIcon,
  achat: InboxIcon,
  sumAchat: ClockIcon,
  sumVente:UserGroupIcon
};

export default async function CardWrapper() {
  const enter = await getAllTransactionsEnter();
  const exit = await getAllTransactionsExit();
  const sumEnter = await getSumTransactionsEnter();
  const sumExit = await getSumTransactionsExit();
  const enterWithCurency = formatCurrency(sumEnter?? '0');
  const exitWithCurrency = formatCurrency(sumExit?? '0');
  return (
    <>
      {/* NOTE: Uncomment this code in Chapter 9 */}

       <Card title="Nombre total de vente" value={enter} type="vente" />
      <Card title="Nombre d'achat" value={exit} type="achat" />
      <Card title="Nombre total de vente" value={enterWithCurency} type="vente" />
      <Card title="Nombre d'achat" value={exitWithCurrency} type="achat" />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: BigInteger | string;
  type: 'vente' | 'achat' | 'sumAchat' | 'sumVente';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
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
