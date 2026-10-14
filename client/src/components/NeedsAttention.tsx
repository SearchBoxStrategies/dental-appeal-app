import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, PhoneCall, ChevronRight } from 'lucide-react';
import api from '../lib/api';

interface AttentionClaim {
  id: number;
  patient_name: string;
  insurance_company: string;
  amount_denied: string | null;
  appeal_deadline: string | null;
  days_left: number | null;
  days_since_appeal: number | null;
  kind: 'deadline' | 'follow_up';
}

const money = (v: string | null) =>
  v ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(v)) : '';

// Appeal deadlines within 14 days and appeals waiting 30+ days for an answer.
export default function NeedsAttention() {
  const [claims, setClaims] = useState<AttentionClaim[] | null>(null);

  useEffect(() => {
    api.get('/claims/attention').then((r) => setClaims(r.data)).catch(() => setClaims([]));
  }, []);

  if (!claims || claims.length === 0) return null;

  const label = (c: AttentionClaim) => {
    if (c.kind === 'follow_up') return `Sent ${c.days_since_appeal} days ago, no answer yet. Call the insurer.`;
    if ((c.days_left ?? 0) < 0) return 'Appeal deadline has passed';
    if (c.days_left === 0) return 'Appeal deadline is today';
    return `Appeal due in ${c.days_left} day${c.days_left === 1 ? '' : 's'}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="px-6 py-4 border-b bg-amber-50 flex items-center gap-2">
        <CalendarClock className="w-5 h-5 text-amber-600" />
        <h2 className="font-semibold text-gray-900">Needs attention</h2>
        <span className="ml-auto text-sm text-amber-800">{claims.length} claim{claims.length === 1 ? '' : 's'}</span>
      </div>
      <ul className="divide-y">
        {claims.map((c) => (
          <li key={c.id}>
            <Link to={`/claims/${c.id}`} className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50">
              {c.kind === 'follow_up'
                ? <PhoneCall className="w-4 h-4 text-amber-600 shrink-0" />
                : <CalendarClock className={`w-4 h-4 shrink-0 ${(c.days_left ?? 0) <= 3 ? 'text-red-600' : 'text-amber-600'}`} />}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {c.patient_name} · {c.insurance_company} {c.amount_denied ? `· ${money(c.amount_denied)}` : ''}
                </p>
                <p className={`text-xs ${c.kind === 'deadline' && (c.days_left ?? 0) <= 3 ? 'text-red-700' : 'text-gray-600'}`}>{label(c)}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
