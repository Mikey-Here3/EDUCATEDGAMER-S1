import Link from 'next/link';
import { NAV_LINKS, SITE_CONFIG } from '@/lib/constants';
import SocialLinks from '@/components/shared/social-links';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#020204] border-t border-primary/20 relative mt-20">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-heading font-bold text-2xl text-white mb-4 text-glow">
              {SITE_CONFIG?.name || 'EDUCATED GAMER'}
            </h3>
            <p className="text-gray-400 max-w-sm mb-6">
              {SITE_CONFIG?.description || 'Premium Free Fire Esports Tournament experience.'}
            </p>
            <SocialLinks layout="horizontal" />
          </div>
          
          <div>
            <h4 className="font-heading text-lg text-white mb-4">Tournament</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#overview" className="text-gray-400 hover:text-[#DC2626] transition-colors">Overview</Link></li>
              <li><Link href="/#rules" className="text-gray-400 hover:text-[#DC2626] transition-colors">Esports Rules</Link></li>
              <li><Link href="/#standings" className="text-gray-400 hover:text-[#DC2626] transition-colors">Standings & Leaderboard</Link></li>
              <li><Link href="/register" className="text-gray-400 hover:text-[#DC2626] transition-colors">Register Squad</Link></li>
              <li><Link href="/#faq" className="text-gray-400 hover:text-[#DC2626] transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-lg text-white mb-4">Portals</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="text-gray-400 hover:text-[#DC2626] transition-colors">Player Sign In</Link></li>
              <li><Link href="/admin/login" className="text-[#DC2626] font-bold hover:underline transition-colors">Admin Portal →</Link></li>
              <li><Link href="/rules" className="text-gray-400 hover:text-[#DC2626] transition-colors">Detailed Guidelines</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-[#DC2626] transition-colors">Support & Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} {SITE_CONFIG?.name || 'Educated Gamer'}. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs mt-2 md:mt-0">
            Powered by next-gen esports infrastructure.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
