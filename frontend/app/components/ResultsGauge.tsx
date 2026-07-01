'use client';

import React, { useEffect, useState } from 'react';

interface ResultsGaugeProps {
  score?: number;
  label?: string;
  description?: string;
}

export default function ResultsGauge({ 
  score = 92, 
  label = "Likely Human",
  description = "The text demonstrates high structural complexity and natural linguistic variance consistent with human writing."
}: ResultsGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Simple animation for the score
    const duration = 1500;
    const steps = 60;
    const stepTime = Math.abs(Math.floor(duration / steps));
    let currentScore = 0;
    
    const timer = setInterval(() => {
      currentScore += (score / steps);
      if (currentScore >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(currentScore));
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [score]);

  // SVG Gauge calculations
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Softmax Probability</h3>
      
      <div style={styles.gaugeWrapper}>
        <svg style={styles.svg} viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth="12"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 0.5s ease-out',
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%',
            }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--accent-dark)" />
              <stop offset="100%" stopColor="var(--accent)" />
            </linearGradient>
          </defs>
        </svg>

        <div style={styles.scoreText}>
          <span style={styles.percentage}>{animatedScore}%</span>
          <span style={styles.label}>{label}</span>
        </div>
      </div>

      <p style={styles.description}>{description}</p>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '32px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  title: {
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: '32px',
    alignSelf: 'flex-start',
  },
  gaugeWrapper: {
    position: 'relative',
    width: '200px',
    height: '200px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  scoreText: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  percentage: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    lineHeight: 1,
    marginBottom: '4px',
  },
  label: {
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: 'var(--accent)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  description: {
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
    margin: 0,
  }
};
