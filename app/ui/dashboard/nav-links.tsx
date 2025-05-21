
'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  ShoppingBagIcon,
  CubeIcon,
  UserIcon,
  Square3Stack3DIcon,
  BanknotesIcon,
  BellIcon,
  PowerIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useAuth } from '@/app/lib/userContext';

const links = [
  { name: 'Accueil', href: '/dashboard', icon: HomeIcon },
  { name: 'Transactions', href: '/dashboard/transactions', icon: DocumentDuplicateIcon },
  { name: 'Clients', href: '/dashboard/clients', icon: UserGroupIcon },
  { name: 'Produits', href: '/dashboard/produits', icon: ShoppingBagIcon },
  { name: 'Stock', href: '/dashboard/stock', icon: CubeIcon },
  { name: 'Utilisateurs', href: '/dashboard/users', icon: UserIcon },
  { name: 'Collecteurs', href: '/dashboard/collecteurs', icon: Square3Stack3DIcon },
  { name: 'Finances', href: '/dashboard/finances', icon: BanknotesIcon },
  { name: 'Notification', href: '/dashboard/notification', icon: BellIcon },
  { name: 'Se déconnecter', href: '/', icon: PowerIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    logout();
    setTimeout(() => {
      router.push('/');
    }, 1000);
  };

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname === link.href || (pathname.startsWith(link.href + '/') && link.href !== '/dashboard');

        const isLogout = link.name === 'Se déconnecter';

        return (
          <Link
            key={link.name}
            href={link.href}
            onClick={isLogout ? handleLogout : undefined}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-cyan-200 hover:text-yellow-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-teal-100 text-yellow-600': isActive,
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

