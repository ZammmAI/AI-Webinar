import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

export function SeatCounter() {
  const [count, setCount] = useState<number | null>(null);
  const TOTAL_SEATS = 100;

  useEffect(() => {
    async function fetchCount() {
      try {
        const { count: dbCount, error } = await supabase
          .from('webinar_registrations')
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.error('Supabase fetch error:', error);
          setCount(0); // Safe fallback to 0
          return;
        }

        setCount(dbCount ?? 0);
      } catch (err) {
        console.error('Connection failed:', err);
        setCount(0);
      }
    }

    fetchCount();
    
    // Live Real-time Subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'webinar_registrations',
        },
        () => {
          setCount(prev => (prev !== null ? prev + 1 : 1));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const seatsLeft = count !== null ? Math.max(0, TOTAL_SEATS - count) : null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="mt-6 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <Users className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-slate-900 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
        </div>
        <div>
          <p className="text-white font-black text-xs md:text-sm uppercase tracking-[0.15em] leading-none mb-1">
            Only Limited Seats
          </p>
          <p className="text-emerald-400/60 text-[9px] uppercase tracking-widest font-black">Exclusive AOB Access</p>
        </div>
      </div>

      <div className="text-right flex flex-col items-end">
        <div className="flex items-baseline gap-1">
          <AnimatePresence mode="wait">
            <motion.span
              key={count}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-emerald-400 font-black text-2xl md:text-3xl leading-none tracking-tighter"
            >
              {count === null ? '...' : Math.max(0, TOTAL_SEATS - count)}
            </motion.span>
          </AnimatePresence>
          <span className="text-teal-100/40 text-[10px] font-bold uppercase tracking-tighter">Spots</span>
        </div>
        <p className="text-teal-100/30 text-[8px] uppercase tracking-widest font-bold">Left Now</p>
      </div>
    </motion.div>
  );
}
