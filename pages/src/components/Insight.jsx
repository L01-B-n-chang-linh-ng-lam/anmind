import Container from './Container';
import SectionReveal from './SectionReveal';

const Insight = () => {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionReveal className="section-glass relative overflow-hidden px-6 py-12 text-center sm:px-12" centered>
          <div className="pointer-events-none absolute left-1/2 top-0 h-44 w-44 -translate-x-1/2 rounded-full bg-violet-400/20 blur-3xl" />
          <p className="mb-4 text-xs uppercase tracking-[0.24em] text-violet-200/90">Insight</p>
          <h2 className="mx-auto max-w-4xl font-display text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
            <span className="gradient-text">Users don’t avoid mindfulness</span> they avoid the effort required to
            start.
          </h2>
        </SectionReveal>
      </Container>
    </section>
  );
};

export default Insight;
