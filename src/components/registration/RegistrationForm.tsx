import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  ArrowRight, 
  Loader2, 
  Code, 
  Palette, 
  Lightbulb, 
  GraduationCap, 
  Briefcase, 
  User 
} from 'lucide-react';
import { registrationSchema, RegistrationFormData } from '../../lib/schema';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface RegistrationFormProps {
  onSuccess: (data: RegistrationFormData) => void;
}

const ROLES = [
  { id: 'developer', label: 'Developer', icon: Code },
  { id: 'designer', label: 'Designer', icon: Palette },
  { id: 'entrepreneur', label: 'Founder', icon: Lightbulb },
  { id: 'student', label: 'Student', icon: GraduationCap },
  { id: 'manager', label: 'Manager', icon: Briefcase },
  { id: 'other', label: 'Other', icon: User },
] as const;

export function RegistrationForm({ onSuccess }: RegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      role: 'developer',
    }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    console.log('Submitting enrollment data:', data);
    try {
      const { error } = await supabase
        .from('webinar_registrations')
        .insert([data]);

      if (error) {
        console.error('Supabase insertion error:', error);
        throw error;
      }

      toast.success('Registration successful! Welcome aboard.');
      onSuccess(data);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.error(`Submission failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-8 shadow-2xl pulse-glow"
    >
      <h2 className="text-2xl font-black gradient-text mb-6">Secure Your Spot</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4 }}
        >
          <label className="block text-teal-100 text-xs font-bold uppercase tracking-widest mb-2 opacity-70">
            Full Name
          </label>
          <input
            {...register('name')}
            className={cn(
              "w-full bg-slate-700/30 border border-emerald-500/20 text-teal-50 px-4 py-3 rounded-xl text-sm placeholder-teal-400/30 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10 transition-all backdrop-blur-sm",
              errors.name && "border-red-500/50 focus:ring-red-500/10"
            )}
            placeholder="Amal Silva"
          />
          {errors.name && <p className="text-red-400 text-[10px] mt-1 font-bold uppercase tracking-tighter">{errors.name.message}</p>}
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5 }}
        >
          <label className="block text-teal-100 text-xs font-bold uppercase tracking-widest mb-2 opacity-70">
            Email Address
          </label>
          <input
            {...register('email')}
            type="email"
            className={cn(
              "w-full bg-slate-700/30 border border-emerald-500/20 text-teal-50 px-4 py-3 rounded-xl text-sm placeholder-teal-400/30 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10 transition-all backdrop-blur-sm",
              errors.email && "border-red-500/50 focus:ring-red-500/10"
            )}
            placeholder="amal@colombo.tech"
          />
          {errors.email && <p className="text-red-400 text-[10px] mt-1 font-bold uppercase tracking-tighter">{errors.email.message}</p>}
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.6 }}
          >
            <label className="block text-teal-100 text-xs font-bold uppercase tracking-widest mb-2 opacity-70">
              Age
            </label>
            <input
              {...register('age')}
              type="number"
              className={cn(
                "w-full bg-slate-700/30 border border-emerald-500/20 text-teal-50 px-4 py-3 rounded-xl text-sm placeholder-teal-400/30 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10 transition-all backdrop-blur-sm",
                errors.age && "border-red-500/50 focus:ring-red-500/10"
              )}
              placeholder="28"
            />
            {errors.age && <p className="text-red-400 text-[10px] mt-1 font-bold uppercase tracking-tighter">{errors.age.message}</p>}
          </motion.div>
          <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.6 }}
          >
            <label className="block text-teal-100 text-xs font-bold uppercase tracking-widest mb-2 opacity-70">
              Phone (LK)
            </label>
            <input
              {...register('phone')}
              type="tel"
              className={cn(
                "w-full bg-slate-700/30 border border-emerald-500/20 text-teal-50 px-4 py-3 rounded-xl text-sm placeholder-teal-400/30 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10 transition-all backdrop-blur-sm",
                errors.phone && "border-red-500/50 focus:ring-red-500/10"
              )}
              placeholder="+94 701 234567"
            />
            {errors.phone && <p className="text-red-400 text-[10px] mt-1 font-bold uppercase tracking-tighter">{errors.phone.message}</p>}
          </motion.div>
        </div>

        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.7 }}
        >
          <label className="block text-teal-100 text-xs font-bold uppercase tracking-widest mb-3 opacity-70 text-center">
            Identify Your Journey
          </label>
          <div className="grid grid-cols-3 gap-2">
            {ROLES.map((role) => {
              const Icon = role.icon;
              const isActive = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setValue('role', role.id)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-300 group relative overflow-hidden",
                    isActive 
                      ? "bg-emerald-500/20 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
                      : "bg-slate-700/20 border-emerald-500/10 hover:border-emerald-500/30 hover:bg-slate-700/40"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5 transition-transform group-hover:scale-110",
                    isActive ? "text-emerald-400" : "text-teal-100/50"
                  )} />
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-tighter",
                    isActive ? "text-emerald-300" : "text-teal-100/30"
                  )}>
                    {role.label}
                  </span>
                  {isActive && (
                    <div className="absolute top-0 right-0 p-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <input type="hidden" {...register('role')} />
          {errors.role && <p className="text-red-400 text-[10px] mt-2 text-center uppercase font-bold">{errors.role.message}</p>}
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="group w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-slate-900 font-black py-4 px-4 rounded-xl text-xs uppercase tracking-[0.2em] transition-all hover:shadow-2xl hover:shadow-emerald-500/40 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Secure Seat Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </motion.button>
      </form>

      <p className="text-center text-teal-300/60 text-xs mt-6 font-light">
        Secure • Spam-free • Sri Lankan community
      </p>
    </motion.div>
  );
}
