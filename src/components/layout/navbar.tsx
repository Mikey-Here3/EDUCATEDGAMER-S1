'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
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
          ? 'bg-black/80 backdrop-blur-md border-primary/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
          : 'bg-transparent border-transparent'
      )}
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-heading font-bold text-2xl tracking-wider text-white text-glow">
            EDUCATED GAMER
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {[
            { href: '/#overview', label: 'Overview' },
            { href: '/#rules', label: 'Rules' },
            { href: '/#standings', label: 'Standings' },
            { href: '/teams', label: 'Teams' },
            { href: '/register', label: 'Register' },
            { href: '/#faq', label: 'FAQ' },
            { href: '/contact', label: 'Contact' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium uppercase tracking-wider transition-all duration-300 hover:text-[#DC2626] relative group',
                pathname === link.href ? 'text-[#DC2626]' : 'text-gray-300'
              )}
            >
              {link.label}
              <span className="absolute -bottom-2 left-0 h-[2px] bg-[#DC2626] transition-all duration-300 w-0 group-hover:w-full" />
            </Link>
          ))}
          <Link
            href="/login"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#DC2626]/10 border border-[#DC2626]/30 text-[#DC2626] text-sm font-bold hover:bg-[#DC2626]/20 hover:border-[#DC2626] transition-all"
          >
            Sign In
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="text-white hover:text-primary transition-colors cursor-pointer">
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="right" className="bg-background/95 backdrop-blur-xl border-l-primary/30">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="flex flex-col gap-6 mt-12">
                {NAV_LINKS?.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'text-lg font-medium uppercase tracking-wider transition-colors',
                        isActive ? 'text-primary text-glow' : 'text-gray-300 hover:text-primary'
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
