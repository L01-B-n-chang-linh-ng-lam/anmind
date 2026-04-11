import { motion } from 'framer-motion';
import { PlayCircle, Wind, ShieldCheck } from 'lucide-react';
import Container from './Container';
import SectionReveal from './SectionReveal';

const steps = [
  {
    title: 'Open the reset',
    detail: 'When stress spikes, the first step is already waiting for you.',
    icon: PlayCircle,
  },
  {
    title: 'Follow the breath',
    detail: 'The rhythm gives your mind something steady to hold onto.',
    icon: Wind,
  },
  {
    title: 'Return to the moment',
    detail: 'Tension eases, the noise softens, and you come back with more room to think.',
    icon: ShieldCheck,
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionReveal
          className="mb-8 text-center"
        >
          <h2 className="section-title">How It Works</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            The experience is designed to feel like a hand on your shoulder, not another task to complete.
          </p>
        </SectionReveal>

        <motion.div
          className="grid gap-4 md:grid-cols-3"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.14 } },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.article
                key={step.title}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.72, ease: 'easeOut' } },
                }}
                className="section-glass group p-6 transition duration-300 ease-out will-change-transform hover:scale-[1.02] hover:shadow-[0_0_34px_rgba(139,92,246,0.14)]"
              >
                <div className="mb-4 inline-flex rounded-xl border border-white/20 bg-white/8 p-3 text-violet-100 transition group-hover:border-violet-200/70 group-hover:bg-violet-500/20">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mb-2 text-xs uppercase tracking-[0.24em] text-slate-400">Step {index + 1}</p>
                <h3 className="font-display text-xl text-white">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{step.detail}</p>
              </motion.article>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
};

export default HowItWorks;
