'use client'
import { useState, useEffect } from "react";
import {
  GlobeAltIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { getAllTransactionsEnter, getAllTransactionsExit, getSumTransactionsEnter, getSumTransactionsExit } from './getAllGeneralPage';
import { formatCurrency } from '@/app/lib/utils';

const iconMap = {
  vente: GlobeAltIcon,
  achat: GlobeAltIcon,
  sumAchat: BanknotesIcon,
  sumVente: BanknotesIcon
};

export default function CardWrapper({ lieu, date }: { lieu: string, date: string }) {
  const [enter, setEnter] = useState(null);
  const [exit, setExit] = useState(null);
  const [sumEnter, setSumEnter] = useState(null);
  const [sumExit, setSumExit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const enterData = await getAllTransactionsEnter(lieu, date);
        const exitData = await getAllTransactionsExit(lieu, date);
        const sumEnterData = await getSumTransactionsEnter(lieu, date);
        const sumExitData = await getSumTransactionsExit(lieu, date);

        setEnter(enterData);
        setExit(exitData);
        setSumEnter(sumEnterData);
        setSumExit(sumExitData);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [lieu, date]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const enterWithCurrency = formatCurrency(sumEnter ?? '0');
  const exitWithCurrency = formatCurrency(sumExit ?? '0');

  return (
    <>
      <Card title="Nombre total de vente" value={enter} type="vente" />
      <Card title="Nombre total d'achat" value={exit} type="achat" />
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
  value: BigInteger | string;
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

