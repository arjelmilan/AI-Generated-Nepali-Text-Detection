import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './contexts/AuthContext';

export const metadata = {
  title: 'AI nepali text detection | Forensic AI Detection for Nepali Text',
  description: 'Detecting synthetic patterns in Devanagari script with high-contrast neural analysis. Engineered for the linguistic nuances of Nepal\'s digital ecosystem.',
  keywords: 'nepali, AI detection, text analysis, devanagari, NLP, forensic linguistics',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
