import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  price: string;
  onEnroll: (id: string) => void;
}

export function CourseCard({ id, title, description, image, price, onEnroll }: CourseCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative flex flex-col bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden hover:border-emerald-500/60 transition-colors duration-500 shadow-xl shadow-black/40 hover:shadow-emerald-500/10"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

        {/* Top-left shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Price badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-emerald-500/30 backdrop-blur-md">
          <Star className="w-3 h-3 fill-white" />
          {price}
        </div>

        {/* Category pill bottom-left */}
        <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white/70 text-[10px] font-semibold uppercase tracking-widest border border-white/10">
          AOB Academy
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 gap-4">
        {/* Title with left accent */}
        <div className="flex items-start gap-3">
          <div className="w-1 h-8 rounded-full bg-gradient-to-b from-emerald-400 to-teal-600 flex-shrink-0 mt-0.5" />
          <h3 className="text-lg font-extrabold text-white leading-snug group-hover:text-emerald-300 transition-colors duration-300 tracking-wide">
            {title}
          </h3>
        </div>

        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 flex-1">
          {description}
        </p>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Enroll button */}
        <button
          onClick={() => onEnroll(id)}
          className="w-full py-3.5 flex items-center justify-center gap-2 rounded-2xl font-semibold text-sm text-white border border-white/10 bg-white/5 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:border-transparent transition-all duration-300 group/btn shadow-sm hover:shadow-emerald-500/30 hover:shadow-lg"
        >
          Enroll Now
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
        </button>
      </div>
    </motion.div>
  );
}
