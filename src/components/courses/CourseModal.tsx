import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, CheckCircle2, Building2, User, Phone, Mail, CreditCard, Info, ChevronLeft, ChevronRight, ArrowLeftRight } from 'lucide-react';
import { courseRegistrationSchema, CourseRegistrationData } from '../../lib/schema';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { PROMO_COURSE_PRICE, isApprovedPromoCode } from '../../lib/promoCode';

interface CourseModalProps {
  course: {
    id: string;
    title: string;
    price: string;
  };
  onClose: () => void;
}

type Step = 'payment' | 'form' | 'confirmation' | 'success';

const BANK_ACCOUNTS = [
  {
    id: 'commercial',
    name: 'Commercial Bank PLC',
    logo: '/Commercial_Bank_logo.svg.png',
    branch: 'KULIYAPITIYA',
    accountName: 'W M B S DISSANAYAKE',
    accountNumber: '8030237458',
  },
  {
    id: 'seylan',
    name: 'Seylan Bank PLC',
    logo: '/Seylan_Transparent.png',
    branch: 'KULIYAPITIYA',
    accountName: 'W M B S DISSANAYAKE',
    accountNumber: '044013963778120',
  },
];

export function CourseModal({ course, onClose }: CourseModalProps) {
  const [step, setStep] = useState<Step>('payment');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedBankIndex, setSelectedBankIndex] = useState(0);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoApproved, setPromoApproved] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [promoAnimationKey, setPromoAnimationKey] = useState(0);
  const selectedBank = BANK_ACCOUNTS[selectedBankIndex];
  const effectiveCoursePrice = promoApproved ? PROMO_COURSE_PRICE : course.price;

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

  const handlePromoCodeChange = (value: string) => {
    setPromoCodeInput(value);
    setPromoError('');
    if (promoApproved) setPromoApproved(false);
  };

  const applyPromoCode = () => {
    if (isApprovedPromoCode(promoCodeInput)) {
      setPromoCodeInput('');
      setPromoApproved(true);
      setPromoError('');
      setPromoAnimationKey((current) => current + 1);
      return;
    }

    setPromoApproved(false);
    setPromoError('Invalid promo code. Please check and try again.');
  };

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
          coursePrice: effectiveCoursePrice,
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
    } catch (error: unknown) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
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

  const showPreviousBank = () => {
    setSelectedBankIndex((current) =>
      current === 0 ? BANK_ACCOUNTS.length - 1 : current - 1
    );
  };

  const showNextBank = () => {
    setSelectedBankIndex((current) =>
      current === BANK_ACCOUNTS.length - 1 ? 0 : current + 1
    );
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
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="p-3 bg-emerald-500 rounded-2xl text-white shrink-0">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <p className="text-emerald-500 text-sm font-bold">Bank Transfer Details</p>
                    </div>
                    <p className="text-white font-bold text-base sm:text-lg text-right shrink-0">
                      {effectiveCoursePrice}
                    </p>
                  </div>

                  <div className="mb-5">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <button
                        type="button"
                        onClick={showPreviousBank}
                        aria-label="Show previous bank"
                        className="w-10 h-10 rounded-full border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:border-emerald-400/60 hover:bg-emerald-500/10 transition-colors flex items-center justify-center shrink-0"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      <div className="min-w-0 flex-1 rounded-2xl bg-white p-4 sm:p-5 shadow-xl shadow-black/20 border border-white/80">
                        <img
                          src={selectedBank.logo}
                          alt={`${selectedBank.name} logo`}
                          className="h-12 sm:h-16 w-full object-contain"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={showNextBank}
                        aria-label="Show next bank"
                        className="w-10 h-10 rounded-full border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:border-emerald-400/60 hover:bg-emerald-500/10 transition-colors flex items-center justify-center shrink-0"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-950/50 border border-white/10 p-1">
                      {BANK_ACCOUNTS.map((bank, index) => {
                        const isActive = selectedBankIndex === index;
                        return (
                          <button
                            key={bank.id}
                            type="button"
                            onClick={() => setSelectedBankIndex(index)}
                            className={`min-h-11 rounded-xl px-3 text-xs sm:text-sm font-bold transition-all ${
                              isActive
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            {bank.name.replace(' Bank PLC', '')}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-3 flex items-center justify-center gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300/80">
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                      <span>Swap bank details</span>
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3 text-slate-300 text-xs sm:text-sm">
                    <div className="flex justify-between py-1.5 sm:py-2 border-b border-white/5">
                      <span>Bank</span>
                      <span className="text-white font-semibold text-right">{selectedBank.name}</span>
                    </div>
                    <div className="flex justify-between py-1.5 sm:py-2 border-b border-white/5">
                      <span>Branch</span>
                      <span className="text-white font-semibold text-right">{selectedBank.branch}</span>
                    </div>
                    <div className="flex justify-between py-1.5 sm:py-2 border-b border-white/5">
                      <span>Account Name</span>
                      <span className="text-white font-semibold text-right">{selectedBank.accountName}</span>
                    </div>
                    <div className="flex justify-between py-1.5 sm:py-2">
                      <span>Account Number</span>
                      <span className="text-white font-semibold text-right">{selectedBank.accountNumber}</span>
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

                  <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <AnimatePresence>
                      {!promoApproved && (
                        <motion.div
                          initial={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-col sm:flex-row sm:items-end gap-3 overflow-hidden"
                        >
                          <div className="flex-1 space-y-2">
                            <label className="text-sm font-medium text-slate-400 ml-1">Promo Code</label>
                            <input
                              type="text"
                              value={promoCodeInput}
                              onChange={(event) => handlePromoCodeChange(event.target.value)}
                              className="w-full bg-slate-950/40 border border-white/10 rounded-2xl py-3 px-4 text-white tracking-wide focus:border-emerald-500 outline-none transition-all"
                              placeholder="Enter promo code"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={applyPromoCode}
                            className="w-full sm:w-auto px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20"
                          >
                            Apply
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
                      <p className="text-slate-400">
                        Amount: <span className="text-white font-bold">{effectiveCoursePrice}</span>
                      </p>
                      <AnimatePresence mode="wait">
                        {promoApproved && (
                          <motion.p
                            key={promoAnimationKey}
                            initial={{ opacity: 0, scale: 0.9, y: 8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -4 }}
                            transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                            className="text-emerald-400 font-semibold flex items-center gap-1.5"
                          >
                            <motion.span
                              initial={{ scale: 0, rotate: -45 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: 'spring', stiffness: 520, damping: 18, delay: 0.08 }}
                              className="inline-flex"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </motion.span>
                            Promo approved
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    {promoError && <p className="text-red-500 text-xs ml-1">{promoError}</p>}
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
                    <h4 className="text-lg sm:text-xl font-bold text-red-500 uppercase tracking-tight">Re-Confirm Your Details</h4>
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
                      <p className="text-slate-500 mb-0.5 sm:mb-1">Amount</p>
                      <p className="text-white font-bold text-base sm:text-lg">{effectiveCoursePrice}</p>
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

                <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
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
                    className="w-full sm:flex-[2] py-3.5 sm:py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl sm:rounded-2xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    {isSubmitting ? 'Submitting...' : 'Confirm'}
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
