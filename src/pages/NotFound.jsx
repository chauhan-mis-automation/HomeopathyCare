import { Link } from 'react-router-dom';
import { useLang } from '../lib/i18n';

export default function NotFound() {
  const { lang } = useLang();
  return (
    <main style={{ padding: '180px 0 120px', textAlign: 'center' }}>
      <div className="container">
        <h1 style={{ fontSize: '4rem' }} className="grad">404</h1>
        <p style={{ color: 'var(--muted)', margin: '10px 0 28px', fontSize: '1.1rem' }}>
          {lang === 'en' ? 'This page was not found.' : 'यह पेज नहीं मिला।'}
        </p>
        <Link className="btn btn-primary" to="/">{lang === 'en' ? 'Go to home' : 'होम पेज पर जाएँ'}</Link>
      </div>
    </main>
  );
}
