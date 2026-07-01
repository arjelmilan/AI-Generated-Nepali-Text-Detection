'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isBtnHovered, setIsBtnHovered] = useState(false);

  const navItems = [
    { label: 'Analyze', href: '/analyze' },
    { label: 'Results', href: '/results' },
    { label: 'History', href: '/history' },
    // { label: 'Methodology', href: '/methodology' },
  ];

  return (
    <nav style={styles.navbar}>
      <div style={styles.navInner}>
        <Link 
          href="/" 
          style={{ ...styles.logo, color: isLogoHovered ? 'var(--accent)' : 'var(--text-primary)' }}
          onMouseEnter={() => setIsLogoHovered(true)}
          onMouseLeave={() => setIsLogoHovered(false)}
        >
          AI nepali text detection
        </Link>

        {/* Desktop Links */}
        <ul style={{ ...styles.navLinks, ...(isOpen ? styles.open : {}) }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const isHovered = hoveredLink === item.href;
            
            let linkStyle = { ...styles.navLink };
            if (isActive) {
              linkStyle = { ...linkStyle, ...styles.navLinkActive };
            } else if (isHovered) {
              linkStyle = { ...linkStyle, ...styles.navLinkHover };
            }

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  style={linkStyle}
                  onMouseEnter={() => setHoveredLink(item.href)}
                  onMouseLeave={() => setHoveredLink(null)}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div style={styles.navActions}>
          {user ? (
            <div style={styles.userSection}>
              <span style={styles.userEmail}>{user.email}</span>
              <button
                onClick={logout}
                style={{
                  ...styles.apiBtn,
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)'
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              style={{ 
                ...styles.apiBtn, 
                ...(isBtnHovered ? styles.apiBtnHover : {}) 
              }}
              onMouseEnter={() => setIsBtnHovered(true)}
              onMouseLeave={() => setIsBtnHovered(false)}
            >
              Sign In
            </Link>
          )}
          <button
            style={styles.mobileToggle}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </nav>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  navbar: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    background: 'rgba(5, 5, 5, 0.8)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--border)',
    padding: '0 24px',
  },
  navInner: {
    maxWidth: 'var(--max-width)',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontWeight: 700,
    fontSize: '1.25rem',
    letterSpacing: '-0.5px',
    transition: 'var(--transition-fast)',
    textDecoration: 'none',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
    borderRadius: 'var(--radius-sm)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.85rem',
    fontWeight: 800,
    color: '#000',
    boxShadow: 'var(--shadow-glow)',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  navLink: {
    padding: '8px 16px',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
    fontWeight: 500,
    transition: 'var(--transition-fast)',
    textDecoration: 'none',
  },
  navLinkHover: {
    color: 'var(--text-primary)',
    background: 'rgba(255,255,255,0.04)',
  },
  navLinkActive: {
    color: 'var(--accent)',
    background: 'var(--accent-glow)',
  },
  navActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  apiBtn: {
    padding: '8px 20px',
    background: 'var(--accent)',
    color: '#000',
    fontSize: '0.8125rem',
    fontWeight: 600,
    borderRadius: 'var(--radius-sm)',
    transition: 'var(--transition)',
    letterSpacing: '0.3px',
    textDecoration: 'none',
    display: 'inline-block',
  },
  apiBtnHover: {
    background: 'var(--accent-light)',
    boxShadow: 'var(--shadow-glow)',
    transform: 'translateY(-1px)',
  },
  mobileToggle: {
    display: 'none', // Overridden via media queries globally or managed via state typically, keeping simple here
    background: 'none',
    color: 'var(--text-primary)',
    fontSize: '1.5rem',
    padding: '4px',
    border: 'none',
    cursor: 'pointer',
  },
  open: {
    display: 'flex',
    position: 'absolute',
    top: '64px',
    left: 0,
    right: 0,
    background: 'rgba(10, 10, 10, 0.98)',
    backdropFilter: 'blur(20px)',
    flexDirection: 'column',
    padding: '16px',
    borderBottom: '1px solid var(--border)',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userEmail: {
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
    display: 'none', // Hide on mobile
  }
};
