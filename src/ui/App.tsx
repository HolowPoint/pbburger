import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getSelectedMessageMetadata } from '../utils/outlook';
import { fetchVerdict } from '../utils/api';
import './styles.css';

type Verdict = 'unknown' | 'safe' | 'suspicious' | 'error';

export const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [verdict, setVerdict] = useState<Verdict>('unknown');
  const [details, setDetails] = useState<string>('');
  const [backendUrl, setBackendUrl] = useState<string>(() =>
    (localStorage.getItem('uconn-backend-url') || '').trim()
  );

  useEffect(() => {
    localStorage.setItem('uconn-backend-url', backendUrl);
  }, [backendUrl]);

  const indicator = useMemo(() => {
    switch (verdict) {
      case 'safe':
        return { color: '#16a34a', text: 'This email appears SAFE' };
      case 'suspicious':
        return { color: '#dc2626', text: 'This email appears SUSPICIOUS' };
      case 'error':
        return { color: '#9333ea', text: 'Error checking email' };
      default:
        return { color: '#64748b', text: 'No verdict yet' };
    }
  }, [verdict]);

  const runCheck = useCallback(async () => {
    setLoading(true);
    setVerdict('unknown');
    setDetails('');
    try {
      const meta = await getSelectedMessageMetadata();
      const result = backendUrl
        ? await fetchVerdict(backendUrl, meta)
        : await import('../utils/demo').then((m) => m.demoVerdict(meta));
      if (result.status === 'safe') {
        setVerdict('safe');
      } else if (result.status === 'suspicious') {
        setVerdict('suspicious');
      } else {
        setVerdict('error');
      }
      setDetails(result.explanation || '');
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      setVerdict('error');
      setDetails(message);
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  // Auto-run once if a backend URL is configured
  useEffect(() => {
    if (backendUrl) {
      runCheck();
    }
    // run once on mount if backendUrl exists
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      <header className="header">
        <img src="/icons/uconn-48.svg" alt="UConn" width={32} height={32} />
        <h1>UConn Email Safety</h1>
      </header>
      <section className="settings">
        <label className="label">Backend API URL</label>
        <input
          className="input"
          placeholder="https://backend.example.com"
          value={backendUrl}
          onChange={(e) => setBackendUrl(e.target.value)}
        />
      </section>
      <section className="indicator" style={{ borderColor: indicator.color }}>
        <div className="dot" style={{ backgroundColor: indicator.color }} />
        <div className="indicator-text">{indicator.text}</div>
      </section>
      <section className="actions">
        <button className="button" onClick={runCheck} disabled={loading}>
          {loading ? 'Checking…' : 'Run Check'}
        </button>
      </section>
      {details && (
        <section className="details">
          <div className="details-title">Details</div>
          <pre className="pre">{details}</pre>
        </section>
      )}
      <footer className="footer">Team #18 • UConn • Anti-Phishing</footer>
    </div>
  );
};


