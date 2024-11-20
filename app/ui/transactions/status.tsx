import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function TransactionStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-gray-100 text-gray-500': status === 'EN_ATTENTE',
          'bg-green-500 text-white': status === 'PAYE',
        },
      )}
    >
      {status === 'EN_ATTENTE' ? (
        <>
          EN_ATTENTE
          <ClockIcon className="ml-1 w-4 text-gray-500" />
        </>
      ) : null}
      {status === 'PAYE' ? (
        <>
          PAYE
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
    </span>
  );
}