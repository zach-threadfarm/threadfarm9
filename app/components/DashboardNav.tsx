"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusCircle, Settings } from 'lucide-react';

export default function DashboardNav() {
  const pathname = usePathname();
  return (
    <aside className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col py-8 px-6 fixed top-0 left-0 z-20">
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-[#1a7f37] rounded-lg w-10 h-10 flex items-center justify-center">
          <span className="text-white text-2xl font-bold">t</span>
        </div>
        <span className="text-[#1a7f37] text-2xl font-bold">ThreadFarm</span>
      </div>
      <nav className="flex flex-col gap-2 mt-4">
        <Link href="/dashboard">
          <div className={`flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium transition-colors cursor-pointer ${pathname === '/dashboard' ? 'bg-[#f7f8f4] text-[#1a7f37]' : 'text-black/80 hover:bg-[#f7f8f4]'}`}> 
            <Home size={20} />
            Dashboard
          </div>
        </Link>
        <Link href="/create">
          <div className={`flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium transition-colors cursor-pointer ${pathname === '/create' ? 'bg-[#f7f8f4] text-[#1a7f37]' : 'text-black/80 hover:bg-[#f7f8f4]'}`}> 
            <PlusCircle size={20} />
            Create Thread
          </div>
        </Link>
        <Link href="/settings">
          <div className={`flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium transition-colors cursor-pointer ${pathname === '/settings' ? 'bg-[#f7f8f4] text-[#1a7f37]' : 'text-black/80 hover:bg-[#f7f8f4]'}`}> 
            <Settings size={20} />
            Settings
          </div>
        </Link>
      </nav>
    </aside>
  );
} 