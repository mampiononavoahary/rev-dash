'use client'

import { useState, useRef, useEffect } from 'react';
import { CheckIcon, ClockIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { fetchTransactionById, updateTransactionStatus } from './gettransaction'; // Assure-toi du bon chemin d'import
import { toast } from 'react-toastify';

export default function TransactionStatus({ id, status: initialStatus }: { id: string; status: string }) {
  const [status, setStatus] = useState(initialStatus);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const closeDropdown = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, []);


  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status) return; // Évite de re-envoyer la même valeur

    setLoading(true);
    try {
      const changeStatus = await updateTransactionStatus(id, newStatus);

      if (changeStatus?.success) {
        setStatus(newStatus);
        setIsOpen(false);
        toast.success("Mise à jour de transaction avec succès");
      } else {
        toast.error(changeStatus?.error || "Erreur lors de la mise à jour de transaction");

        const updatedTransaction = await fetchTransactionById(id);
        setStatus(updatedTransaction?.status || status);
      }
    } catch (error) {
      toast.error("Impossible de mettre à jour le statut.");

      const updatedTransaction = await fetchTransactionById(id);
      setStatus(updatedTransaction?.status || status);
    } finally {
      setLoading(false);
    }
  };

  
return (
  <div className="relative inline-block" ref={dropdownRef}>
    <button
      className={clsx(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium cursor-pointer focus:outline-none',
        {
          'bg-gray-100 text-gray-500': status === 'EN_ATTENTE',
          'bg-green-500 text-white': status === 'PAYE',
        },
      )}
      onClick={status === 'EN_ATTENTE' ? toggleDropdown : undefined} // ✅ Uniquement cliquable si "EN_ATTENTE"
      disabled={loading}
    >
      {status === 'EN_ATTENTE' ? (
        <>
          EN ATTENTE
          <ClockIcon className="ml-1 w-4 text-gray-500" />
        </>
      ) : (
        <>
          PAYE
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      )}
      {status === 'EN_ATTENTE' && <ChevronDownIcon className="ml-2 w-4 text-gray-400" />} {/* ✅ Chevron affiché seulement si EN_ATTENTE */}
    </button>

    {isOpen && status === 'EN_ATTENTE' && ( // ✅ Vérifie que le dropdown ne s'affiche que si EN_ATTENTE
      <div className="absolute flex flex-col left-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-10">
        <button
          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
          onClick={() => handleStatusChange('PAYE')}
        >
          PAYE
        </button>
      </div>
    )}
  </div>
);
}

