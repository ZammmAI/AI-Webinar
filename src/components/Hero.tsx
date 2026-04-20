import { Sparkles, Calendar, Clock, Users, Zap } from 'lucide-react';

export function Hero() {
  return (
    <div className="flex flex-col justify-center space-y-6">
      {/* Event Badge */}
      <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-2 w-fit">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-emerald-300 text-xs font-bold uppercase tracking-widest">Free Event · Limited Seats</span>
      </div>

      {/* Title */}
      <div>
        <p className="text-emerald-400/70 text-sm font-semibold uppercase tracking-widest mb-2">Sri Lanka's Premier</p>
        <h1 className="text-5xl font-black leading-tight mb-1">
          <span className="gradient-text">AI FREE</span>
          <br />
          <span className="text-white">WEBINAR</span>
          <span className="text-emerald-400"> 2026</span>
        </h1>
        <p className="text-teal-100/60 text-base font-light mt-3 leading-relaxed">
          A live session to explore what AI really means for your career — and what you can start doing about it today.
        </p>
      </div>

      {/* Event Details */}
      <div className="bg-slate-800/50 border border-emerald-500/20 rounded-2xl p-5 space-y-3 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-teal-100/50 text-[10px] uppercase tracking-widest font-bold">Date</p>
            <p className="text-white font-semibold text-sm">Sunday, April 26th 2026</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-teal-100/50 text-[10px] uppercase tracking-widest font-bold">Time</p>
            <p className="text-white font-semibold text-sm">8:00 PM Sri Lanka Time (IST)</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-teal-100/50 text-[10px] uppercase tracking-widest font-bold">Platform</p>
            <p className="text-white font-semibold text-sm">Zoom · Only 100 Participants</p>
            <p className="text-emerald-400/60 text-[10px] mt-0.5">Link shared via WhatsApp group only</p>
          </div>
        </div>
      </div>

      {/* What You'll Learn */}
      <div className="space-y-3">
        {[
          { icon: Zap, text: "How AI is changing tech careers right now" },
          { icon: Sparkles, text: "Real tools to use from day one — no fluff" },
          { icon: Sparkles, text: "Live Q&A with the AOB team" },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <item.icon className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <p className="text-teal-100/80 text-sm">{item.text}</p>
          </div>
        ))}
      </div>

      {/* Powered by AOB */}
      <div className="pt-5 border-t border-white/10">
        <p className="text-white/25 text-[8px] uppercase tracking-[0.4em] font-bold mb-3 text-center">Powered by</p>
        <div className="flex flex-col items-center gap-3 bg-black/20 border border-white/5 rounded-xl px-4 py-4 backdrop-blur-sm">
          <img
            src="/aob-logo.png"
            alt="Academy of Billionaires"
            className="h-14 w-auto object-contain drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]"
          />
          <div className="flex flex-col items-center text-center">
            <p
              className="text-[10px] font-semibold tracking-[0.3em] text-white/70 leading-none mb-1"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              ACADEMY OF
            </p>
            <p
              className="text-white font-bold tracking-[0.15em] leading-none text-xl"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              BILLIONAIRES
            </p>
            <p
              className="text-amber-400/50 text-[8px] tracking-[0.3em] font-medium mt-1.5 leading-none"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              EDUCATE · ELEVATE · DOMINATE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
