'use client';
import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import { PowerIcon,BellIcon } from '@heroicons/react/24/outline';
import Logo from '../logo';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/userContext';
export default function SideNav() {
  const {logout} = useAuth();
  const router = useRouter();

const handleLogout = () => {
    logout();
    setTimeout(()=>{
      router.push('/');
    },1000)
  };
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      {/* Logo Link */}
      <Link
        href="/"
        className="mb-1 mt-6 flex h-20 items-end justify-start p-6 md:h-40 md:justify-center"
      >
        <Logo />
      </Link>

      {/* Navigation Links and Spacer */}
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2 mt-3 flex-wrap sm:space-x-0 sm:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>

        {/* Logout Button */}
        <button className="flex h-[48px] w-full items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-green-100 hover:text-blue-600 md:justify-start md:p-2 md:px-3">
          <div className="relative flex items-center">
            <BellIcon className="w-6" />
            <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 flex items-center justify-center min-w-[18px] h-5 rounded-full bg-red-500 text-white text-xs font-bold">
              100
            </div>
          </div>
          <span className="hidden md:block">Notification</span>
        </button>

        <form>
          <button
            type="button"
            onClick={handleLogout}
            className="flex h-[48px] w-full items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-red-100 hover:text-blue-600 md:justify-start md:p-2 md:px-3"
          >
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Se déconnecter</div>
          </button>
        </form>
      </div>
    </div>
  );
}

