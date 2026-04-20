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

        <div className="bg-teal-500/10 border border-teal-400/30 rounded-xl p-6 mb-8">
          <p className="text-teal-100 font-light mb-4">
            Check your email for webinar details and joining instructions. We'll see you soon!
          </p>
          <p className="text-sm text-emerald-300">
            Share with fellow Sri Lankan tech enthusiasts
          </p>
        </div>

        <a
          href={`https://wa.me/?text=I%20just%20registered%20for%20the%20Free%20AI%20Webinar%20in%20Sri%20Lanka!%20Join%20me!%20Limited%20spots%20available!`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold py-3 px-6 rounded-lg text-sm uppercase tracking-wider transition-all hover:shadow-lg hover:shadow-green-500/50 mb-6"
        >
          <Sparkles className="w-4 h-4" />
          Share on WhatsApp
        </a>

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
