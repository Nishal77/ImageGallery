'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "../../components/ui/button";
import { usePathname } from 'next/navigation';
import { useState } from 'react';

type UserRole = 'admin' | 'user' | null;

export default function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole>(null);

  // Don't render if we're on the login page
  if (pathname === '/login') {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto px-6 py-4 max-w-6xl">
        <div className="bg-black/20 backdrop-blur-xl rounded-full border border-white/10">
          <div className="flex items-center justify-between px-4 py-2.5">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/icon.png"
                alt="SentiaGallery Logo"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-2xl font-semibold text-white">
                SentiaGallery
              </span>
            </Link>

            {/* Navigation Links - Only show when logged in */}
            {isLoggedIn && (
              <nav className="hidden md:flex items-center space-x-8">
                <Link href={userRole === 'admin' ? '/admin/dashboard' : '/dashboard'} 
                  className="text-sm font-medium text-white hover:text-blue-400 transition-colors">
                  Dashboard
                </Link>
                <Link href={userRole === 'admin' ? '/admin/galleries' : '/galleries'} 
                  className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                  Galleries
                </Link>
                {userRole === 'admin' && (
                  <Link href="/admin/users" 
                    className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                    Users
                  </Link>
                )}
                <Link href="/about" 
                  className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                  About
                </Link>
              </nav>
            )}

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <div className="flex items-center gap-4">
                  {/* User Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                    {userRole === 'admin' ? 'A' : 'U'}
                  </div>
                  {/* Logout Button */}
                  <Button 
                    onClick={() => {
                      setIsLoggedIn(false);
                      setUserRole(null);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button asChild className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6">
                  <Link href="/login">Login</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 