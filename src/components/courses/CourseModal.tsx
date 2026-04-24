import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, CheckCircle2, AlertCircle, Building2, User, Phone, Mail, CreditCard, Info } from 'lucide-react';
import { courseRegistrationSchema, CourseRegistrationData } from '../../lib/schema';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

interface CourseModalProps {
  course: {
    id: string;
    title: string;
    price: string;
  };
  onClose: () => void;
}

type Step = 'payment' | 'form' | 'confirmation' | 'success';

export function CourseModal({ course, onClose }: CourseModalProps) {
  const [step, setStep] = useState<Step>('payment');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    trigger
  } = useForm<CourseRegistrationData>({
    resolver: zodResolver(courseRegistrationSchema),
    defaultValues: {
      gender: 'male'
    }
  });

  const onSubmit = async (data: CourseRegistrationData) => {
    setIsSubmitting(true);
    try {
      // 1. Upload File to Supabase
      const file = data.receipt[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `receipts/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('receipts')
        .getPublicUrl(filePath);

      // 2. Save to Supabase Table
      const { error: dbError } = await supabase
        .from('course_registrations')
        .insert({
          full_name: data.fullName,
          email: data.email,
          age: data.age,
          phone: data.phone,
          nic: data.nic,
          gender: data.gender,
          course_id: course.id,
          receipt_url: publicUrl
        });

      if (dbError) throw dbError;

      // 3. Trigger Edge Function (for Google Sheets & Resend)
      const { error: funcError } = await supabase.functions.invoke('register-course', {
        body: {
          ...data,
          courseId: course.id,
          courseTitle: course.title,
          coursePrice: course.price,
          receiptUrl: publicUrl
        },
      });

      if (funcError) {
        console.warn('Edge function error:', funcError);
      }

      // We don't necessarily block if the edge function fails (could be transient)
      // but we should log it or handle it. For now, we assume DB save is primary.

      setStep('success');
      toast.success('Registration submitted successfully!');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    if (step === 'payment') setStep('form');
    else if (step === 'form') {
      const isValid = await trigger();
      if (isValid) setStep('confirmation');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-slate-900 border border-white/10 rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 sm:p-8 pb-0 flex justify-between items-start">
          <div>
            <h2 className="text-emerald-500 font-bold tracking-widest text-xs uppercase mb-2">Registration</h2>
            <h3 className="text-xl sm:text-2xl font-bold text-white">{course.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto flex-1 custom-scrollbar">
          <AnimatePresence mode="wait">
            {step === 'payment' && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl sm:rounded-3xl p-5 sm:p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-emerald-500 rounded-2xl text-white">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-emerald-500 text-sm font-bold">Bank Transfer Details</p>
                      <p className="text-white font-medium text-sm sm:text-base">Please pay {course.price}</p>
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3 text-slate-300 text-xs sm:text-sm">
                    <div className="flex justify-between py-1.5 sm:py-2 border-b border-white/5">
                      <span>Bank</span>
                      <span className="text-white font-semibold">BOC</span>
                    </div>
                    <div className="flex justify-between py-1.5 sm:py-2 border-b border-white/5">
                      <span>Branch</span>
                      <span className="text-white font-semibold">MAHARAGAMA</span>
                    </div>
                    <div className="flex justify-between py-1.5 sm:py-2 border-b border-white/5">
                      <span>Account Name</span>
                      <span className="text-white font-semibold">W M B S DISSANAYAKE</span>
                    </div>
                    <div className="flex justify-between py-1.5 sm:py-2">
                      <span>Account Number</span>
                      <span className="text-white font-semibold">86861968</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl">
                  <Info className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-400">
                    After making the transfer, please take a screenshot or photo of the receipt to upload in the next step.
                  </p>
                </div>

                <button
                  onClick={nextStep}
                  className="w-full py-3.5 sm:py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl sm:rounded-2xl transition-all shadow-lg shadow-emerald-500/20 text-sm sm:text-base"
                >
                  I've Made the Payment
                </button>
              </motion.div>
            )}

            {step === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <form className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400 ml-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                          {...register('fullName')}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:border-emerald-500 outline-none transition-all"
                          placeholder="Kusal Perera"
                        />
                      </div>
                      {errors.fullName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.fullName.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400 ml-1">Age</label>
                      <input
                        {...register('age')}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white focus:border-emerald-500 outline-none transition-all"
                        placeholder="25"
                      />
                      {errors.age && <p className="text-red-500 text-xs mt-1 ml-1">{errors.age.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400 ml-1">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                          {...register('email')}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:border-emerald-500 outline-none transition-all"
                          placeholder="kusal@gmail.com"
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400 ml-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                          {...register('phone')}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:border-emerald-500 outline-none transition-all"
                          placeholder="0771234567"
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400 ml-1">NIC Number</label>
                      <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                          {...register('nic')}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:border-emerald-500 outline-none transition-all"
                          placeholder="199912345678"
                        />
                      </div>
                      {errors.nic && <p className="text-red-500 text-xs mt-1 ml-1">{errors.nic.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400 ml-1">Gender</label>
                      <select
                        {...register('gender')}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white focus:border-emerald-500 outline-none transition-all appearance-none"
                      >
                        <option value="male" className="bg-slate-900">Male</option>
                        <option value="female" className="bg-slate-900">Female</option>
                        <option value="other" className="bg-slate-900">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 ml-1">Upload Payment Receipt</label>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 hover:border-emerald-500/50 rounded-2xl cursor-pointer bg-white/5 transition-all group">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 text-slate-500 group-hover:text-emerald-500 transition-colors mb-2" />
                        <p className="text-sm text-slate-400">
                          {uploadedFile ? uploadedFile.name : 'Click to upload or drag and drop'}
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        {...register('receipt', {
                          onChange: (e) => setUploadedFile(e.target.files[0])
                        })}
                      />
                    </label>
                    {errors.receipt && <p className="text-red-500 text-xs mt-1 ml-1">{errors.receipt.message as string}</p>}
                  </div>

                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20"
                  >
                    Continue to Confirmation
                  </button>
                </form>
              </motion.div>
            )}

            {step === 'confirmation' && (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-red-500/10 border border-red-500/40 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 relative overflow-hidden">
                  {/* Decorative Background for Red Confirmation */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-3xl rounded-full" />

                  <div className="flex items-center gap-3 mb-6">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                    <h4 className="text-lg sm:text-xl font-bold text-red-500 uppercase tracking-tight">Confirm Your Details</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 sm:gap-y-6 gap-x-8 text-xs sm:text-sm">
                    <div>
                      <p className="text-slate-500 mb-0.5 sm:mb-1">Full Name</p>
                      <p className="text-white font-bold text-base sm:text-lg">{getValues('fullName')}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-0.5 sm:mb-1">Email</p>
                      <p className="text-white font-bold text-base sm:text-lg break-all">{getValues('email')}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-0.5 sm:mb-1">Phone</p>
                      <p className="text-white font-bold text-base sm:text-lg">{getValues('phone')}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-0.5 sm:mb-1">NIC</p>
                      <p className="text-white font-bold text-base sm:text-lg">{getValues('nic')}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-0.5 sm:mb-1">Age / Gender</p>
                      <p className="text-white font-bold text-base sm:text-lg uppercase">{getValues('age')} / {getValues('gender')}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-0.5 sm:mb-1">Receipt</p>
                      <p className="text-emerald-400 font-bold text-base sm:text-lg flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Ready to Upload
                      </p>
                    </div>
                  </div>

                  <p className="mt-8 text-xs text-red-400/80 leading-relaxed italic">
                    * Please ensure all details are 100% correct. These will be used for your course certificate and identification.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    onClick={() => setStep('form')}
                    disabled={isSubmitting}
                    className="w-full sm:flex-1 py-3.5 sm:py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl sm:rounded-2xl transition-all text-sm sm:text-base"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className="w-full sm:flex-[2] py-3.5 sm:py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl sm:rounded-2xl transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    {isSubmitting ? 'Submitting...' : 'Confirm & Submit'}
                    {!isSubmitting && <CheckCircle2 className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-6"
              >
                <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                </div>
                <h3 className="text-3xl font-bold text-white">Registration Complete!</h3>
                <p className="text-slate-400 max-w-sm mx-auto">
                  We've received your application and payment receipt. You'll receive a confirmation email shortly.
                </p>
                <button
                  onClick={onClose}
                  className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all mt-8"
                >
                  Close
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
