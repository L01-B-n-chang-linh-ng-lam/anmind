import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import Problem from '../components/Problem';
import Insight from '../components/Insight';
import Solution from '../components/Solution';
import HowItWorks from '../components/HowItWorks';
import CoreExperience from '../components/CoreExperience';
import KeyFeatures from '../components/KeyFeatures';
import AppScreensCarousel from '../components/AppScreensCarousel';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <main id="top" className="relative min-h-screen overflow-hidden bg-gradient-to-b from-purple-900 via-indigo-900 to-black">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute left-1/4 top-0 h-72 w-72 animate-drift rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 animate-drift rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute left-0 top-1/3 h-[28rem] w-[28rem] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <section id="problem">
          <Problem />
        </section>
        <section id="insight">
          <Insight />
        </section>
        <section id="solution">
          <Solution />
        </section>
        <HowItWorks />
        <section id="experience">
          <CoreExperience />
        </section>
        <section id="features">
          <KeyFeatures />
        </section>
        <section id="screens">
          <AppScreensCarousel />
        </section>
        <Footer />
      </div>
    </main>
  );
};

export default LandingPage;
