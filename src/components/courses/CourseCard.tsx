import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="group relative bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-emerald-500/50 transition-all duration-500"
    >
      <div className="aspect-[16/10] overflow-hidden relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60" />
        
        {/* Price Tag */}
        <div className="absolute top-4 right-4 bg-emerald-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-emerald-500/20 backdrop-blur-md">
          {price}
        </div>
      </div>

      <div className="p-8">
        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
          {title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-8 line-clamp-2">
          {description}
        </p>

        <button
          onClick={() => onEnroll(id)}
          className="w-full py-4 bg-white/5 hover:bg-emerald-500 text-white font-semibold rounded-2xl border border-white/10 hover:border-emerald-500 transition-all duration-300 flex items-center justify-center gap-2 group/btn"
        >
          Enroll Now
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
