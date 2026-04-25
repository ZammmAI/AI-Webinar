import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  originalPrice: string;
  price: string;
  category: string;
  onEnroll: (id: string) => void;
}

export function CourseCard({ id, title, description, image, originalPrice, price, category, onEnroll }: CourseCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative flex flex-col h-full bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden hover:border-emerald-500/60 transition-colors duration-500 shadow-xl shadow-black/40 hover:shadow-emerald-500/10"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden shrink-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

        {/* Top-left shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Category pill top-left */}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/90 text-[10px] font-bold uppercase tracking-widest border border-white/10 shadow-lg">
          {category}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 sm:p-8 gap-3 sm:gap-4">
        <h3 className="text-lg sm:text-2xl font-black text-white leading-tight group-hover:text-emerald-300 transition-colors duration-300 tracking-wide">
          {title}
        </h3>

        <p className="text-slate-400 text-sm sm:text-base leading-relaxed flex-1">
          {description}
        </p>

        {/* Action Area */}
        <div className="flex flex-col gap-4 sm:gap-5 mt-auto pt-2 sm:pt-4">
          
          {/* Price & Badge */}
          <div className="flex items-end justify-between pt-3 sm:pt-4 border-t border-white/10">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">
                Investment
              </span>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-xs sm:text-sm font-bold text-slate-500 line-through decoration-emerald-400/70 decoration-2">
                  {originalPrice}
                </span>
                <span className="text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 drop-shadow-sm">
                  {price}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
              <Star className="w-3 h-3 fill-emerald-500" />
              Premium
            </div>
          </div>

          {/* Enroll button */}
          <button
            onClick={() => onEnroll(id)}
            className="w-full py-3 sm:py-4 flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-[15px] text-white border border-emerald-500/30 bg-emerald-500/10 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:border-transparent transition-all duration-300 group/btn shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/40"
          >
            Enroll Now
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-1.5 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
