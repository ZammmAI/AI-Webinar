import { Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <div className="hidden md:flex flex-col justify-center space-y-6">
      <div>
        <h1 className="text-5xl font-black gradient-text mb-2">AI Webinar</h1>
        <p className="text-emerald-100 text-lg font-light">
          Transform your future with cutting-edge AI technology
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
          <p className="text-teal-50">Expert trainers from Sri Lanka's tech community</p>
        </div>
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
          <p className="text-teal-50">Live interactive sessions & networking</p>
        </div>
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
          <p className="text-teal-50">Exclusive resources for Sri Lankan developers</p>
        </div>
      </div>

      <div className="pt-4 border-t border-emerald-500/30">
        <p className="text-sm text-emerald-100/70 font-light">
          Limited to 500 seats • Only for serious learners
        </p>
      </div>
    </div>
  );
}
