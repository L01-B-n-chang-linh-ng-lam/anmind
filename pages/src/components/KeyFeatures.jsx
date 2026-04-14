import { motion } from 'framer-motion';
import { Gauge, Compass, LineChart, Smile } from 'lucide-react';
import Container from './Container';
import SectionReveal from './SectionReveal';

const features = [
  {
    title: 'Immediate Relief',
    text: 'Start a guided reset instantly when stress begins to build.',
    icon: Gauge,
  },
  {
    title: 'Meditation Station',
    text: 'Choose a session that fits your mood and reset without overthinking.',
    icon: Compass,
  },
  {
    title: 'Visible Progress',
    text: 'Track your progress and see your calm improve over time.',
    icon: LineChart,
  },
  {
    title: 'Mood Awareness',
    text: 'Check in with your emotions and catch stress before it escalates.',
    icon: Smile,
  },
];

const KeyFeatures = () => {
  return (
    <section className="pb-20 pt-16 sm:pb-24 sm:pt-20">
      <Container>
        <SectionReveal
          className="mb-8 text-center"
        >
          <h2 className="section-title">Key Features</h2>
        </SectionReveal>

        <motion.div
          className="grid gap-4 md:grid-cols-2"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.title}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.72, ease: 'easeOut' } },
                }}
                className="section-glass group rounded-2xl p-6 transition duration-300 ease-out will-change-transform hover:scale-[1.02] hover:border-violet-300/40 hover:bg-white/10 hover:shadow-[0_0_40px_rgba(139,92,246,0.16)]"
              >
                <div className="mb-4 inline-flex rounded-xl border border-white/20 bg-black/20 p-3 text-violet-100 transition group-hover:border-violet-200/70 group-hover:bg-violet-500/20">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-xl text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{feature.text}</p>
              </motion.article>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
};

export default KeyFeatures;
