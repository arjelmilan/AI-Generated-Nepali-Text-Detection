'use client';

import React from 'react';
import { SentenceAnalysis } from '../services/api';

interface HeatmapVisualizationProps {
  sentences?: SentenceAnalysis[];
  htmlViz?: string | null;
}

// Fallback data if no real result is available
const mockSentences: SentenceAnalysis[] = [
  { text: "नेपालको संविधान २०७२ को धारा ४ अनुसार नागरिकता सम्बन्धी व्यवस्था गरिएको छ।", type: "human" },
  { text: " यस अन्तर्गत वंशजको आधारमा, जन्मको आधारमा र अंगीकृत नागरिकता प्राप्त गर्न सकिन्छ।", type: "mixed" },
  { text: " नागरिकता प्राप्त गर्ने प्रक्रिया प्रमुख जिल्ला अधिकारीको कार्यालयबाट सुरु हुन्छ।", type: "human" },
  { text: " निवेदन दिनका लागि आवश्यक कागजातहरू जस्तै जन्म दर्ता, बाबुआमाको नागरिकताको प्रतिलिपि, र वडा कार्यालयको सिफारिस अनिवार्य छ।", type: "human" },
  { text: " यस प्रक्रियालाई आधुनिक प्रविधिको प्रयोगबाट थप प्रभावकारी बनाउन सकिन्छ।", type: "ai" },
  { text: " डिजिटल प्रविधिले सरकारी सेवा प्रवाहमा दक्षता ल्याउँछ र भ्रष्टाचार न्यूनीकरणमा मद्दत पुर्‍याउँछ।", type: "ai" },
  { text: " तसर्थ, सबै नागरिकले समयमै आफ्नो नागरिकता प्रमाणपत्र प्राप्त गर्नु महत्त्वपूर्ण छ।", type: "human" }
];

export default function HeatmapVisualization({ sentences = mockSentences, htmlViz }: HeatmapVisualizationProps) {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Linguistic Heatmap</h3>
        {!htmlViz && (
          <div style={styles.legend}>
            <div style={styles.legendItem}>
              <span style={{...styles.legendColor, ...styles.colorHuman}}></span>
              Human
            </div>
            <div style={styles.legendItem}>
              <span style={{...styles.legendColor, ...styles.colorMixed}}></span>
              Mixed Signal
            </div>
            <div style={styles.legendItem}>
              <span style={{...styles.legendColor, ...styles.colorAI}}></span>
              Likely AI
            </div>
          </div>
        )}
        {htmlViz && (
          <span style={styles.shapBadge}>SHAP Token Attribution</span>
        )}
      </div>

      <div style={styles.content}>
        {htmlViz ? (
          /* Render the self-contained SHAP HTML from the backend */
          <div
            style={styles.shapWrapper}
            dangerouslySetInnerHTML={{ __html: htmlViz }}
          />
        ) : (
          sentences.map((sentence, index) => {
            let typeStyle = {};
            let confidence = '0%';
            if (sentence.type === 'human') { typeStyle = styles.typeHuman; confidence = '92%'; }
            else if (sentence.type === 'mixed') { typeStyle = styles.typeMixed; confidence = '55%'; }
            else if (sentence.type === 'ai') { typeStyle = styles.typeAI; confidence = '89%'; }

            return (
              <span
                key={index}
                style={{ ...styles.sentence, ...typeStyle }}
                title={`Confidence: ${confidence}`}
              >
                {sentence.text}
              </span>
            );
          })
        )}
      </div>
    </div>
  );
}


const styles: { [key: string]: React.CSSProperties } = {
  container: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid var(--border)',
    background: 'rgba(255, 255, 255, 0.02)',
  },
  title: {
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
  },
  legend: {
    display: 'flex',
    gap: '16px',
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    fontWeight: 500,
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  legendColor: {
    width: '10px',
    height: '10px',
    borderRadius: '2px',
    display: 'inline-block',
  },
  colorHuman: { background: 'var(--accent)' },
  colorMixed: { background: '#ee9d2b' },
  colorAI: { background: '#ee2b2b' },
  content: {
    padding: '24px',
    fontSize: '1rem',
    lineHeight: 1.8,
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-primary)',
    flex: 1,
    overflowY: 'auto',
  },
  sentence: {
    padding: '2px 4px',
    margin: '0 2px',
    borderRadius: '4px',
    transition: 'var(--transition-fast)',
    cursor: 'default',
  },
  typeHuman: {
    background: 'transparent',
  },
  typeMixed: {
    background: 'rgba(238, 157, 43, 0.15)',
    borderBottom: '1px dashed rgba(238, 157, 43, 0.5)',
  },
  typeAI: {
    background: 'rgba(238, 43, 43, 0.15)',
    borderBottom: '1px dashed rgba(238, 43, 43, 0.5)',
    color: '#ff8a8a',
  },
  shapBadge: {
    fontSize: '0.75rem',
    color: 'var(--accent)',
    fontWeight: 600,
    padding: '3px 8px',
    background: 'var(--accent-glow)',
    borderRadius: '4px',
    letterSpacing: '0.5px',
  },
  shapWrapper: {
    width: '100%',
    overflowX: 'auto',
    lineHeight: 1.8,
    fontSize: '0.9375rem',
  },
};
