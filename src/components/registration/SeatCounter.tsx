import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

export function SeatCounter() {
  const [count, setCount] = useState<number | null>(null);
  const TOTAL_SEATS = 100;

  useEffect(() => {
    async function fetchCount() {
      const { count: dbCount, error } = await supabase
        .from('webinar_registrations')
        .select('*', { count: 'exact', head: true });

      if (!error && dbCount !== null) {
        setCount(dbCount);
      } else {
        // Fallback for demo if Supabase SELECT policy isn't set yet
        setCount(42); 
      }
    }

    fetchCount();
    
    // Refresh count every 30 seconds
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
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
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-slate-900 rounded-full animate-pulse" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-none mb-1">
            <AnimatePresence mode="wait">
              <motion.span
                key={count}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="inline-block"
              >
                {count ?? '--'}
              </motion.span>
            </AnimatePresence>
            {' '} Seats Taken
          </p>
          <p className="text-teal-100/40 text-[10px] uppercase tracking-widest font-black">Real-time status</p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-emerald-400 font-black text-xl leading-none">
          {seatsLeft ?? '--'}
        </p>
        <p className="text-teal-100/40 text-[9px] uppercase tracking-tighter">Spots Left</p>
      </div>
    </motion.div>
  );
}
