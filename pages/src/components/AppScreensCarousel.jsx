import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Container from './Container';
import SectionReveal from './SectionReveal';

const screens = [
  {
    title: 'Breathing Guide',
    description: 'Follow guided breath patterns to regulate your nervous system',
    image: 'https://placehold.co/500x600/1e1b4b/A78BFA?text=Breathing+Guide',
    accent: 'from-violet-500/30 to-purple-500/20',
    border: 'border-violet-300/30',
  },
  {
    title: 'Mood Check-In',
    description: 'Track how you feel before and after each reset',
    image: 'https://placehold.co/500x600/1e1b4b/60A5FA?text=Mood+Check-In',
    accent: 'from-blue-500/30 to-cyan-500/20',
    border: 'border-blue-300/30',
  },
  {
    title: 'Progress Tracking',
    description: 'Watch your calm moments build into lasting change',
    image: 'https://placehold.co/500x600/1e1b4b/34D399?text=Progress+Tracking',
    accent: 'from-emerald-500/30 to-teal-500/20',
    border: 'border-emerald-300/30',
  },
  {
    title: 'Meditation Station',
    description: 'Explore guided meditations tailored to your needs',
    image: 'https://placehold.co/500x600/1e1b4b/F472B6?text=Meditation+Station',
    accent: 'from-pink-500/30 to-rose-500/20',
    border: 'border-pink-300/30',
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
      x: dir > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      zIndex: 0,
      x: dir < 0 ? 1000 : -1000,
      opacity: 0,
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

        <div className="relative mt-16 flex items-center justify-center">
          {/* Carousel container */}
          <div className="relative w-full overflow-hidden">
            <div className="relative flex items-center justify-center">
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
                    opacity: { duration: 0.5 },
                  }}
                  className="absolute w-full max-w-md px-4 sm:max-w-lg"
                >
                  <motion.div
                    className={`relative overflow-hidden rounded-3xl border ${screens[currentIndex].border} bg-gradient-to-br ${screens[currentIndex].accent} p-1 shadow-2xl`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Glow effect */}
                    <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-t from-transparent via-transparent to-white/10" />

                    {/* Screen content */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 to-black/80 p-6">
                      <motion.img
                        src={screens[currentIndex].image}
                        alt={screens[currentIndex].title}
                        className="h-96 w-full rounded-xl object-cover sm:h-[480px]"
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                      />

                      {/* Screen info overlay */}
                      <motion.div
                        className="absolute inset-0 flex flex-col items-center justify-end rounded-2xl bg-gradient-to-t from-black/60 via-transparent to-transparent p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <h3 className="text-lg font-semibold text-white sm:text-xl">
                          {screens[currentIndex].title}
                        </h3>
                        <p className="mt-2 text-center text-xs text-slate-200 sm:text-sm">
                          {screens[currentIndex].description}
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Side preview indicators (desktop only) */}
              <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-16 bg-gradient-to-r from-black/40 to-transparent lg:block" />
              <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-16 bg-gradient-to-l from-black/40 to-transparent lg:block" />
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={() => paginate(-1)}
            onMouseEnter={() => setAutoPlay(false)}
            onMouseLeave={() => setAutoPlay(true)}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-2.5 text-white backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-black/60 hover:scale-110 sm:p-3"
            aria-label="Previous screen"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          <button
            onClick={() => paginate(1)}
            onMouseEnter={() => setAutoPlay(false)}
            onMouseLeave={() => setAutoPlay(true)}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-2.5 text-white backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-black/60 hover:scale-110 sm:p-3"
            aria-label="Next screen"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="mt-12 flex justify-center gap-2 sm:gap-3">
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
        </div>

        {/* Screen counter */}
        <div className="mt-8 flex justify-center">
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
            <p className="text-center text-xs text-slate-300 sm:text-sm">
              <span className="font-semibold text-white">{String(currentIndex + 1).padStart(2, '0')}</span>
              <span className="mx-2">/</span>
              <span>{String(screens.length).padStart(2, '0')}</span>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AppScreensCarousel;
