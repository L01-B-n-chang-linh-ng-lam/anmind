import React from "react";

const App: React.FC = () => {
  return (
    <div style={styles.container}>
      {/* HERO */}
      <section style={styles.hero}>
        <h1 style={styles.title}>AnMind</h1>
        <p style={styles.subtitle}>
          Reset your mind. Take control of your digital life.
        </p>
        <div style={styles.buttonGroup}>
          <a
            href="https://www.figma.com/design/DRZNecxnNHjyeHo5rhXKVU/AnMind"
            target="_blank"
            style={styles.primaryButton}
          >
            View Figma
          </a>
          <a
            href="https://www.behance.net/gallery/245651213/AnMind"
            target="_blank"
            style={styles.secondaryButton}
          >
            View Case Study
          </a>
        </div>
      </section>

      {/* PROBLEM */}
      <section style={styles.section}>
        <h2>Problem</h2>
        <p style={styles.text}>
          In a world of constant notifications and digital distractions, people
          struggle with overthinking, stress, and burnout. Most mindfulness
          solutions require long-term commitment and are difficult to maintain.
        </p>
      </section>

      {/* SOLUTION */}
      <section style={styles.sectionAlt}>
        <h2>Solution</h2>
        <p style={styles.text}>
          AnMind is a digital mindfulness app designed to provide instant mental
          reset through short guided sessions, real-time social meditation, and
          emotional tracking.
        </p>
      </section>

      {/* FEATURES */}
      <section style={styles.section}>
        <h2>Core Features</h2>

        <div style={styles.grid}>
          <div style={styles.card}>
            <h3>Reset System</h3>
            <p>
              Quick 5–15 minute guided breathing sessions with haptic feedback
              to instantly reduce stress.
            </p>
          </div>

          <div style={styles.card}>
            <h3>Meditation Station</h3>
            <p>
              Join real-time meditation sessions with others to increase
              motivation and reduce loneliness.
            </p>
          </div>

          <div style={styles.card}>
            <h3>Mental Tracking</h3>
            <p>
              Track your emotions, visualize patterns, and build sustainable
              habits.
            </p>
          </div>
        </div>
      </section>

      {/* SHOWCASE */}
      <section style={styles.sectionAlt}>
        <h2>Design Preview</h2>
        <p style={styles.text}>
          Explore selected UI screens and interaction flows in our design
          prototype.
        </p>

        <div style={styles.buttonGroup}>
          <a
            href="https://www.figma.com/design/DRZNecxnNHjyeHo5rhXKVU/AnMind"
            target="_blank"
            style={styles.primaryButton}
          >
            Open Prototype
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <p>© 2026 AnMind Project</p>
      </footer>
    </div>
  );
};

export default App;

// ===== STYLES =====

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: "sans-serif",
    lineHeight: 1.6,
    color: "#111",
  },

  hero: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    color: "white",
    textAlign: "center",
    padding: "0 20px",
  },

  title: {
    fontSize: "48px",
    marginBottom: "10px",
  },

  subtitle: {
    fontSize: "20px",
    opacity: 0.8,
    marginBottom: "30px",
  },

  buttonGroup: {
    display: "flex",
    gap: "16px",
  },

  primaryButton: {
    padding: "12px 24px",
    background: "#3b82f6",
    color: "white",
    textDecoration: "none",
    borderRadius: "8px",
  },

  secondaryButton: {
    padding: "12px 24px",
    border: "1px solid white",
    color: "white",
    textDecoration: "none",
    borderRadius: "8px",
  },

  section: {
    padding: "80px 20px",
    maxWidth: "1000px",
    margin: "0 auto",
  },

  sectionAlt: {
    padding: "80px 20px",
    background: "#f8fafc",
    textAlign: "center",
  },

  text: {
    maxWidth: "700px",
    margin: "0 auto",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginTop: "40px",
  },

  card: {
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },

  footer: {
    textAlign: "center",
    padding: "40px",
    fontSize: "14px",
    color: "#666",
  },
};