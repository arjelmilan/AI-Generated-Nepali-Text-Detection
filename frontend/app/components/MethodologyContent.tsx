import React from 'react';

export default function MethodologyContent() {
  return (
    <div style={styles.container}>
      <div style={styles.intro}>
        <h1 style={styles.title}>The Science of Detection</h1>
        <p style={styles.subtitle}>
          Unveiling the forensic methodology behind AI content analysis. Our engine utilizes advanced 
          linguistic markers to distinguish between synthetic and human-generated Devanagari prose.
        </p>
      </div>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Detection Mechanics</h2>
        <div style={styles.cardGrid}>
          <div style={styles.featureCard}>
            <div style={styles.cardIcon}>📊</div>
            <h3 style={styles.cardTitle}>Perplexity Analysis</h3>
            <p style={styles.cardText}>
              Measuring the randomness of word choices. AI models typically select highly probable word 
              sequences, leading to low perplexity scores compared to the erratic nature of human creativity.
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.cardIcon}>📈</div>
            <h3 style={styles.cardTitle}>Burstiness Patterns</h3>
            <p style={styles.cardText}>
              Analyzing variance in sentence length and structure. Human writing is naturally 'bursty'—mixing 
              long, complex thoughts with short, punchy statements.
            </p>
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Engine Features</h2>
        <div style={styles.cardGrid}>
          <div style={styles.featureCard}>
            <div style={styles.cardIcon}>🇳🇵</div>
            <h3 style={styles.cardTitle}>Contextual Sensitivity</h3>
            <p style={styles.cardText}>
              Our engine is specifically trained on high-quality Nepali literature, journalism, and academic 
              papers to understand the nuanced grammar of Noto Serif Devanagari.
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.cardIcon}>🔒</div>
            <h3 style={styles.cardTitle}>Security First</h3>
            <p style={styles.cardText}>
              Data analyzed through AI nepali text detection is never stored or used to retrain models. Your intellectual 
              property remains encrypted and volatile in-memory.
            </p>
          </div>
        </div>
      </section>

      <section id="api" style={styles.section}>
        <h2 style={styles.sectionTitle}>Researcher & API Access</h2>
        <p style={{ ...styles.subtitle, marginBottom: '32px' }}>
          Integrate our forensic engine into your editorial workflow or academic research via our REST API. 
          Optimized for high-throughput batch analysis.
        </p>

        <div style={styles.apiBox}>
          <div style={styles.apiHeader}>
            <span style={styles.apiTitle}>POST /v1/analyze</span>
            <span style={styles.apiPill}>Enterprise Plan</span>
          </div>
          <div style={styles.apiCode}>
<pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{`curl -X POST https://api.ainepalitextdetection.com/v1/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "नेपालको संविधान २०७२ को धारा ४ अनुसार...",
    "mode": "forensic_deep",
    "language": "ne-NP"
  }'`}</pre>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  intro: {
    marginBottom: '48px',
  },
  title: {
    fontSize: 'clamp(2rem, 4vw, 2.5rem)',
    fontWeight: 800,
    letterSpacing: '-1px',
    marginBottom: '16px',
    background: 'linear-gradient(135deg, var(--text-primary), var(--text-secondary))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: 0,
  },
  subtitle: {
    fontSize: '1.125rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.7,
    margin: 0,
  },
  section: {
    marginBottom: '64px',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '24px',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderLeft: '4px solid var(--accent)',
    paddingLeft: '12px',
    lineHeight: 1,
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    marginTop: '32px',
  },
  featureCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '32px',
  },
  cardIcon: {
    width: '40px',
    height: '40px',
    background: 'var(--accent-glow)',
    color: 'var(--accent)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
    marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '1.125rem',
    fontWeight: 600,
    marginBottom: '12px',
    margin: 0,
    color: 'var(--text-primary)',
  },
  cardText: {
    fontSize: '0.9375rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.7,
    margin: 0,
  },
  apiBox: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
  },
  apiHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
  },
  apiTitle: {
    fontWeight: 600,
    color: 'var(--text-primary)',
    wordBreak: 'break-word',
  },
  apiCode: {
    padding: '24px',
    background: '#000',
    color: '#00ff00',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.875rem',
    overflowX: 'auto',
    lineHeight: 1.6,
  },
  apiPill: {
    display: 'inline-flex',
    background: 'var(--accent-glow)',
    color: 'var(--accent)',
    fontSize: '0.75rem',
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: '100px',
    border: '1px solid rgba(16, 183, 72, 0.2)',
    whiteSpace: 'nowrap',
  }
};
