'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  ShoppingBagIcon,
  CubeIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import clsx from 'clsx';
// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Accueil', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Transaction',
    href: '/dashboard/transactions',
    icon: DocumentDuplicateIcon,
  },
  { name: 'Clients', href: '/dashboard/clients', icon: UserGroupIcon },
  {name:'Produits',href:'/dashboard/produits', icon:ShoppingBagIcon},
  {name:'Stock', href:'/dashboard/stock', icon:CubeIcon},
  {name:'Users',href:'/dashboard/users', icon:UserIcon}
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-yellow-200 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-yellow-500 text-blue-600': pathname === link.href,
              },
            )}
            >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
