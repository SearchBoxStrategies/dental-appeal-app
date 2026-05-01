import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Appeal } from '../types';

export default function AppealDetail() {
  const { id } = useParams<{ id: string }>();
  const [appeal, setAppeal] = useState<Appeal | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const letterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get(`/appeals/${id}`).then((res) => setAppeal(res.data)).finally(() => setLoading(false));
  }, [id]);

  async function copyLetter() {
    if (!appeal) return;
    await navigator.clipboard.writeText(appeal.letter_content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function printLetter() {
    const content = letterRef.current?.innerText ?? '';
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<html><body><pre style="font-family:serif;font-size:12pt;line-height:1.7;white-space:pre-wrap">${content}</pre></body></html>`);
    win.document.close();
    win.print();
  }

  if (loading) return <div className="loading">Loading…</div>;
  if (!appeal) return <div className="loading">Appeal not found.</div>;

  return (
    <div>
      <Link to={`/claims/${appeal.claim_id}`} className="back-link">← Back to Claim</Link>

      <div className="page-header">
        <div>
          <h2>Appeal Letter</h2>
          <p style={{ color: 'var(--gray-600)', fontSize: 13, marginTop: 2 }}>
            {appeal.patient_name} · {appeal.insurance_company}
            {appeal.claim_number ? ` · Claim #${appeal.claim_number}` : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" onClick={copyLetter}>
            {copied ? '✓ Copied' : 'Copy to Clipboard'}
          </button>
          <button className="btn btn-secondary" onClick={printLetter}>Print</button>
        </div>
      </div>

      <div style={{ marginBottom: 16, display: 'flex', gap: 12, color: 'var(--gray-600)', fontSize: 12 }}>
        <span>Generated {new Date(appeal.created_at).toLocaleString()}</span>
        <span>·</span>
        <span>Model: {appeal.model_used}</span>
        <span>·</span>
        <span>Procedures: {appeal.procedure_codes.join(', ')}</span>
      </div>

      <div className="letter-box" ref={letterRef}>
        {appeal.letter_content}
      </div>
    </div>
  );
}
