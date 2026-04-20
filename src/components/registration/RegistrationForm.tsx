import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Loader2 } from 'lucide-react';
import { registrationSchema, RegistrationFormData } from '../../lib/schema';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

interface RegistrationFormProps {
  onSuccess: (data: RegistrationFormData) => void;
}

export function RegistrationForm({ onSuccess }: RegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      role: 'developer',
    }
  });

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('webinar_registrations')
        .insert([data]);

      if (error) throw error;

      toast.success('Registration successful! Welcome aboard.');
      onSuccess(data);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.error(error.message || 'Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-8 shadow-2xl pulse-glow">
      <h2 className="text-2xl font-black gradient-text mb-6">Secure Your Spot</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-teal-100 text-sm font-semibold mb-2">
            Full Name
          </label>
          <input
            {...register('name')}
            className={cn(
              "w-full bg-slate-700/50 border border-emerald-500/50 text-teal-50 px-4 py-3 rounded-lg text-sm placeholder-teal-400/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition-all",
              errors.name && "border-red-500/50 focus:ring-red-500/30"
            )}
            placeholder="Amal Silva"
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-teal-100 text-sm font-semibold mb-2">
            Email Address
          </label>
          <input
            {...register('email')}
            type="email"
            className={cn(
              "w-full bg-slate-700/50 border border-emerald-500/50 text-teal-50 px-4 py-3 rounded-lg text-sm placeholder-teal-400/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition-all",
              errors.email && "border-red-500/50 focus:ring-red-500/30"
            )}
            placeholder="amal@colombo.tech"
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-teal-100 text-sm font-semibold mb-2">
              Age
            </label>
            <input
              {...register('age')}
              type="number"
              className={cn(
                "w-full bg-slate-700/50 border border-emerald-500/50 text-teal-50 px-4 py-3 rounded-lg text-sm placeholder-teal-400/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition-all",
                errors.age && "border-red-500/50 focus:ring-red-500/30"
              )}
              placeholder="28"
            />
            {errors.age && <p className="text-red-400 text-xs mt-1">{errors.age.message}</p>}
          </div>
          <div>
            <label className="block text-teal-100 text-sm font-semibold mb-2">
              Phone (LK)
            </label>
            <input
              {...register('phone')}
              type="tel"
              className={cn(
                "w-full bg-slate-700/50 border border-emerald-500/50 text-teal-50 px-4 py-3 rounded-lg text-sm placeholder-teal-400/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition-all",
                errors.phone && "border-red-500/50 focus:ring-red-500/30"
              )}
              placeholder="+94 701 234567"
            />
            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-teal-100 text-sm font-semibold mb-2">
            Your Role
          </label>
          <select
            {...register('role')}
            className="w-full bg-slate-700/50 border border-emerald-500/50 text-teal-50 px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition-all"
          >
            <option value="developer">Developer</option>
            <option value="designer">Designer</option>
            <option value="entrepreneur">Entrepreneur</option>
            <option value="student">Student</option>
            <option value="manager">Manager</option>
            <option value="other">Other</option>
          </select>
          {errors.role && <p className="text-red-400 text-xs mt-1">{errors.role.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-slate-900 font-bold py-3 px-4 rounded-lg text-sm uppercase tracking-wider transition-all hover:shadow-lg hover:shadow-emerald-500/50 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Registering...
            </>
          ) : (
            <>
              Register Now
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-teal-300/60 text-xs mt-6 font-light">
        Secure • Spam-free • Sri Lankan community
      </p>
    </div>
  );
}
