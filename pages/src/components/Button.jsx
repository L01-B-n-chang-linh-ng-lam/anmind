const baseClass =
  'inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition duration-300 ease-out will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black';

const variants = {
  primary:
    'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-[0_0_30px_rgba(139,92,246,0.45)] hover:-translate-y-0.5 hover:scale-[1.02] hover:from-violet-400 hover:to-fuchsia-400 hover:shadow-[0_0_44px_rgba(139,92,246,0.55)]',
  secondary:
    'border border-white/25 bg-white/5 text-slate-100 backdrop-blur hover:-translate-y-0.5 hover:border-violet-300/60 hover:bg-white/10 hover:shadow-[0_0_34px_rgba(255,255,255,0.1)]',
};

const Button = ({ children, href, variant = 'primary', className = '' }) => {
  const classes = `${baseClass} ${variants[variant]} ${className}`.trim();

  return (
    <a href={href} target="_blank" rel="noreferrer" className={classes}>
      {children}
    </a>
  );
};

export default Button;
