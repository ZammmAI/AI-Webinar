import { useState } from 'react';
import { Hero } from '../components/Hero';
import { RegistrationForm } from '../components/registration/RegistrationForm';
import { Confirmation } from '../components/registration/Confirmation';
import { RegistrationFormData } from '../lib/schema';

export function HomePage() {
  const [submittedData, setSubmittedData] = useState<RegistrationFormData | null>(null);

  const handleSuccess = (data: RegistrationFormData) => {
    setSubmittedData(data);
  };

  const handleReset = () => {
    setSubmittedData(null);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 flex items-center justify-center p-4 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-[float_4s_ease-in-out_infinite]"></div>
        <div className="absolute -bottom-32 left-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-[shimmer_3s_ease-in-out_infinite]"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        {!submittedData ? (
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <Hero />
            <RegistrationForm onSuccess={handleSuccess} />
          </div>
        ) : (
          <Confirmation data={submittedData} onReset={handleReset} />
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        .gradient-text {
          background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.1); }
          50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.3); }
        }
      `}</style>
    </div>
  );
}
