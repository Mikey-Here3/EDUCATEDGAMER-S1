'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const DEFAULT_FAQS = [
  { q: 'How do I register my team?', a: 'Click Register in the navigation, fill in your team details, 4 player UIDs, and submit. Confirm payment of 100 Rs entry fee via EasyPaisa/JazzCash after registration.' },
  { q: 'How many teams can participate?', a: 'Only 12 teams are allowed. Teams that register after the 12 slots are filled are placed on the Waiting List automatically.' },
  { q: 'What happens if a team drops out?', a: 'If a confirmed team withdraws, the next team on the Waiting List is automatically promoted and gets to play.' },
  { q: 'What is the prize for winning?', a: 'The winning team receives 1000 Rs. The player with the Most Kills (MVP) receives 100 Rs, and an additional 100 Rs is awarded as a Giveaway!' },
  { q: 'How will we receive the prize money?', a: 'Prize distribution is handled immediately after match verification via EasyPaisa, JazzCash, or Bank Transfer.' },
  { q: 'Where do we get the Custom Room ID?', a: 'Room ID and password are shared via our official Discord server 15 minutes before the match starts. Make sure you have joined the Discord.' },
  { q: 'Is emulator or PC play allowed?', a: 'No. Only mobile device players are allowed. PC emulators, hardware triggers, and auto-fire tools are strictly prohibited.' },
];

function FAQItem({ faq, index }: { faq: any, index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div initial={{ opacity:0, y:15 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: index*0.07 }}
      className="border border-white/5 hover:border-[#DC2626]/30 rounded-xl overflow-hidden transition-colors">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left bg-[#0a0a0f] hover:bg-black/60 transition-colors">
        <span className="font-bold text-white text-sm">{faq.q}</span>
        <ChevronDown className={`w-5 h-5 text-[#DC2626] flex-shrink-0 transition-transform duration-300 ${open?'rotate-180':''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:0.3 }} className="overflow-hidden">
            <div className="p-5 pt-0 bg-[#0a0a0f]">
              <p className="text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">{faq.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FaqSection({ faqs }: { faqs?: any[] }) {
  const items = faqs && faqs.length > 0 ? faqs : DEFAULT_FAQS;
  return (
    <section id="faq" className="py-24 px-4 relative z-20">
      <div className="max-w-3xl mx-auto space-y-8">
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="text-center space-y-3">
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white">
            Frequently <span className="text-[#DC2626]">Asked</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#DC2626] to-transparent mx-auto rounded-full" />
        </motion.div>
        <div className="space-y-3">
          {items.map((faq, i) => <FAQItem key={i} faq={faq} index={i} />)}
        </div>
      </div>
    </section>
  );
}
