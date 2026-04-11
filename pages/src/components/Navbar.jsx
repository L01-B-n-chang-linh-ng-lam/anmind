import Container from './Container';
import Button from './Button';

const links = [
  { label: 'Problem', href: '#problem' },
  { label: 'Insight', href: '#insight' },
  { label: 'Solution', href: '#solution' },
  { label: 'Experience', href: '#experience' },
  { label: 'Features', href: '#features' },
];

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-3 text-white transition hover:opacity-90">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/10 font-display text-lg font-semibold shadow-[0_0_24px_rgba(139,92,246,0.28)]">
            A
          </span>
          <div className="leading-tight">
            <div className="font-display text-base font-semibold tracking-wide">AnMind</div>
            <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Reset with clarity</div>
          </div>
        </a>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button href="https://www.behance.net/gallery/245651213/AnMind" className="hidden sm:inline-flex">
            View Case Study
          </Button>
          <a
            href="#problem"
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/10"
          >
            Explore
          </a>
        </div>
      </Container>
    </header>
  );
};

export default Navbar;
