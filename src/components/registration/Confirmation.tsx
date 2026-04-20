import { CheckCircle2, Sparkles } from 'lucide-react';
import { RegistrationFormData } from '../../lib/schema';

interface ConfirmationProps {
  data: RegistrationFormData;
  onReset: () => void;
}

export function Confirmation({ data, onReset }: ConfirmationProps) {
  return (
    <div className="pulse-glow max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900/90 backdrop-blur-xl border border-emerald-400/50 rounded-2xl p-12 shadow-2xl text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/50 mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-black gradient-text mb-2">Welcome Aboard!</h2>
          <p className="text-teal-100 text-lg font-light">
            Your spot is reserved for the AI Webinar
          </p>
        </div>

        <div className="bg-slate-800/60 border border-emerald-500/30 rounded-xl p-6 mb-8 text-left space-y-3">
          <div>
            <p className="text-teal-100/70 text-sm font-semibold">Name</p>
            <p className="text-emerald-300 text-lg font-medium">{data.name}</p>
          </div>
          <div>
            <p className="text-teal-100/70 text-sm font-semibold">Email</p>
            <p className="text-emerald-300 text-lg font-medium">{data.email}</p>
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 mb-8 text-left">
          <p className="text-amber-200 font-bold mb-2 flex items-center gap-2">
            ⚠️ Important Note:
          </p>
          <p className="text-teal-100 text-sm leading-relaxed">
            The webinar will be hosted on <span className="text-white font-bold">Zoom</span>.
            Your Zoom link will be shared <span className="text-emerald-300 font-bold">ONLY</span> through our private WhatsApp group — not via email.
            <br /><br />
            <span className="text-emerald-400 font-semibold italic">Limited to the first 100 participants. Join the group now to get your link!</span>
          </p>
        </div>

        <div className="flex flex-col gap-4 mb-8">
          <a
            href="https://chat.whatsapp.com/LwJFKWYTY3e8ZtB02huyjU?mode=gi_t"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 px-8 rounded-2xl shadow-xl hover:shadow-emerald-500/40 transition-all active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/30 to-emerald-400/0 -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
            <Sparkles className="w-5 h-5 text-emerald-300 group-hover:rotate-12 transition-transform" />
            <span className="text-lg uppercase tracking-wider">Join Official WhatsApp Group</span>
          </a>

          <a
            href={`https://wa.me/?text=I%20just%20registered%20for%20the%20Free%20AI%20Webinar%20in%20Sri%20Lanka!%20Join%20me!%20Limited%20to%20100%20spots!`}
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
          className="w-full bg-slate-700/50 hover:bg-slate-600/50 text-teal-100 font-semibold py-3 px-4 rounded-lg text-sm transition-all border border-teal-500/30 hover:border-teal-400/50"
        >
          Register Another Person
        </button>
      </div>
    </div>
  );
}
