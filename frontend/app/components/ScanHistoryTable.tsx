'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRecentScans, HistoryItem } from '../services/api';

export default function ScanHistoryTable() {
  const [scans, setScans] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadScans() {
      try {
        const data = await getRecentScans();
        setScans(data);
      } catch (error) {
        console.error("Failed to load scans", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadScans();
  }, []);

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

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'Human': return styles.badgeHuman;
      case 'AI': return styles.badgeAI;
      case 'Mixed': return styles.badgeMixed;
      default: return {};
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.tableHeader}>
        <h2 style={styles.tableTitle}>Recent Scans</h2>
        <div style={styles.filters}>
          <button style={{...styles.filterBtn, ...styles.active}}>All</button>
          <button style={styles.filterBtn}>Human</button>
          <button style={styles.filterBtn}>AI Generated</button>
        </div>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Document ID</th>
              <th style={styles.th}>Text Preview</th>
              <th style={styles.th}>Time</th>
              <th style={styles.th}>Detection Result</th>
              <th style={styles.th}>Confidence</th>
              <th style={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} style={{...styles.td, textAlign: 'center', padding: '40px'}}>
                  Loading recent scans...
                </td>
              </tr>
            ) : scans.map((scan) => {
              const isHovered = hoveredRow === scan.id;
              
              return (
                <tr 
                  key={scan.id} 
                  style={{...styles.tr, ...(isHovered ? styles.trHover : {}), cursor: 'pointer'}}
                  onMouseEnter={() => setHoveredRow(scan.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => router.push(`/history/${scan.id}`)}
                >
                  <td style={styles.td}>{scan.id}</td>
                  <td style={styles.td}>
                    <div style={styles.textPreview}>{scan.text}</div>
                  </td>
                  <td style={styles.td}>{timeAgo(scan.date)}</td>
                  <td style={styles.td}>
                    <span style={{...styles.badge, ...getBadgeStyle(scan.type)}}>
                      {scan.type}
                    </span>
                  </td>
                  <td style={styles.td}>{scan.score}%</td>
                  <td style={styles.td}>
                    <button style={styles.actionBtn}>⋮</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={styles.pagination}>
        <span>SHOWING 1-{scans.length} OF 1,248 RECORDS</span>
        <div style={styles.pageControls}>
          <button style={styles.pageBtn}>←</button>
          <button style={styles.pageBtn}>1</button>
          <button style={styles.pageBtn}>2</button>
          <button style={styles.pageBtn}>3</button>
          <button style={styles.pageBtn}>→</button>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    marginBottom: '32px',
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid var(--border)',
    background: 'rgba(255,255,255,0.02)',
  },
  tableTitle: {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
  },
  filters: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  filterBtn: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-light)',
    padding: '6px 12px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.8125rem',
    transition: 'var(--transition-fast)',
    cursor: 'pointer',
  },
  active: {
    background: 'rgba(255,255,255,0.05)',
    color: 'var(--text-primary)',
    borderColor: 'var(--text-muted)',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '16px 24px',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    fontWeight: 600,
    letterSpacing: '1px',
    borderBottom: '1px solid var(--border)',
  },
  td: {
    padding: '16px 24px',
    borderBottom: '1px solid var(--border)',
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
  },
  tr: {
    transition: 'var(--transition-fast)',
  },
  trHover: {
    background: 'var(--bg-card-hover)',
  },
  textPreview: {
    color: 'var(--text-primary)',
    fontFamily: 'inherit',
    fontSize: '0.9375rem',
    maxWidth: '400px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  badge: {
    padding: '4px 10px',
    borderRadius: '100px',
    fontSize: '0.75rem',
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
  actionBtn: {
    color: 'var(--text-secondary)',
    background: 'none',
    border: 'none',
    fontSize: '1rem',
    padding: '4px',
    cursor: 'pointer',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    fontSize: '0.8125rem',
    color: 'var(--text-muted)',
    flexWrap: 'wrap',
    gap: '16px',
  },
  pageControls: {
    display: 'flex',
    gap: '8px',
  },
  pageBtn: {
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    border: '1px solid var(--border-light)',
    borderRadius: '4px',
    color: 'var(--text-secondary)',
    transition: 'var(--transition-fast)',
    cursor: 'pointer',
  }
};
