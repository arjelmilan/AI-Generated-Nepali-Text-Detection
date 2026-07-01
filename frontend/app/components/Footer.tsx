'use client';

import Link from 'next/link';
import React, { useState } from 'react';

export default function Footer() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const renderLink = (href: string, text: string) => {
    const isHovered = hoveredLink === text;
    return (
      <li>
        <Link 
          href={href} 
          style={{ ...styles.link, ...(isHovered ? styles.linkHover : {}) }}
          onMouseEnter={() => setHoveredLink(text)}
          onMouseLeave={() => setHoveredLink(null)}
        >
          {text}
        </Link>
      </li>
    );
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.footerInner}>
        <div style={styles.footerTop}>
          <div style={styles.footerBrand}>
            <div style={styles.footerLogo}>
              <span style={styles.footerLogoIcon}>ल</span>
              AI nepali text detection
            </div>
            <p style={styles.footerDesc}>
              Forensic AI detection engineered for Nepali text. Advanced linguistic analysis
              for Devanagari scripts with high-precision entropy mapping.
            </p>
          </div>

          <div style={styles.footerLinks}>
            <div style={styles.footerCol}>
              <h4 style={styles.colTitle}>Product</h4>
              <ul style={styles.list}>
                {renderLink('/analyze', 'Analyze')}
                {renderLink('/results', 'Results')}
                {renderLink('/history', 'History')}
                {renderLink('/methodology#api', 'API Access')}
              </ul>
            </div>
            <div style={styles.footerCol}>
              <h4 style={styles.colTitle}>Resources</h4>
              <ul style={styles.list}>
                {renderLink('/methodology', 'Methodology')}
                {renderLink('/methodology#api', 'Documentation')}
                {renderLink('#', 'Research Papers')}
              </ul>
            </div>
            <div style={styles.footerCol}>
              <h4 style={styles.colTitle}>Legal</h4>
              <ul style={styles.list}>
                {renderLink('#', 'Privacy')}
                {renderLink('#', 'Terms')}
                {renderLink('#', 'Contact')}
              </ul>
            </div>
          </div>
        </div>

        <div style={styles.footerBottom}>
          <span style={styles.copyright}>
            © 2026 AI nepali text detection. All rights reserved.
          </span>
          <div style={styles.footerStatus}>
            <span style={styles.statusDot}></span>
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  footer: {
    borderTop: '1px solid var(--border)',
    background: 'var(--bg-secondary)',
    padding: '48px 24px 32px',
    marginTop: 'auto',
  },
  footerInner: {
    maxWidth: 'var(--max-width)',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  footerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '32px',
  },
  footerBrand: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxWidth: '320px',
  },
  footerLogo: {
    fontSize: '1.125rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  footerLogoIcon: {
    width: '24px',
    height: '24px',
    background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.7rem',
    fontWeight: 800,
    color: '#000',
  },
  footerDesc: {
    fontSize: '0.8125rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.7,
    margin: 0,
  },
  footerLinks: {
    display: 'flex',
    gap: '48px',
    flexWrap: 'wrap',
  },
  footerCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  colTitle: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '1.2px',
    color: 'var(--text-muted)',
    margin: 0,
    fontWeight: 600,
  },
  list: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    margin: 0,
    padding: 0,
  },
  link: {
    fontSize: '0.8125rem',
    color: 'var(--text-secondary)',
    transition: 'var(--transition-fast)',
    textDecoration: 'none',
  },
  linkHover: {
    color: 'var(--accent)',
  },
  footerBottom: {
    borderTop: '1px solid var(--border)',
    paddingTop: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
  },
  copyright: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  footerStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
  },
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'var(--accent)',
    animation: 'pulse 2s infinite',
  }
};
