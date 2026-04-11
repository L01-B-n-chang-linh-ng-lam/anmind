import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Container from './Container';
import SectionReveal from './SectionReveal';

const Solution = () => {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <SectionReveal className="section-glass p-7 sm:p-8 transition duration-300 ease-out will-change-transform hover:scale-[1.02] hover:shadow-[0_0_45px_rgba(139,92,246,0.16)]">
            <h2 className="section-title">Solution</h2>
            <p className="mt-4 text-slate-300">
              AnMind removes the usual friction between feeling overwhelmed and getting help. One tap opens a guided
              reset, so users do not have to search, read, or decide what to do next.
            </p>

            <div className="mt-6 rounded-xl border border-violet-300/25 bg-violet-500/10 p-4">
              <div className="flex items-center gap-2 text-violet-100">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold">Why it feels faster</span>
              </div>
              <p className="mt-2 text-sm text-violet-50/90">
                The app starts in the exact moment stress peaks, skipping setup and leading directly into the calming
                sequence.
              </p>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.08} className="section-glass overflow-hidden p-3 transition duration-300 ease-out will-change-transform hover:scale-[1.02] hover:shadow-[0_0_45px_rgba(34,211,238,0.14)]">
            <motion.div className="overflow-hidden rounded-2xl border border-white/10" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.72, ease: 'easeOut' }}>
              <motion.img
                src="https://placehold.co/1000x680/11183B/C9D8FF?text=Instant+Reset+Preview"
                alt="AnMind UI preview of the instant reset breathing interface"
                className="h-full w-full object-cover"
                initial={{ scale: 0.95 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.72, ease: 'easeOut' }}
              />
            </motion.div>
          </SectionReveal>
        </div>
      </Container>
    </section>
  );
};

export default Solution;
