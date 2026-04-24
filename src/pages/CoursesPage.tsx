import { useState } from 'react';
import { motion } from 'framer-motion';
import { CourseCard } from '../components/courses/CourseCard';
import { SEO } from '../components/SEO';
import { CourseModal } from '../components/courses/CourseModal';
import { AnimatePresence } from 'framer-motion';

const COURSES = [
  {
    id: 'ai-path',
    title: 'THE AI PATH',
    description: 'Understand, use, and build with AI, without the confusion.',
    image: '/ai.jpg',
    price: '40,000 RS'
  },
  {
    id: 'creator-path',
    title: 'THE CREATOR PATH',
    description: 'Turn ideas into content and systems that grow audiences.',
    image: '/creator.jpg',
    price: '40,000 RS'
  },
  {
    id: 'youth-path',
    title: 'THE YOUTH PATH',
    description: 'Learn digital skills through building, creating, and play.',
    image: '/youth.jpg',
    price: '40,000 RS'
  },
  {
    id: 'marketing-path',
    title: 'THE MARKETING PATH',
    description: 'Learn digital Marketing skills through AI.',
    image: '/Marketing.png',
    price: '40,000 RS'
  }
];

export function CoursesPage() {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const handleEnroll = (id: string) => {
    setSelectedCourseId(id);
  };

  return (
    <div className="min-h-screen bg-[#020617] relative overflow-hidden pt-32 pb-20 px-4">
      <SEO 
        title="AI Courses | Master the Knowledge Paths" 
        description="Choose from our 4 exclusive AI knowledge paths: The AI Path, The Creator Path, The Youth Path, and The Marketing Path. Professional certification and hands-on learning."
        url="https://ai.theaob.lk/courses"
      />
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20 relative">
          {/* 3D Robot Floating */}
          <motion.img
            src="/AI_Robot_3d.png"
            alt="AI Robot"
            initial={{ y: 0 }}
            animate={{ y: [-20, 20, -20] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-32 h-32 md:w-48 md:h-48 absolute -top-24 left-1/2 -translate-x-1/2 opacity-80"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-emerald-500 font-bold tracking-[0.2em] uppercase mb-4">
              Knowledge Paths
            </h2>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Empower Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-400 to-emerald-600">Future</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Structured learning journeys designed to take you from beginner to confident operator. 
              Master the skills of tomorrow, today.
            </p>
          </motion.div>
        </div>

        {/* Categories Filter (Visual only as per design) */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {['All', 'AI', 'Creator', 'Youth', 'Digital Marketing'].map((cat, idx) => (
            <button
              key={cat}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                idx === 0 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20' 
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {COURSES.map((course) => (
            <CourseCard
              key={course.id}
              {...course}
              onEnroll={handleEnroll}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedCourseId && (
          <CourseModal 
            course={COURSES.find(c => c.id === selectedCourseId)!} 
            onClose={() => setSelectedCourseId(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
