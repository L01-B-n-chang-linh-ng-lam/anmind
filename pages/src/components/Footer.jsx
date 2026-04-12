import Container from './Container';
import logoImage from '../assets/logo.svg';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-black/30 py-10 backdrop-blur-sm">
      <Container>
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.9fr_0.9fr] md:items-start">
          <div>
            <div className="flex items-center gap-3 text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white shadow-[0_0_24px_rgba(139,92,246,0.28)]">
                <img src={logoImage} alt="AnMind Logo" className="h-8 w-8" />
              </span>
              <div>
                <div className="font-display text-lg font-semibold">AnMind</div>
                <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Reset your mind instantly</div>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-300">
              A product story built around the exact moment stress arrives, and the brief reset that helps people
              come back clear.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Contact</p>
            <a href="mailto:nguyenvu04.work@gmail.com" className="mt-3 block text-sm text-white transition hover:text-violet-200">
              nguyenvu04.work@gmail.com
            </a>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Links</p>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <a
                href="https://www.behance.net/gallery/245651213/AnMind"
                target="_blank"
                rel="noreferrer"
                className="text-white transition hover:text-violet-200"
              >
                Behance
              </a>
              <a
                href="https://www.figma.com/design/DRZNecxnNHjyeHo5rhXKVU/AnMind?node-id=6-2&t=mpaZsEapt7izqqxQ-1"
                target="_blank"
                rel="noreferrer"
                className="text-white transition hover:text-violet-200"
              >
                Figma
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-5 text-sm text-slate-400">
          © 2026 AnMind. All rights reserved.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
