import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { CourseCard } from '../components/courses/CourseCard';
import { SEO } from '../components/SEO';
import { CourseModal } from '../components/courses/CourseModal';

const COURSES = [
  {
    id: 'ai-path',
    title: 'THE AI PATH',
    description: 'Understand, use, and build with AI, without the confusion.',
    image: '/ai.jpg',
    originalPrice: 'Rs. 55,000',
    price: 'Rs. 40,000',
    category: 'AI Path',
  },
  {
    id: 'creator-path',
    title: 'THE CREATOR PATH',
    description: 'Turn ideas into content and systems that grow audiences.',
    image: '/creator.jpg',
    originalPrice: 'Rs. 55,000',
    price: 'Rs. 40,000',
    category: 'Creator Path',
  },
  {
    id: 'youth-path',
    title: 'THE YOUTH PATH',
    description: 'Learn digital skills through building, creating, and play.',
    image: '/youth.jpg',
    originalPrice: 'Rs. 55,000',
    price: 'Rs. 40,000',
    category: 'Youth Path',
  },
  {
    id: 'marketing-path',
    title: 'THE MARKETING PATH',
    description: 'Learn digital Marketing skills through AI.',
    image: '/Marketing.png',
    originalPrice: 'Rs. 55,000',
    price: 'Rs. 40,000',
    category: 'Digital Marketing Path',
  },
];

const CATEGORIES = ['All', 'AI Path', 'Creator Path', 'Youth Path', 'Digital Marketing Path'];

export function CoursesPage() {
  const prefersReducedMotion = useReducedMotion();
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredCourses =
    activeCategory === 'All'
      ? COURSES
      : COURSES.filter((c) => c.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#020617] relative overflow-hidden pt-20 md:pt-28 pb-12 px-4">
      <SEO
        title="AI Courses | Master the Knowledge Paths"
        description="Choose from our 4 exclusive AI knowledge paths: The AI Path, The Creator Path, The Youth Path, and The Marketing Path."
        url="https://ai.theaob.lk/courses"
      />

      {/* Background glow blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      {/* 3D Robot & Mentor Label — fixed bottom-right */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [-14, 14, -14] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="fixed bottom-6 right-6 z-50 pointer-events-none flex flex-col items-center gap-1"
      >
        <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-black/50">
          AI Mentor
        </div>
        <img
          src="/AI_Robot_3d.png"
          alt="AI Robot"
          className="w-28 h-28 md:w-40 md:h-40 opacity-90 drop-shadow-[0_0_30px_rgba(16,185,129,0.35)]"
        />
      </motion.div>

      <div className="max-w-[1600px] w-full mx-auto relative z-10 px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-emerald-500 font-bold tracking-[0.2em] uppercase mb-4 text-sm">
            Knowledge Paths
          </h2>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Empower Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-400 to-emerald-600">
              Future
            </span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Structured learning journeys designed to take you from beginner to confident
            operator.{' '}
            <span className="text-emerald-400 font-medium">Master the skills</span> of
            tomorrow, today.
          </p>
        </motion.div>

        {/* Filter Pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-12"
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-4 md:px-6 py-2 rounded-full text-[12px] md:text-sm font-semibold transition-all duration-300 focus:outline-none ${
                  isActive
                    ? 'text-white shadow-lg shadow-emerald-500/30'
                    : 'text-slate-400 hover:text-white bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="pill-active"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 -z-10"
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 520, damping: 38, mass: 0.7 }
                    }
                  />
                )}
                {cat}
              </button>
            );
          })}
        </motion.div>

        {/* Course Grid */}
        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                layout
                initial={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 14, scale: 0.96 }
                }
                animate={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : { opacity: 1, y: 0, scale: 1 }
                }
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: -8, scale: 0.98 }
                }
                transition={{
                  layout: { type: 'spring', stiffness: 420, damping: 36, mass: 0.8 },
                  opacity: { duration: 0.16, delay: prefersReducedMotion ? 0 : index * 0.02 },
                  y: { duration: 0.18, delay: prefersReducedMotion ? 0 : index * 0.02 },
                  scale: { duration: 0.18, delay: prefersReducedMotion ? 0 : index * 0.02 },
                }}
              >
                <CourseCard {...course} onEnroll={setSelectedCourseId} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Powered By */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 pb-4 flex flex-col items-center gap-12"
        >
          {/* Label */}
          <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/50" style={{ fontFamily: 'Cinzel, serif' }}>
            Powered By
          </span>

          {/* Logos row — both sides vertically centred */}
          <div className="flex items-center justify-center gap-8 sm:gap-20">

            {/* AOB — Logo + Text */}
            <div className="flex flex-col items-center text-center gap-3 sm:gap-4">
              <img 
                src="/aob-logo.png" 
                alt="Academy of Billionaires" 
                className="h-10 sm:h-16 w-auto object-contain drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]"
              />
              <div className="flex flex-col items-center gap-1">
                <p className="text-[7px] sm:text-[9px] tracking-[0.4em] uppercase text-amber-400/80 leading-none" style={{ fontFamily: 'Cinzel, serif' }}>
                  Academy of
                </p>
                <p className="text-lg sm:text-2xl font-bold tracking-[0.2em] uppercase leading-none text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400" style={{ fontFamily: 'Cinzel, serif' }}>
                  Billionaires
                </p>
                <p className="text-[6px] sm:text-[8px] tracking-[0.3em] uppercase text-amber-400/60 mt-1" style={{ fontFamily: 'Cinzel, serif' }}>
                  Educate · Elevate · Dominate
                </p>
              </div>
            </div>

            {/* Nuaiy — Logo Only */}
            <div className="flex flex-col items-center">
              <img
                src="/nuaiy.png"
                alt="Nuaiy"
                className="h-10 sm:h-16 w-auto object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.2)]"
              />
            </div>
          </div>

        </motion.div>

      </div>

      {/* Course Modal */}
      <AnimatePresence>
        {selectedCourseId && (
          <CourseModal
            course={COURSES.find((c) => c.id === selectedCourseId)!}
            onClose={() => setSelectedCourseId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
