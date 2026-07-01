'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getRecentScans, HistoryItem } from '../../services/api';
import Sidebar from '../../components/Sidebar';

export default function HistoryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id ? decodeURIComponent(params.id as string) : '';
  const [scan, setScan] = useState<HistoryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function loadScan() {
      try {
        const data = await getRecentScans();
        const found = data.find((item) => item.id === id);
        if (found) {
          setScan(found);
        }
      } catch (error) {
        console.error("Failed to fetch scan details", error);
      } finally {
        setLoading(false);
      }
    }
    loadScan();
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '40px', textAlign: 'center' }}>Loading...</div>
      </div>
    );
  }

  if (!scan) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '40px', textAlign: 'center' }}>
          <h2>Scan not found</h2>
          <button style={styles.backBtn} onClick={() => router.push('/history')}>Back to History</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => router.push('/history')}>← Back</button>
          <h1 style={styles.title}>Scan Details: {scan.id}</h1>
        </div>
        
        <div style={styles.card}>
          <div style={styles.metaRow}>
            <div>
              <span style={styles.label}>Date</span>
              <div style={styles.value} title={new Date(scan.date + (!scan.date.includes('Z') ? 'Z' : '')).toLocaleString()}>{timeAgo(scan.date)}</div>
            </div>
            <div>
              <span style={styles.label}>Classification</span>
              <div style={styles.value}>
                <span style={{...styles.badge, ...getBadgeStyle(scan.type)}}>{scan.type}</span>
              </div>
            </div>
            <div>
              <span style={styles.label}>Softmax Probability</span>
              <div style={styles.value}>{scan.score}%</div>
            </div>
          </div>
          
          <div style={styles.textSection}>
            <span style={styles.label}>Analyzed Text</span>
            <div style={styles.textContainer}>
              {scan.text}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const getBadgeStyle = (type: string) => {
  switch (type) {
    case 'Human': return styles.badgeHuman;
    case 'AI': return styles.badgeAI;
    case 'Mixed': return styles.badgeMixed;
    default: return {};
  }
};

const timeAgo = (dateString: string): string => {
  let normalized = dateString;
  if (!normalized.includes('Z') && !normalized.match(/[+-]\d{2}(?::?\d{2})?$/)) {
    normalized += 'Z';
  }
  const date = new Date(normalized);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " mins ago";
  if (seconds < 10) return "just now";
  return Math.floor(seconds) + " secs ago";
};

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '32px',
  },
  backBtn: {
    padding: '8px 16px',
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 700,
    margin: 0,
  },
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '32px',
  },
  metaRow: {
    display: 'flex',
    gap: '40px',
    marginBottom: '32px',
    paddingBottom: '24px',
    borderBottom: '1px solid var(--border)',
    flexWrap: 'wrap',
  },
  label: {
    fontSize: '0.8125rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '8px',
    display: 'block',
    fontWeight: 600,
  },
  value: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  textSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  textContainer: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '24px',
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
    minHeight: '200px',
  },
  badge: {
    padding: '4px 10px',
    borderRadius: '100px',
    fontSize: '0.875rem',
    fontWeight: 600,
    display: 'inline-flex',
  },
  badgeHuman: {
    background: 'rgba(16, 183, 72, 0.15)',
    color: 'var(--accent)',
    border: '1px solid rgba(16, 183, 72, 0.3)',
  },
  badgeAI: {
    background: 'rgba(238, 43, 43, 0.15)',
    color: '#ee2b2b',
    border: '1px solid rgba(238, 43, 43, 0.3)',
  },
  badgeMixed: {
    background: 'rgba(238, 157, 43, 0.15)',
    color: '#ee9d2b',
    border: '1px solid rgba(238, 157, 43, 0.3)',
  },
};
