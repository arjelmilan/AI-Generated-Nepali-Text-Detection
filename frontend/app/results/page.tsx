'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import ResultsGauge from '../components/ResultsGauge';
import HeatmapVisualization from '../components/HeatmapVisualization';
import MetricsCards from '../components/MetricsCards';
import { AnalyzeResponse } from '../services/api';

export default function ResultsPage() {
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const start = performance.now();
    const raw = sessionStorage.getItem('nepdetect_last_result');
    if (raw) {
      try {
        setResult(JSON.parse(raw) as AnalyzeResponse);
        setElapsedMs(Math.round(performance.now() - start));
      } catch {
        // Corrupted data — go back
        router.replace('/analyze');
      }
    }
  }, [router]);

  // Derived display values
  const score = result ? Math.round(result.probability * 100) : null;
  const label = result?.prediction ?? null;

  // Show a "no result" state if nothing is stored
  if (result === null) {
    return (
      <div style={styles.noResult}>
        <div style={styles.noResultIcon}>🔍</div>
        <h2>No analysis result yet</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Submit a text from the analyzer first.
        </p>
        <button style={styles.backBtn} onClick={() => router.push('/analyze')}>
          Go to Analyzer →
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar perplexity={82} variance={76} />

      <div style={{ flex: 1, padding: '40px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={styles.titleRow}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px' }}>Analysis Results</h1>
            <button style={styles.backBtn} onClick={() => router.push('/analyze')}>← New Analysis</button>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            AI classification complete
           
            {` · ${result.tokens_count} tokens `}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', position: 'relative' }}>
          <ResultsGauge
            score={score ?? 0}
            label={label ?? ''}
            description={
              label === 'AI'
                ? `The model classified this text as AI-generated with ${score}% confidence.`
                : `The model classified this text as Human-written with ${score}% confidence.`
            }
          />
          <HeatmapVisualization htmlViz={result.html_viz} />
        </div>


        {/* <MetricsCards tokensCount={result.tokens_count} chunksCount={result.chunks_count} /> */}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  noResult: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '70vh',
    color: 'var(--text-primary)',
    textAlign: 'center',
  },
  noResultIcon: {
    fontSize: '3rem',
    marginBottom: '16px',
    opacity: 0.5,
  },
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  backBtn: {
    padding: '8px 18px',
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
  },
};
