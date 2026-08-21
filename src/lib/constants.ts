export const TOURNAMENT_ID = 'a0000000-0000-0000-0000-000000000001';

export const SITE_CONFIG = {
  name: 'Educated Gamer',
  description: 'Free Fire Tournament - 12 Teams, One Champion',
  email: 'ASHANMIROFFICIAL@GMAIL.COM',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://educatedgamer.com',
} as const;

export const NAV_LINKS = [
  { href: '/#overview', label: 'Overview' },
  { href: '/standings', label: 'Standings' },
  { href: '/teams', label: 'Teams' },
  { href: '/register', label: 'Register' },
  { href: '/contribute', label: 'Contribute' },
  { href: '/#rules', label: 'Rules' },
  { href: '/contact', label: 'Contact' },
] as const;

export const SOCIAL_LINKS = {
  whatsapp: 'https://chat.whatsapp.com/IS43tYX1KOE6Xe4AgJ2dwt',
  contributionWhatsapp: 'https://wa.me/923190799711?text=Hi%2C%20main%20Educated%20Gamer%20tournament%20mein%20contribute%20karna%20chahta%20hoon',
  contributionNumber: '03190799711',
  discord: 'https://discord.gg/bE2Cta8q',
  youtube: 'https://youtube.com/@educatedgamer3',
  tiktok: 'https://tiktok.com/@educatedgamer3',
  facebook: 'https://facebook.com/EducatedGamer3',
} as const;

export const TOURNAMENT_MAPS = [
  { name: 'Bermuda', desc: 'Classic Battle Royale Map' },
  { name: 'Purgatory', desc: 'Tactical Valley BR Map' },
  { name: 'Solara', desc: 'High-Tech Combat Arena Map' },
  { name: 'NexTerra', desc: 'Futuristic Sci-Fi BR Map' },
  { name: 'Kalahari', desc: 'Desert Battle Royale Map' },
] as const;

export const PAYMENT_METHODS = {
  jazzcash: { 
    title: 'JazzCash (Only)', 
    account: '03137076789', 
    name: 'Akash Akhtar' 
  },
  fee: '100 PKR',
} as const;

export const TEAM_STATUSES = {
  pending: { label: 'Pending', color: 'yellow' },
  approved: { label: 'Approved', color: 'green' },
  rejected: { label: 'Rejected', color: 'red' },
  cancelled: { label: 'Cancelled', color: 'gray' },
} as const;

export const MAX_TEAMS = 12;
