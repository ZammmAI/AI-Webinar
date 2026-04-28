import { Users } from 'lucide-react';
import { motion } from 'framer-motion';


export function SeatCounter() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="mt-6 p-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-emerald-500/10 border border-emerald-400/20 rounded-2xl flex items-center gap-4 shadow-[0_18px_40px_rgba(16,185,129,0.08)]"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-emerald-400/15 flex items-center justify-center border border-emerald-300/25 shadow-inner">
            <Users className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-slate-900 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
        </div>
        <div>
          <p className="text-white font-black text-xs md:text-sm uppercase tracking-[0.15em] leading-none mb-1">
            Only Limited Seats
          </p>
          <p className="text-emerald-300/70 text-[9px] uppercase tracking-widest font-black">Exclusive AOB Access</p>
        </div>
      </div>
    </motion.div>
  );
}
