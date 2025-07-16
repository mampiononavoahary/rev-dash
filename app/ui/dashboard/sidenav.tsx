'use client';
import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import { PowerIcon, BellIcon } from '@heroicons/react/24/outline';
import Logo from '../logo';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/userContext';
export default function SideNav() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    setTimeout(() => {
      router.push('/');
    }, 1000)
  };
  return (
    <div className="flex h-full flex-col px-2 py-2 md:px-2 overflow-y-auto">
      {/* Logo Link */}
      <Link
        href="/"
        className="mb-1 lg-conf:mb-0 mt-2 flex h-20 items-end justify-start p-2 md:h-40 md:justify-center hover:animate-spin"
      >
        <Logo />
      </Link>

      <div className="flex grow flex-row space-x-2 md:flex-col md:space-x-0 md:space-y-2 flex-wrap sm:space-x-0 sm:space-y-2">
        <NavLinks />
      </div>
    </div>
  );
}

