import Sidebar from '../components/Sidebar';
import ScanHistoryTable from '../components/ScanHistoryTable';
import StatsCounters from '../components/StatsCounters';

export default function HistoryPage() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar perplexity={10} variance={30} />
      
      <div style={{ flex: 1, padding: '40px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px' }}>Analysis History</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Real-time analysis results from the AI nepali text detection forensic engine. Compare patterns across the Nepali Devanagari corpus.
          </p>
        </div>

        <ScanHistoryTable />
        {/* <StatsCounters /> */}
      </div>
    </div>
  );
}
