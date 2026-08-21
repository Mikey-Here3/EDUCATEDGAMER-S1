'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_LINKS } from '@/lib/constants';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
        scrolled 
          ? 'bg-black/85 backdrop-blur-md border-red-500/30 shadow-[0_0_20px_rgba(220,38,38,0.2)]'
          : 'bg-transparent border-transparent'
      )}
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-heading font-bold text-xl sm:text-2xl tracking-wider text-white text-glow">
            EDUCATED GAMER
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-5">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            const isContribute = link.href === '/contribute';

            if (isContribute) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all hover:scale-105"
                >
                  <Heart className="w-3.5 h-3.5 fill-white text-white" />
                  <span>Contribute</span>
                </Link>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:text-[#DC2626] relative group',
                  isActive ? 'text-[#DC2626]' : 'text-gray-300'
                )}
              >
                {link.label}
                <span className={cn(
                  "absolute -bottom-2 left-0 h-[2px] bg-[#DC2626] transition-all duration-300",
                  isActive ? "w-full" : "w-0 group-hover:w-full"
                )} />
              </Link>
            );
          })}

          <Link
            href="/login"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-xs font-bold hover:bg-white/10 hover:text-white transition-all ml-1"
          >
            Sign In
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-3">
          <Link
            href="/contribute"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-600 text-white font-black text-[10px] uppercase tracking-wider shadow-md"
          >
            <Heart className="w-3 h-3 fill-white text-white" />
            <span>Contribute</span>
          </Link>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="text-white hover:text-red-500 transition-colors cursor-pointer p-1">
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#050507]/95 backdrop-blur-xl border-l-white/10 text-white">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col gap-6 mt-12">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'text-lg font-bold uppercase tracking-wider transition-colors flex items-center gap-2',
                        isActive ? 'text-[#DC2626]' : 'text-gray-300 hover:text-[#DC2626]'
                      )}
                    >
                      {link.href === '/contribute' && <Heart className="w-4 h-4 text-red-500 fill-red-500" />}
                      {link.label}
                    </Link>
                  );
                })}
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-bold uppercase tracking-wider text-red-400 hover:text-red-300 pt-4 border-t border-white/10"
                >
                  Sign In
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
