import Sidebar from '../components/Sidebar';
import TextAnalyzer from '../components/TextAnalyzer';

export default function AnalyzePage() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar perplexity={12} variance={28} />
      <TextAnalyzer />
    </div>
  );
}
