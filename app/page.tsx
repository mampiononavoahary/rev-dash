import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from './ui/fonts';
import Image from 'next/image';
import Photo from './ui/Photo';
import Login from './ui/form/login';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-2 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <h1 className='flex justify-center text-3xl font-semibold text-center'>Bienvenue chez :<span className='text-yellow-400'> Mi</span><span className='text-yellow-400'>-</span>-Kôlecta</h1>
            <Photo/>
          <p className='flex justify-center text-center'>Cette application va vous aider à gérer la gestion de stock, la vente et l'achat.</p>
      <div/>
      </div>
        <div className="flex flex-col items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12 bg-gray-50 gap-4">
          {/* Add Hero Images Here */}
          <h2 className='bg-yellow-400 p-4 rounded-lg'>Connectez vous</h2>
          <Login/>
        </div>
      </div>
    </main>
  );
}
