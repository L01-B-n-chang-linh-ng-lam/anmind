import { motion } from 'framer-motion';
import { AlertTriangle, Bell, Brain } from 'lucide-react';
import Container from './Container';
import SectionReveal from './SectionReveal';
import problemImage from '../assets/problem.jpeg';

const bullets = [
  { icon: Bell, text: 'A work message lands at the worst time and the whole body tenses before you can answer.' },
  { icon: Brain, text: 'Your thoughts keep looping, but nothing in the moment helps slow them down.' },
  { icon: AlertTriangle, text: 'When stress peaks, most wellness apps ask for too much effort before they help.' },
];

const Problem = () => {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch sm:gap-8">
          <SectionReveal className="section-glass p-7 sm:p-8 transition duration-300 ease-out will-change-transform hover:scale-[1.02] hover:shadow-[0_0_45px_rgba(139,92,246,0.16)]" >
            <h2 className="section-title">Problem</h2>
            <p className="mt-4 text-slate-300">
              The hardest moments are rarely dramatic. They are the quiet, crowded ones: a buzzing phone, a racing
              mind, and no space to recover before the next demand arrives.
            </p>

            <motion.ul
              className="mt-7 space-y-4"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.14 } },
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
            >
              {bullets.map(({ icon: Icon, text }) => (
                <motion.li
                  key={text}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
                  }}
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/20 p-4 transition duration-300 ease-out will-change-transform hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_0_28px_rgba(255,255,255,0.08)]"
                >
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-violet-200" />
                  <span className="text-sm leading-relaxed text-slate-200">{text}</span>
                </motion.li>
              ))}
            </motion.ul>
          </SectionReveal>

          <SectionReveal delay={0.08} className="flex flex-col gap-8 h-full">
            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-2xl border border-rose-300/30 bg-gradient-to-br from-rose-500/25 to-orange-500/20 p-6 transition-all duration-300 ease-out will-change-transform hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(244,63,94,0.16)]">
                <p className="text-xs uppercase tracking-[0.2em] text-rose-100/90">Chaos</p>
                <p className="mt-3 text-sm text-rose-50">
                  Fragmented attention, physical tension, and a nervous system stuck in overdrive.
                </p>
              </div>
              <div className="rounded-2xl border border-violet-300/30 bg-gradient-to-br from-violet-500/25 to-cyan-500/20 p-6 transition-all duration-300 ease-out will-change-transform hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(34,211,238,0.16)]">
                <p className="text-xs uppercase tracking-[0.2em] text-violet-100">Calm</p>
                <p className="mt-3 text-sm text-violet-50">
                  A short reset that creates enough room to breathe, think, and move forward again.
                </p>
              </div>
            </div>
            <motion.div className="mt-6 flex-grow overflow-hidden rounded-2xl border border-white/10 bg-black/20 transition duration-300 ease-out will-change-transform hover:shadow-[0_0_45px_rgba(139,92,246,0.14)]" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.7, ease: 'easeOut', delay: 0.12 }}>
              <motion.img
                src={problemImage}
                alt="Visual contrast showing chaotic mental state transforming into calm clarity"
                className="h-full w-full object-cover"
                initial={{ scale: 0.95 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />
            </motion.div>
          </SectionReveal>
        </div>
      </Container>
    </section>
  );
};

export default Problem;
