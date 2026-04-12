import { motion } from 'framer-motion';
import { Headphones } from 'lucide-react';
import Container from './Container';
import SectionReveal from './SectionReveal';
import calmImage from '../assets/core-experience.png';

const CoreExperience = () => {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionReveal className="section-glass relative overflow-hidden p-7 sm:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(167,139,250,0.18),transparent_55%),radial-gradient(circle_at_80%_60%,rgba(34,211,238,0.16),transparent_50%)]" />
          <div className="pointer-events-none absolute -right-14 top-1/2 h-52 w-52 -translate-y-1/2 animate-pulseSoft rounded-full bg-violet-500/30 blur-3xl will-change-transform" />
          <div className="pointer-events-none absolute left-8 top-10 h-36 w-36 rounded-full bg-cyan-300/10 blur-3xl animate-float will-change-transform" />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.24em] text-violet-200/90">Core Experience</p>
              <h2 className="font-display text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
                The reset becomes a small pocket of stillness that feels larger than the noise around it.
              </h2>
              <p className="mt-4 max-w-2xl text-slate-200">
                A deep visual field, soft motion, and carefully paced breathing cues make the experience feel
                absorbing rather than instructional. It helps the user shift from stress to clarity without breaking
                the mood.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-black/25 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur">
              <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.18em] text-slate-200">
                <Headphones className="h-4 w-4" />
                Deep Focus Mode
              </div>
              <motion.div className="relative overflow-hidden rounded-xl border border-white/10" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.72, ease: 'easeOut' }}>
                <motion.img
                  src={calmImage}
                  alt="Immersive AnMind reset journey with breathing guidance and layered glow"
                  className="h-full w-full object-cover"
                  initial={{ scale: 0.95 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.72, ease: 'easeOut' }}
                />
              </motion.div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs text-slate-300 sm:text-sm">
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">Ambient pace</div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">Soft focus</div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">Clear finish</div>
              </div>
            </div>
          </div>
        </SectionReveal>
      </Container>
    </section>
  );
};

export default CoreExperience;
