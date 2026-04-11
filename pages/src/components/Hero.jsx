import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BrainCircuit, Sparkles, Wind } from 'lucide-react';
import Container from './Container';
import Button from './Button';

const slides = [
  {
    eyebrow: 'Problem',
    title: 'Overwhelmed by constant noise?',
    body:
      'Notifications, pressure, and unfinished thoughts stack up fast. AnMind gives the mind a place to land when everything feels too loud.',
    visual: 'from-rose-500/30 via-orange-400/20 to-amber-200/10',
    accent: 'bg-rose-400/20',
    icon: BrainCircuit,
  },
  {
    eyebrow: 'Experience',
    title: 'Breathe. Slow down. Reset.',
    body:
      'A guided breathing flow sets the pace for you. Each inhale and exhale becomes a signal to soften tension and settle the body.',
    visual: 'from-violet-500/35 via-fuchsia-500/20 to-cyan-300/10',
    accent: 'bg-violet-400/20',
    icon: Wind,
  },
  {
    eyebrow: 'Outcome',
    title: 'Back in control.',
    body:
      'The fog lifts. Thoughts slow down. You return with more clarity, steadier breathing, and enough space to respond instead of react.',
    visual: 'from-cyan-500/25 via-sky-400/15 to-emerald-300/10',
    accent: 'bg-cyan-400/20',
    icon: Sparkles,
  },
];

const Hero = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, []);

  const currentSlide = slides[activeSlide];
  const SlideIcon = currentSlide.icon;

  return (
    <section className="relative overflow-hidden py-20 sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute -top-28 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-fuchsia-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-1/4 h-80 w-80 rounded-full bg-indigo-500/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center lg:text-left"
          >
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-violet-200/85">
              Stress reset for modern minds
            </p>
            <h1 className="font-display text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              AnMind
            </h1>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.title + '-copy'}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              >
                <p className="mt-4 max-w-xl text-xl font-medium text-violet-100 sm:text-2xl lg:mx-0">
                  {currentSlide.title}
                </p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.12 }}
                  className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-300 lg:mx-0 lg:text-lg"
                >
                  {currentSlide.body}
                </motion.p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Button href="https://www.behance.net/gallery/245651213/AnMind">View Case Study</Button>
              <Button
                href="https://www.figma.com/design/DRZNecxnNHjyeHo5rhXKVU/AnMind?node-id=6-2&t=mpaZsEapt7izqqxQ-1"
                variant="secondary"
              >
                View Design (Figma)
              </Button>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {slides.map((slide, index) => {
                const active = index === activeSlide;
                return (
                  <button
                    key={slide.title}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    className={`rounded-2xl border p-4 text-left transition duration-300 ${
                      active
                        ? 'border-white/20 bg-white/10 shadow-[0_0_30px_rgba(139,92,246,0.24)]'
                        : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8'
                    }`}
                  >
                    <span className="block text-[11px] uppercase tracking-[0.24em] text-slate-400">0{index + 1}</span>
                    <span className="mt-2 block text-sm font-semibold text-white">{slide.eyebrow}</span>
                  </button>
                );
              })}
            </div>

              <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  key={activeSlide}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 4.5, ease: 'linear' }}
                  className="h-full origin-left rounded-full bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-200"
                />
              </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 -z-10 animate-pulseSoft rounded-[32px] bg-gradient-to-tr from-violet-500/25 via-fuchsia-500/15 to-cyan-400/25 blur-3xl" />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.title}
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.01, y: -8 }}
                transition={{ duration: 0.65, ease: 'easeOut' }}
                className="section-glass relative overflow-hidden rounded-[30px] border border-white/15 p-4 shadow-glow sm:p-6"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${currentSlide.visual} opacity-70`} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_35%)]" />
                <div className="absolute -left-10 top-1/2 h-24 w-24 -translate-y-1/2 animate-float rounded-full bg-fuchsia-400/35 blur-2xl will-change-transform" />
                <div className="absolute -right-8 top-8 h-20 w-20 rounded-full bg-violet-400/35 blur-2xl will-change-transform" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.14),transparent_60%)] animate-pulseSoft" />

                <div className="relative grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:gap-6">
                  <div className="section-glass flex flex-col justify-between border-white/10 bg-black/25 p-5">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-200">
                        <SlideIcon className="h-4 w-4 text-white" />
                        {currentSlide.eyebrow}
                      </div>
                      <motion.h2
                        key={currentSlide.title + '-hero-title'}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.45, ease: 'easeOut' }}
                        className="mt-5 font-display text-3xl font-semibold leading-tight text-white sm:text-4xl"
                      >
                        {currentSlide.title}
                      </motion.h2>
                      <motion.p
                        key={currentSlide.body + '-hero-body'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.1 }}
                        className="mt-4 text-sm leading-relaxed text-slate-100/90 sm:text-base"
                      >
                        {currentSlide.body}
                      </motion.p>
                    </div>

                    <div className={`mt-8 rounded-2xl border border-white/10 ${currentSlide.accent} px-4 py-3`}>
                      <p className="text-xs uppercase tracking-[0.22em] text-white/70">Slide {activeSlide + 1} of 3</p>
                      <p className="mt-2 text-sm text-white/90">Auto-rotating story flow with calm pacing.</p>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-black/30 p-4">
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/10" />
                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[22px] border border-white/10 bg-black/20 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                      <motion.img
                        key={currentSlide.title + '-hero-visual'}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.65, ease: 'easeOut' }}
                        src={`https://placehold.co/960x1200/${activeSlide === 0 ? '24113F' : activeSlide === 1 ? '0E1436' : '052033'}/${activeSlide === 0 ? 'F4D4E8' : activeSlide === 1 ? 'D9D9FF' : 'CFFBFF'}?text=${encodeURIComponent(currentSlide.title)}`}
                        alt={`AnMind slide visual for ${currentSlide.title}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Session pulse</p>
                        <p className="mt-1 text-sm text-white">Calm focus, breath by breath.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {slides.map((slide, index) => (
                          <button
                            key={slide.title}
                            type="button"
                            aria-label={`Go to slide ${index + 1}`}
                            onClick={() => setActiveSlide(index)}
                            className={`h-2.5 rounded-full transition-all duration-300 ${
                              index === activeSlide ? 'w-8 bg-white' : 'w-2.5 bg-white/35 hover:bg-white/55'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        key={activeSlide + '-progress'}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 4.5, ease: 'linear' }}
                        className="h-full origin-left rounded-full bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-200 will-change-transform"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
