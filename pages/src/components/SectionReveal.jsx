import { motion } from 'framer-motion';

const SectionReveal = ({ children, className = '', delay = 0, centered = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.72, ease: 'easeOut', delay }}
      className={className}
    >
      <div className={centered ? 'mx-auto' : undefined}>{children}</div>
    </motion.div>
  );
};

export default SectionReveal;
