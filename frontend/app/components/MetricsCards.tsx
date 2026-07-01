'use client';

import React from 'react';

interface MetricsCardsProps {
  perplexity?: number;
  variance?: number;
  vocabulary?: string;
  tokensCount?: number;
  chunksCount?: number;
}

export default function MetricsCards({ 
  perplexity = 4.2, 
  variance = 8, 
  vocabulary = "Top 5%",
  tokensCount,
  chunksCount,
}: MetricsCardsProps) {
  return (
    <div style={styles.grid}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h4 style={styles.title}>Perplexity</h4>
          <div style={styles.icon}>📊</div>
        </div>
        <div style={styles.value}>
          {perplexity}<span style={styles.unit}>%</span>
        </div>
        <div>
          <span style={{...styles.trend, ...styles.positive}}>↑ Above Avg</span>
        </div>
        <p style={styles.description}>
          Measures how surprised the AI model is by the word sequences. High perplexity indicates human-like randomness.
        </p>
      </div>

      <div style={styles.card}>
        <div style={styles.header}>
          <h4 style={styles.title}>Sentence Variation</h4>
          <div style={styles.icon}>📈</div>
        </div>
        <div style={styles.value}>
          {variance}<span style={styles.unit}>structures</span>
        </div>
        <div>
          <span style={{...styles.trend, ...styles.positive}}>✓ Natural</span>
        </div>
        <p style={styles.description}>
          Human writing typically features varied sentence lengths. This document shows natural variation across all paragraphs.
        </p>
      </div>

      <div style={styles.card}>
        <div style={styles.header}>
          <h4 style={styles.title}>{tokensCount !== undefined ? 'Token Analysis' : 'Vocabulary Richness'}</h4>
          <div style={styles.icon}>{tokensCount !== undefined ? '🔢' : '📚'}</div>
        </div>
        {tokensCount !== undefined ? (
          <>
            <div style={styles.value}>
              {tokensCount}<span style={styles.unit}>tokens</span>
            </div>
            <div>
              <span style={{...styles.trend, ...styles.positive}}>
                {chunksCount !== undefined ? `${chunksCount} chunk${chunksCount !== 1 ? 's' : ''}` : '—'}
              </span>
            </div>
            <p style={styles.description}>
              Total tokens in the submitted text. Texts over ~510 tokens are split into chunks and averaged for SHAP analysis.
            </p>
          </>
        ) : (
          <>
            <div style={styles.value}>
              {vocabulary}<span style={styles.unit}></span>
            </div>
            <div>
              <span style={{...styles.trend, ...styles.positive}}>★ High TTR</span>
            </div>
            <p style={styles.description}>
              Type-Token Ratio (TTR) indicates the lexical variety. Higher values suggest a more sophisticated vocabulary choice.
            </p>
          </>
        )}
      </div>
    </div>
  );
}


const styles: { [key: string]: React.CSSProperties } = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    marginTop: '24px',
  },
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
  },
  icon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.03)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
  },
  value: {
    fontSize: '2rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
  },
  unit: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'var(--text-secondary)',
  },
  trend: {
    fontSize: '0.8125rem',
    fontWeight: 500,
    padding: '4px 8px',
    borderRadius: '4px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  },
  positive: {
    background: 'rgba(16, 183, 72, 0.1)',
    color: 'var(--accent)',
  },
  negative: {
    background: 'rgba(238, 43, 43, 0.1)',
    color: '#ee2b2b',
  },
  description: {
    fontSize: '0.8125rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid var(--border)',
    marginBottom: 0,
  }
};
