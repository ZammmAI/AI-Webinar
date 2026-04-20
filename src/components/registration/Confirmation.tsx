import { Check, Sparkles, Clock } from 'lucide-react';
import { RegistrationFormData } from '../../lib/schema';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ConfirmationProps {
  data: RegistrationFormData & { isWaitlist?: boolean };
  onReset: () => void;
}

export function Confirmation({ data, onReset }: ConfirmationProps) {
  const isWaitlist = data.isWaitlist;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="pulse-glow max-w-2xl mx-auto"
    >
      <div className="bg-gradient-to-br from-slate-900/40 to-slate-900/90 backdrop-blur-xl border border-emerald-400/50 rounded-2xl p-12 shadow-2xl text-center">
        <div className="mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className={cn(
              "inline-flex items-center justify-center w-16 h-16 rounded-full border mb-4",
              isWaitlist 
                ? "bg-amber-500/20 border-amber-400/50" 
                : "bg-emerald-500/20 border-emerald-400/50"
            )}
          >
            {isWaitlist ? (
              <Clock className="w-8 h-8 text-amber-400" />
            ) : (
              <Check className="w-8 h-8 text-emerald-400" />
            )}
          </motion.div>
          
          <h2 className={cn(
            "text-3xl font-black mb-2 tracking-tight",
            isWaitlist ? "text-amber-400" : "text-emerald-400"
          )}>
            {isWaitlist ? "You're on the list!" : "Welcome Aboard!"}
          </h2>
          <p className="text-teal-100 text-lg font-light">
            {isWaitlist 
              ? "We've added you to the priority waitlist" 
              : "Your spot is secured for the AI Webinar"}
          </p>
        </div>

        <div className="bg-slate-800/60 border border-emerald-500/30 rounded-xl p-6 mb-8 text-left space-y-3">
          <div>
            <p className="text-teal-100/70 text-sm font-semibold uppercase tracking-widest text-[10px]">Attendee Name</p>
            <p className="text-emerald-300 text-lg font-bold">{data.name}</p>
          </div>
          <div>
            <p className="text-teal-100/70 text-sm font-semibold uppercase tracking-widest text-[10px]">Registry Status</p>
            <p className={cn(
              "text-lg font-bold uppercase",
              isWaitlist ? "text-amber-300" : "text-emerald-300"
            )}>
              {isWaitlist ? "Priority Waitlist" : "Confirmed Seat"}
            </p>
          </div>
        </div>

        <div className={cn(
          "rounded-xl p-6 mb-8 text-left border",
          isWaitlist 
            ? "bg-amber-500/10 border-amber-500/30" 
            : "bg-emerald-500/10 border-emerald-500/30"
        )}>
          <p className={cn(
            "font-black mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.2em]",
            isWaitlist ? "text-amber-200" : "text-emerald-200"
          )}>
            {isWaitlist ? '⏳ NEXT STEPS:' : '⚠️ IMPORTANT NOTE:'}
          </p>
          <p className="text-teal-50 text-sm leading-relaxed font-medium">
            {isWaitlist ? (
              <>
                You will be the <span className="text-amber-300 font-bold">FIRST</span> to receive the recording and invite for our next session. 
                Join our WhatsApp group below to stay in the loop!
              </>
            ) : (
              <>
                The Zoom link will be shared <span className="text-white font-black underline underline-offset-4 decoration-emerald-500">ONLY</span> through our private WhatsApp group. 
                Join now to ensure you don't miss the link!
              </>
            )}
          </p>
        </div>

        <div className="flex flex-col gap-4 mb-8">
          <a
            href={import.meta.env.VITE_WHATSAPP_LINK || "https://chat.whatsapp.com/LwJFKWYTY3e8ZtB02huyjU?mode=gi_t"}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "group relative flex items-center justify-center gap-3 font-black py-5 px-8 rounded-2xl shadow-xl transition-all active:scale-95 overflow-hidden text-white",
              isWaitlist 
                ? "bg-amber-600 hover:bg-amber-500 hover:shadow-amber-500/40" 
                : "bg-emerald-600 hover:bg-emerald-500 hover:shadow-emerald-500/40"
            )}
          >
            <div className={cn(
              "absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-[shimmer_2s_infinite]",
            )}></div>
            <Sparkles className={cn(
              "w-5 h-5 transition-transform group-hover:rotate-12",
              isWaitlist ? "text-amber-200" : "text-emerald-300"
            )} />
            <span className="text-lg uppercase tracking-wider">Join Official WhatsApp Group</span>
          </a>

          <a
            href={`https://wa.me/?text=I%20just%20secured%20my%20spot%20for%20the%20Free%20AI%20Webinar!%20Join%20the%20AOB%20community%20now!`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-teal-300 hover:text-teal-200 text-xs font-semibold py-2 transition-colors"
          >
            <Sparkles className="w-3 h-3" />
            Share with your tech circle
          </a>
        </div>

        <button
          onClick={onReset}
          className="w-full bg-slate-700/30 hover:bg-slate-700/50 text-teal-100/50 font-semibold py-3 px-4 rounded-lg text-[10px] uppercase tracking-widest transition-all border border-white/5"
        >
          Register Another Person
        </button>
      </div>
    </motion.div>
  );
}
