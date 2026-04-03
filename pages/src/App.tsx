import React, { useEffect, useState } from "react";
import resetImg from "./assets/reset.png";

// ===== FADE IN HOOK =====
const useFadeIn = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0px)" : "translateY(40px)",
    transition: "all 0.8s ease",
  };
};

// ===== IMAGE COMPONENT =====
const Img = ({ src, alt }: { src: string; alt: string }) => (
  <img
    src={src}
    alt={alt}
    style={{
      width: "100%",
      borderRadius: 16,
      marginTop: 12,
      transition: "transform 0.4s ease",
    }}
    onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
    onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
  />
);

const App: React.FC = () => {
  const fade = useFadeIn();

  return (
    <div style={styles.container}>
      {/* HERO */}
      <section style={styles.hero}>
        <div style={fade}>
          <h1 style={styles.title}>
            Reset your mind.<br />In 5 minutes.
          </h1>

          <p style={styles.subtitle}>
            A gentle pause in a noisy digital world.
          </p>

          <p style={styles.description}>
            AnMind helps you escape overthinking, reduce burnout,
            and reconnect with yourself through short, mindful moments.
          </p>

          <div style={styles.buttonGroup}>
            <a href="https://github.com/L01-B-n-chang-linh-ng-lam/anmind/wiki" style={styles.primaryButton}>
              GitHub
            </a>
            <a
              href="https://www.figma.com/design/DRZNecxnNHjyeHo5rhXKVU/AnMind"
              target="_blank"
              style={styles.secondaryButton}
            >
              Figma
            </a>
            <a
              href="https://www.behance.net/gallery/245651213/AnMind"
              target="_blank"
              style={styles.secondaryButton}
            >
              Behance
            </a>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section style={styles.section}>
        <h2 style={styles.heading}>The Problem</h2>

        <p style={styles.text}>
          Constant notifications, endless scrolling, and mental overload
          have made it difficult for people to pause and reconnect.
        </p>

        <div style={styles.problemGrid}>
          <div style={styles.problemItem}>Overthinking at night</div>
          <div style={styles.problemItem}>Burnout after work</div>
          <div style={styles.problemItem}>No mental clarity</div>
        </div>
      </section>

      {/* STORY */}
      <section style={styles.sectionDark}>
        <h2 style={styles.heading}>A familiar moment</h2>

        <p style={styles.text}>“Just one more video…”</p>
        <p style={styles.text}>→ Suddenly it’s 2AM.</p>

        <p style={styles.highlight}>
          What if you could stop in just 5 minutes?
        </p>
      </section>

      {/* SOLUTION */}
      <section style={styles.section}>
        <h2 style={styles.heading}>The Solution</h2>

        <p style={styles.text}>
          AnMind acts as a smart pause button — helping you reset,
          breathe, and regain control instantly.
        </p>
      </section>

      {/* FEATURES */}
      <section style={styles.section}>
        <h2 style={styles.heading}>Core Features</h2>

        <div style={styles.grid}>
          <div style={styles.card}>
            <h3>Reset System</h3>
            <p>Guided breathing sessions in just a few minutes.</p>
            <Img
              src={resetImg}
              alt="Breathing meditation interface"
            />
          </div>

          <div style={styles.card}>
            <h3>Meditation Station</h3>
            <p>Join real-time sessions and feel connected.</p>
            <Img
              src={resetImg}
              alt="Live meditation session"
            />
          </div>

          <div style={styles.card}>
            <h3>Mental Tracking</h3>
            <p>Understand your emotions and patterns.</p>
            <Img
              src={resetImg}
              alt="Emotion tracking dashboard"
            />
          </div>
        </div>
      </section>

      {/* SHOWCASE */}
      <section style={styles.sectionAlt}>
        <h2 style={styles.heading}>Product Screens</h2>

        <div style={styles.grid}>
          <Img src={resetImg} alt="Home screen" />
          <Img src={resetImg} alt="Session screen" />
          <Img src={resetImg} alt="Tracking screen" />
        </div>
      </section>

      {/* TECH */}
      <section style={styles.section}>
        <h2 style={styles.heading}>Technology</h2>
        <ul style={styles.list}>
          <li>Frontend: React / Next.js</li>
          <li>Backend: Spring Boot</li>
          <li>Database: PostgreSQL</li>
          <li>Cloud: Docker + Kubernetes</li>
        </ul>
      </section>

      {/* TEAM */}
      <section style={styles.sectionAlt}>
        <h2 style={styles.heading}>Team</h2>
        <ul style={styles.list}>
          <li>Product Designer</li>
          <li>Frontend Developer</li>
          <li>Backend Engineer</li>
        </ul>
      </section>

      {/* CTA */}
      <section style={styles.cta}>
        <h2>Take a pause.</h2>
        <p>Just 5 minutes can change everything.</p>
        <button style={styles.primaryButton}>Download App</button>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>© 2026 AnMind</footer>
    </div>
  );
};

export default App;

// ===== STYLES =====

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    background: "linear-gradient(180deg, #1f2276, #512f89)",
    color: "white",
  },

  hero: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: 20,
  },

  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 56,
    fontWeight: 500,
  },

  subtitle: {
    marginTop: 20,
    opacity: 0.7,
    fontWeight: 300,
  },

  description: {
    marginTop: 20,
    maxWidth: 600,
    opacity: 0.8,
  },

  heading: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 32,
  },

  section: {
    padding: "80px 20px",
    maxWidth: 1000,
    margin: "auto",
  },

  sectionAlt: {
    padding: "80px 20px",
    background: "rgba(255,255,255,0.05)",
  },

  sectionDark: {
    padding: "80px 20px",
    background: "rgba(0,0,0,0.3)",
    textAlign: "center",
  },

  text: {
    marginTop: 20,
    opacity: 0.85,
    lineHeight: 1.8,
  },

  highlight: {
    marginTop: 20,
    color: "#c084fc",
    fontWeight: 500,
  },

  problemGrid: {
    display: "flex",
    gap: 20,
    marginTop: 30,
  },

  problemItem: {
    flex: 1,
    padding: 20,
    background: "rgba(255,255,255,0.05)",
    borderRadius: 12,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 20,
    marginTop: 40,
  },

  card: {
    padding: 20,
    borderRadius: 16,
    background: "rgba(255,255,255,0.05)",
  },

  list: {
    marginTop: 20,
    lineHeight: 1.8,
  },

  buttonGroup: {
    display: "flex",
    gap: 16,
    justifyContent: "center",
    marginTop: 20,
  },

  primaryButton: {
    padding: "12px 24px",
    borderRadius: 999,
    background: "white",
    color: "black",
    border: "none",
  },

  secondaryButton: {
    padding: "12px 24px",
    borderRadius: 999,
    border: "1px solid white",
    color: "white",
    textDecoration: "none",
  },

  cta: {
    textAlign: "center",
    padding: "80px 20px",
  },

  footer: {
    textAlign: "center",
    padding: 40,
    opacity: 0.6,
  },
};