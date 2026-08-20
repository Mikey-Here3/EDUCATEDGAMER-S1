import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { PageHeader } from '@/components/shared/page-header'
import { createClient } from '@/lib/supabase/server'
import { TOURNAMENT_ID } from '@/lib/constants'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default async function RulesPage() {
  const supabase = await createClient()

  const { data: tournament } = await supabase
    .from('tournaments')
    .select('settings')
    .eq('id', TOURNAMENT_ID)
    .single()

  // Parse rules or use empty array
  let rules: { title: string; content: string }[] = []
  
  try {
    if (tournament?.settings?.rules) {
      rules = typeof tournament.settings.rules === 'string' 
        ? JSON.parse(tournament.settings.rules)
        : tournament.settings.rules
    }
  } catch (e) {
    console.error('Failed to parse rules:', e)
  }

  const defaultRules = [
    { title: '1. Tournament Format & Rules', content: 'Matches are played in custom limited ammo rooms with competitive Battle Royale settings on Bermuda map. 12 confirmed teams will compete.' },
    { title: '2. Entry Fee & Rewards', content: 'Entry fee is 100 Rs per team. The winning team will receive 1500 Rs. The player with the most kills (MVP) will receive 100 Rs. 20X REWARD!' },
    { title: '3. Waiting List Policy', content: 'Only the first 12 teams will be confirmed. If any of the confirmed 12 teams fail to show up, the next teams in the waiting list will get the chance to play.' },
    { title: '4. Device & Hardware Restrictions', content: 'Only mobile device players are allowed. PC emulators, modified clients, hardware triggers, and auto-fire tools are strictly banned.' },
    { title: '5. Custom Room Information', content: 'Room ID and password will be shared in Discord 15 minutes before the match start. Teams must join within the specified time window.' },
    { title: '6. Fair Play & Disqualification', content: 'Any form of cheating, toxic behavior, teaming up, or failure to join on time will result in instant disqualification and permanent ban.' },
  ];

  const displayRules = rules && rules.length > 0 ? rules : defaultRules;

  return (
    <div className="min-h-screen flex flex-col bg-[#050507] text-white">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-16">
        <PageHeader 
          title="ESPORTS RULES & GUIDELINES" 
          subtitle="Please read carefully. All participants must abide by these rules." 
        />
        
        <div className="max-w-4xl mx-auto mt-12">
          <Accordion className="w-full space-y-4">
            {displayRules.map((rule, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-[#0a0a0f] border border-white/10 hover:border-[#DC2626]/40 rounded-xl px-6 py-2 transition-colors"
              >
                <AccordionTrigger className="text-base font-black text-white hover:text-[#DC2626] uppercase tracking-wide">
                  {rule.title}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap pt-2 pb-6">
                  {rule.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
