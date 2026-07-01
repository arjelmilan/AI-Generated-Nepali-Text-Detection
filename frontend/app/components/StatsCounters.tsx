'use client';

import React, { useEffect, useState } from 'react';
import { getSystemStats, StatsData } from '../services/api';

export default function StatsCounters() {
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getSystemStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load stats", error);
      }
    }
    loadStats();
  }, []);

  if (!stats) return null; // Or a loading skeleton

  return (
    <div style={styles.container}>
      <div style={styles.statCard}>
        <div style={styles.statHeader}>
          <span style={styles.statIcon}>📈</span> Total Analysis Count
        </div>
        <div style={styles.statValue}>
          {stats.totalCount.toLocaleString()}
        </div>
        <div style={styles.indicator}>
          <span style={{...styles.dot, ...styles.green}}></span> Daily avg: +{stats.dailyAvg}
        </div>
      </div>

      <div style={styles.statCard}>
        <div style={styles.statHeader}>
          <span style={styles.statIcon}>⚠️</span> High Probability Flags
        </div>
        <div style={styles.statValue}>
          {stats.flagCount.toLocaleString()}
        </div>
        <div style={styles.indicator}>
          <span style={{...styles.dot, ...styles.yellow}}></span> {stats.flagRate}% flag rate
        </div>
      </div>

      <div style={styles.statCard}>
        <div style={styles.statHeader}>
          <span style={styles.statIcon}>⚡</span> System Load
        </div>
        <div style={styles.statValue}>
          {stats.systemLoad}
        </div>
        <div style={styles.indicator}>
          <span style={{...styles.dot, ...styles.green}}></span> {stats.avgResponseMs}ms avg response
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
  },
  statCard: {
    flex: '1 1 300px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
  },
  statHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--text-muted)',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: 600,
    marginBottom: '8px',
  },
  statIcon: {
    fontSize: '1rem',
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
    margin: 0,
    marginBottom: '8px',
  },
  indicator: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.8125rem',
    color: 'var(--text-secondary)',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  green: { background: 'var(--accent)' },
  red: { background: '#ee2b2b' },
  yellow: { background: '#ee9d2b' },
};
