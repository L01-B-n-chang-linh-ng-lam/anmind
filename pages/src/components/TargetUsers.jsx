import { motion } from 'framer-motion';
import { BookOpen, Briefcase, Cloud } from 'lucide-react';
import Container from './Container';

const userCards = [
  {
    title: 'Students under pressure',
    description:
      'Dealing with constant deadlines, information overload, and mental fatigue from studying and digital distractions.',
    icon: BookOpen,
  },
  {
    title: 'Young professionals',
    description:
      'Handling fast-paced work, constant notifications, and high cognitive load throughout the day.',
    icon: Briefcase,
  },
  {
    title: 'People who overthink',
    description:
      'Struggling with racing thoughts, anxiety loops, and difficulty calming the mind in stressful moments.',
    icon: Cloud,
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const TargetUsers = () => {
  return (
    <section id="target-users" className="relative py-20">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">Target Users</h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-slate-300">
            Designed for people who need clarity in the middle of chaos — not after it.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {userCards.map(({ title, description, icon: Icon }) => (
            <motion.article
              key={title}
              variants={cardVariants}
              className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:shadow-xl"
              aria-label={title}
            >
              <Icon className="w-6 h-6 text-purple-400 mb-4" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <p className="text-sm text-gray-400 mt-2 leading-relaxed">{description}</p>
            </motion.article>
          ))}
        </motion.div>

        <p className="mt-8 text-center text-sm text-violet-200/85">
          Not for long sessions — built for instant clarity.
        </p>
      </Container>
    </section>
  );
};

export default TargetUsers;