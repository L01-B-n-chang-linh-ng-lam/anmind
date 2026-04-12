import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Container from './Container';
import SectionReveal from './SectionReveal';
import resetStartImage from '../assets/trimmed-image-reset-start.png';
import progressImage from '../assets/trimmed-image-progress.png';
import moodCheckingImage from '../assets/trimmed-image-reset-end.png';
import stationImage from '../assets/trimmed-image-station.png';

const screens = [
  {
    id: 1,
    title: 'Guided Breathing',
    subtitle: 'Follow calming breath patterns',
    image: resetStartImage,
    accent: 'from-violet-500/30 to-purple-500/20',
    border: 'border-violet-300/30',
    shadow: 'shadow-[0_0_40px_rgba(167,139,250,0.3)]',
  },
  {
    id: 2,
    title: 'Mood Check-In',
    subtitle: 'Track how you feel',
    image: moodCheckingImage,
    accent: 'from-blue-500/30 to-cyan-500/20',
    border: 'border-blue-300/30',
    shadow: 'shadow-[0_0_40px_rgba(59,130,246,0.3)]',
  },
  {
    id: 3,
    title: 'Progress Tracking',
    subtitle: 'Watch your calm moments grow',
    image: progressImage,
    accent: 'from-emerald-500/30 to-teal-500/20',
    border: 'border-emerald-300/30',
    shadow: 'shadow-[0_0_40px_rgba(16,185,129,0.3)]',
  },
  {
    id: 4,
    title: 'Meditation Station',
    subtitle: 'Guided sessions for any moment',
    image: stationImage,
    accent: 'from-pink-500/30 to-rose-500/20',
    border: 'border-pink-300/30',
    shadow: 'shadow-[0_0_40px_rgba(236,72,153,0.3)]',
  },
];

const AppScreensCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % screens.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [autoPlay]);

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => (prev + newDirection + screens.length) % screens.length);
    setAutoPlay(false);
  };

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 400 : -400,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir) => ({
      zIndex: 0,
      x: dir < 0 ? 400 : -400,
      opacity: 0,
      scale: 0.9,
    }),
  };

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionReveal className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-violet-300">Experience</p>
          <h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Experience the Reset
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Watch how AnMind guides you from mental noise to calm clarity in one seamless flow
          </p>
        </SectionReveal>

        {/* Carousel */}
        <div className="relative mt-20 flex flex-col items-center gap-12 px-4">
          {/* Phone mockup carousel */}
          <div className="relative h-[540px] w-full max-w-4xl flex justify-center">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.4 },
                  scale: { duration: 0.4 },
                }}
                className="absolute top-0 flex w-72 flex-col items-center"
              >
                {/* Phone frame mockup */}
                <motion.div
                  className={`relative h-96 overflow-hidden rounded-[2.0rem] bg-gradient-to-br ${screens[currentIndex].accent} shadow-2xl sm:h-[420px]`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 1.0, ease: 'easeInOut' }}
                >

                  {/* Glow effect */}
                  <div className={`pointer-events-none absolute inset-0 rounded-[2.25rem] ${screens[currentIndex].shadow}`} />

                  {/* Screen content */}
                  <motion.div
                    className="relative h-full w-full overflow-hidden bg-gradient-to-b from-slate-950 to-black"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <motion.img
                      src={screens[currentIndex].image}
                      alt={screens[currentIndex].title}
                      className="h-full w-full object-cover"
                      initial={{ scale: 0.95, filter: 'blur(4px)' }}
                      animate={{ scale: 1, filter: 'blur(0px)' }}
                      transition={{ duration: 0.5, delay: 0.05 }}
                    />

                    {/* Content overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </motion.div>
                </motion.div>

                {/* Screen title and subtitle below phone */}
                <motion.div
                  className="mt-6 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <h3 className="text-xl font-semibold text-white sm:text-2xl">
                    {screens[currentIndex].title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400 sm:text-base">
                    {screens[currentIndex].subtitle}
                  </p>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation arrows - positioned outside carousel */}
            <button
              onClick={() => paginate(-1)}
              onMouseEnter={() => setAutoPlay(false)}
              onMouseLeave={() => setAutoPlay(true)}
              className="absolute left-0 top-1/3 z-10 rounded-full border border-white/20 bg-white/5 p-3 text-white backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:scale-110 sm:-left-16 sm:p-3.5"
              aria-label="Previous screen"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            <button
              onClick={() => paginate(1)}
              onMouseEnter={() => setAutoPlay(false)}
              onMouseLeave={() => setAutoPlay(true)}
              className="absolute right-0 top-1/3 z-10 rounded-full border border-white/20 bg-white/5 p-3 text-white backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:scale-110 sm:-right-16 sm:p-3.5"
              aria-label="Next screen"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>

          {/* Dots indicator */}
          <motion.div
            className="flex justify-center gap-2 sm:gap-3"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {screens.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                  setAutoPlay(false);
                }}
                className={`transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-violet-400 shadow-[0_0_16px_rgba(167,139,250,0.6)]'
                    : 'bg-slate-500/40 hover:bg-slate-400/60'
                }`}
                style={{
                  width: index === currentIndex ? '32px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Go to screen ${index + 1}`}
              />
            ))}
          </motion.div>

          {/* Slide counter */}
          <motion.div
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-center text-xs text-slate-300 sm:text-sm">
              <span className="font-semibold text-white">{String(currentIndex + 1).padStart(2, '0')}</span>
              <span className="mx-2">/</span>
              <span>{String(screens.length).padStart(2, '0')}</span>
            </p>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default AppScreensCarousel;
