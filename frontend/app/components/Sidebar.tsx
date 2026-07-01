'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

interface SidebarProps {
  perplexity?: number;
  variance?: number;
}

export default function Sidebar({ perplexity = 0, variance = 0 }: SidebarProps) {
  const pathname = usePathname();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const links = [
    // { href: '/', label: 'Overview', icon: '🏠' },
    { href: '/analyze', label: 'New Analysis', icon: '🔍' },
    { href: '/history', label: 'Scan History', icon: '📚' },
    // { href: '/methodology', label: 'Documentation', icon: '📖' },
  ];

  return (
    <aside style={styles.sidebar}>
      <div style={styles.navSection}>
        <h3 style={styles.sectionTitle}>Navigation</h3>
        <nav style={styles.navGroup}>
          {links.map((link) => {
            const isActive = pathname === link.href;
            const isHovered = hoveredLink === link.href;
            
            let linkStyle = { ...styles.link };
            if (isActive) {
              linkStyle = { ...linkStyle, ...styles.linkActive };
            } else if (isHovered) {
              linkStyle = { ...linkStyle, ...styles.linkHover };
            }

            return (
              <Link 
                key={link.href} 
                href={link.href} 
                style={linkStyle}
                onMouseEnter={() => setHoveredLink(link.href)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <span style={styles.icon}>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* <div style={styles.dataSection}>
        <h3 style={styles.sectionTitle}>
          <span style={styles.liveIndicator}></span>
          Live Forensic Data
        </h3>
        
        <div style={styles.dataWidget}>
          <div style={styles.widgetHeader}>
            <span style={styles.widgetTitle}>Word Predictability</span>
            <span style={styles.widgetValue}>{perplexity}%</span>
          </div>
          <div style={styles.meterBg}>
            <div style={{...styles.meterFill, width: `${perplexity}%`}}></div>
          </div>
        </div>

        <div style={styles.dataWidget}>
          <div style={styles.widgetHeader}>
            <span style={styles.widgetTitle}>Structure Variance</span>
            <span style={styles.widgetValue}>{variance}%</span>
          </div>
          <div style={styles.meterBg}>
            <div style={{...styles.meterFill, width: `${variance}%`}}></div>
          </div>
        </div>
      </div> */}
    </aside>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  sidebar: {
    width: '280px',
    height: 'calc(100vh - 65px)', /* Match typical navbar height deduction */
    position: 'sticky',
    top: '65px',
    borderRight: '1px solid var(--border)',
    background: 'var(--bg-secondary)',
    padding: '32px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '48px',
  },
  sectionTitle: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'var(--text-muted)',
    fontWeight: 600,
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  navGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-secondary)',
    fontSize: '0.9375rem',
    fontWeight: 500,
    transition: 'var(--transition-fast)',
    textDecoration: 'none',
  },
  linkHover: {
    background: 'rgba(255, 255, 255, 0.03)',
    color: 'var(--text-primary)',
  },
  linkActive: {
    background: 'var(--accent-glow)',
    color: 'var(--accent)',
    borderLeft: '3px solid var(--accent)',
  },
  icon: {
    fontSize: '1.1rem',
    opacity: 0.8,
  },
  liveIndicator: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'var(--accent)',
    animation: 'pulse 2s infinite',
  },
  dataWidget: {
    marginBottom: '20px',
  },
  widgetHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    fontSize: '0.8125rem',
  },
  widgetTitle: {
    color: 'var(--text-secondary)',
  },
  widgetValue: {
    color: 'var(--text-primary)',
    fontWeight: 600,
  },
  meterBg: {
    height: '6px',
    background: 'var(--border)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  meterFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--accent-dark), var(--accent))',
    borderRadius: '3px',
    transition: 'width 0.5s ease',
  }
};
