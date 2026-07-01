'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { analyzeText } from '../services/api';

export default function TextAnalyzer() {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [uploadHover, setUploadHover] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  const handleAnalyze = async () => {
    if (!text.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeText({ text });
      // Store result so the results page can read it without re-fetching
      sessionStorage.setItem('nepdetect_last_result', JSON.stringify(result));
      router.push('/results');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Analysis failed. Please try again.';
      console.error('Analysis failed:', err);
      setError(msg);
      setIsAnalyzing(false);
    }
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(prev => prev + clipboardText);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  const handleClear = () => {
    setText('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.tabs}>
          <button style={{...styles.tab, ...styles.tabActive}}>Text Input</button>
          {/* <button style={styles.tab}>File Upload</button> */}
          {/* <button style={styles.tab}>URL Scan</button> */}
        </div>
        <div style={styles.tools}>
          <button style={styles.toolBtn}>Nepali (नेपाली) ▾</button>
          {/* <button style={styles.toolBtn}>Forensic Mode ▾</button> */}
        </div>
      </div>

      <div style={styles.editorArea}>
        <textarea
          style={styles.textarea}
          placeholder="Paste or type your Nepali document here for analysis..."
          value={text}
          onChange={handleTextChange}
        />
        
        {text.length === 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📝</div>
            <p>Enter text to begin forensic analysis.</p>
            {/* <div style={styles.emptyActions}>
              <button style={styles.emptyBtn} onClick={handlePaste}>📋 Paste Text</button>
              <button 
                style={{...styles.emptyBtn, ...(uploadHover ? styles.emptyBtnHover : {})}}
                onMouseEnter={() => setUploadHover(true)}
                onMouseLeave={() => setUploadHover(false)}
              >
                📁 Upload Document
              </button>
            </div> */}
          </div>
        )}
      </div>

      <div style={styles.disclaimerBanner}>
        ⚠ *Disclaimer: AI detection models may occasionally produce inaccurate result. Please use these results as a supplementary tool alongside critical human review.*
      </div>

      {error && (
        <div style={styles.errorBanner}>
          ⚠ {error}
        </div>
      )}

      <div style={styles.footer}>
        <div style={styles.stats}>
          <span style={styles.statItem}>
            <strong>{wordCount}</strong> words
          </span>
          <span style={styles.statItem}>
            <strong>{charCount}</strong> characters
          </span>
        </div>
        
        <div style={styles.actions}>
          {text.length > 0 && (
            <button style={styles.clearBtn} onClick={handleClear}>Clear</button>
          )}
          <button 
            style={{
              ...styles.analyzeBtn, 
              ...((!text.trim() || isAnalyzing) ? styles.analyzeBtnDisabled : {}),
              ...(btnHover && text.trim() && !isAnalyzing ? styles.analyzeBtnHover : {})
            }}
            onClick={handleAnalyze}
            disabled={!text.trim() || isAnalyzing}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
          >
            {isAnalyzing ? (
              <>
                <span style={styles.spinner}></span> Analyzing...
              </>
            ) : (
              'Analyze Text →'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    height: 'auto',
    width:'100%',
    boxShadow: 'var(--shadow-md)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderBottom: '1px solid var(--border)',
    background: 'rgba(255, 255, 255, 0.02)',
  },
  tabs: {
    display: 'flex',
    gap: '4px',
  },
  tab: {
    background: 'transparent',
    border: 'none',
    padding: '8px 16px',
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    borderRadius: 'var(--radius-sm)',
    transition: 'var(--transition-fast)',
  },
  tabActive: {
    background: 'rgba(255, 255, 255, 0.05)',
    color: 'var(--text-primary)',
  },
  tools: {
    display: 'flex',
    gap: '12px',
  },
  toolBtn: {
    background: 'transparent',
    border: '1px solid var(--border)',
    padding: '6px 12px',
    color: 'var(--text-secondary)',
    fontSize: '0.8125rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  editorArea: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  textarea: {
    flex: 1,
    width: '100%',
    padding: '24px',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-primary)',
    fontSize: '1rem',
    lineHeight: 1.7,
    resize: 'none',
    outline: 'none',
    fontFamily: 'var(--font-primary)',
  },
  emptyState: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    color: 'var(--text-muted)',
  },
  emptyIcon: {
    fontSize: '2.5rem',
    marginBottom: '16px',
    opacity: 0.5,
  },
  emptyActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
    pointerEvents: 'auto',
  },
  emptyBtn: {
    padding: '10px 20px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  emptyBtnHover: {
    background: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'var(--text-muted)',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderTop: '1px solid var(--border)',
    background: 'var(--bg-secondary)',
  },
  stats: {
    display: 'flex',
    gap: '24px',
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  actions: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  clearBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '0.875rem',
    cursor: 'pointer',
  },
  analyzeBtn: {
    padding: '12px 28px',
    background: 'var(--accent)',
    color: '#000',
    border: 'none',
    borderRadius: 'var(--radius)',
    fontSize: '0.9375rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'var(--transition)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  analyzeBtnHover: {
    background: 'var(--accent-light)',
    boxShadow: 'var(--shadow-glow)',
  },
  analyzeBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    background: 'var(--border-light)',
    color: 'var(--text-muted)',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(0,0,0,0.2)',
    borderTopColor: '#000',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  disclaimerBanner: {
    padding: '10px 24px',
    background: 'rgba(238, 43, 43, 0.05)',
    borderTop: '1px solid rgba(238, 43, 43, 0.1)',
    color: '#ff6b6b',
    fontSize: '0.8125rem',
    textAlign: 'center',
    fontStyle: 'italic',
    letterSpacing: '0.3px',
  },
  errorBanner: {
    padding: '12px 24px',
    background: 'rgba(238, 43, 43, 0.1)',
    borderTop: '1px solid rgba(238, 43, 43, 0.3)',
    color: '#ff8a8a',
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
};
