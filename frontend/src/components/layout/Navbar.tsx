'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { user, logout, checkAuth, isInitialized } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center pt-2">
              <img src="/logo.png" alt="SevaSetu Logo" className="h-20 w-auto object-contain" />
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Home
              </Link>
              <Link href="/organizations" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                NGOs & Temples
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {!isInitialized ? null : user ? (
              <>
                {user.role === 'admin' ? (
                  <Link href="/admin" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                    Admin Panel
                  </Link>
                ) : (
                  <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="bg-orange-50 hover:bg-orange-100 text-orange-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link href="/register" className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Register Org
                </Link>
              </>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden bg-white border-t border-gray-200">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300">
              Home
            </Link>
            <Link href="/organizations" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300">
              NGOs & Temples
            </Link>
            
            {user ? (
              <>
                <Link href={user.role === 'admin' ? '/admin' : '/dashboard'} className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300">
                  {user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                </Link>
                <button onClick={logout} className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-red-600 hover:text-red-800 hover:bg-gray-50 hover:border-gray-300">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300">
                  Login
                </Link>
                <Link href="/register" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300">
                  Register Org
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
