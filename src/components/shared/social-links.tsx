import { PlaySquare, Users, MessageCircle, MessageSquare } from 'lucide-react';
import { SOCIAL_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface SocialLinksProps {
  layout?: 'horizontal' | 'vertical';
  className?: string;
}

export function SocialLinks({ layout = 'horizontal', className }: SocialLinksProps) {
  const links = [
    { name: 'YouTube', url: SOCIAL_LINKS.youtube, icon: 'youtube' },
    { name: 'TikTok', url: SOCIAL_LINKS.tiktok, icon: 'tiktok' },
    { name: 'Facebook', url: SOCIAL_LINKS.facebook, icon: 'facebook' },
    { name: 'Discord', url: SOCIAL_LINKS.discord, icon: 'discord' },
  ];

  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'youtube': return <PlaySquare className="w-5 h-5" />;
      case 'facebook': return <Users className="w-5 h-5" />;
      case 'tiktok': return <MessageCircle className="w-5 h-5" />;
      case 'discord': return <MessageSquare className="w-5 h-5" />;
      default: return <PlaySquare className="w-5 h-5" />;
    }
  };

  return (
    <div className={cn(
      'flex gap-4',
      layout === 'vertical' ? 'flex-col' : 'flex-row items-center',
      className
    )}>
      {links.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit our ${link.name}`}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 transition-all duration-300 hover:bg-primary/20 hover:text-primary hover:border-primary/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]"
        >
          {getIcon(link.icon || link.name)}
        </a>
      ))}
    </div>
  );
}

export default SocialLinks;
