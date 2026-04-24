import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CourseCard } from '../components/courses/CourseCard';
import { SEO } from '../components/SEO';
import { CourseModal } from '../components/courses/CourseModal';

const COURSES = [
  {
    id: 'ai-path',
    title: 'THE AI PATH',
    description: 'Understand, use, and build with AI, without the confusion.',
    image: '/ai.jpg',
    price: '40,000 RS',
    category: 'AI',
  },
  {
    id: 'creator-path',
    title: 'THE CREATOR PATH',
    description: 'Turn ideas into content and systems that grow audiences.',
    image: '/creator.jpg',
    price: '40,000 RS',
    category: 'Creator',
  },
  {
    id: 'youth-path',
    title: 'THE YOUTH PATH',
    description: 'Learn digital skills through building, creating, and play.',
    image: '/youth.jpg',
    price: '40,000 RS',
    category: 'Youth',
  },
  {
    id: 'marketing-path',
    title: 'THE MARKETING PATH',
    description: 'Learn digital Marketing skills through AI.',
    image: '/Marketing.png',
    price: '40,000 RS',
    category: 'Digital Marketing',
  },
];

const CATEGORIES = ['All', 'AI', 'Creator', 'Youth', 'Digital Marketing'];

export function CoursesPage() {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredCourses =
    activeCategory === 'All'
      ? COURSES
      : COURSES.filter((c) => c.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#020617] relative overflow-hidden pt-32 pb-20 px-4">
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

      {/* 3D Robot — fixed bottom-right */}
      <motion.img
        src="/AI_Robot_3d.png"
        alt="AI Robot"
        initial={{ y: 0 }}
        animate={{ y: [-14, 14, -14] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="fixed bottom-6 right-6 w-28 h-28 md:w-40 md:h-40 opacity-90 pointer-events-none z-50 drop-shadow-[0_0_30px_rgba(16,185,129,0.35)]"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-16"
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
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 focus:outline-none ${
                  isActive
                    ? 'text-white shadow-lg shadow-emerald-500/30'
                    : 'text-slate-400 hover:text-white bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="pill-active"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 -z-10"
                    transition={{ type: 'spring', duration: 0.4 }}
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
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredCourses.map((course) => (
              <motion.div
                key={course.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.3 }}
              >
                <CourseCard {...course} onEnroll={setSelectedCourseId} />
              </motion.div>
            ))}
          </AnimatePresence>
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
