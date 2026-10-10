import { useEffect, useState } from 'react';
import { DollarSign, Trophy, Hourglass, TrendingUp, Info } from 'lucide-react';
import api from '../lib/api';

interface Recovery {
  recoveredAllTime: number;
  recoveredThisMonth: number;
  won: number;
  lost: number;
  winRate: number | null;
  estimatedCount: number;
  pendingCount: number;
  pendingValue: number;
  totalPaid: number;
  roiMultiple: number | null;
  monthly: Array<{ month: string; recovered: number; won: number; lost: number }>;
  byInsurer: Array<{ insurer: string; won: number; lost: number; winRate: number | null; recovered: number }>;
}

const money = (n: number, cents = false) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  }).format(n);

// Last 12 calendar months as YYYY-MM, oldest first, so months with no wins still show.
function last12Months(): string[] {
  const out: string[] = [];
  const d = new Date();
  d.setDate(1);
  for (let i = 11; i >= 0; i--) {
    const m = new Date(d.getFullYear(), d.getMonth() - i, 1);
    out.push(`${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, '0')}`);
  }
  return out;
}

const monthLabel = (ym: string) =>
  new Date(Number(ym.slice(0, 4)), Number(ym.slice(5, 7)) - 1, 1).toLocaleDateString('en-US', { month: 'short' });

export default function RecoveryDashboard() {
  const [data, setData] = useState<Recovery | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get('/analytics/recovery')
      .then(res => setData(res.data))
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-sm text-slate-500">
        Recovered-dollars summary is unavailable right now.
      </div>
    );
  }

  if (!data) {
    return <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-48 animate-pulse" />;
  }

  const hasResults = data.won + data.lost > 0;
  const byMonth = new Map(data.monthly.map(m => [m.month, m.recovered]));
  const months = last12Months().map(m => ({ month: m, recovered: byMonth.get(m) || 0 }));
  const maxMonth = Math.max(...months.map(m => m.recovered), 1);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Headline */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white p-6">
        <div className="flex items-center gap-2 text-emerald-100 text-sm font-medium">
          <DollarSign className="w-4 h-4" /> Money recovered from denied claims
        </div>
        <p className="text-4xl sm:text-5xl font-bold mt-2">{money(data.recoveredAllTime)}</p>
        <p className="text-emerald-100 mt-1">
          {money(data.recoveredThisMonth)} recovered this month
        </p>
      </div>

      {/* Key figures */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 border-b border-slate-200">
        <div className="p-5 flex items-start gap-3">
          <Trophy className="w-5 h-5 text-amber-500 mt-0.5" />
          <div>
            <p className="text-2xl font-bold text-slate-900">{data.winRate != null ? `${data.winRate}%` : '—'}</p>
            <p className="text-sm text-slate-600">
              Win rate {hasResults ? `(${data.won} won, ${data.lost} lost)` : ''}
            </p>
          </div>
        </div>
        <div className="p-5 flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <p className="text-2xl font-bold text-slate-900">
              {data.roiMultiple != null ? `${data.roiMultiple}×` : '—'}
            </p>
            <p className="text-sm text-slate-600">
              {data.roiMultiple != null
                ? `return on the ${money(data.totalPaid)} paid for DentalAppeal`
                : 'Return on your subscription (after first payment)'}
            </p>
          </div>
        </div>
        <div className="p-5 flex items-start gap-3">
          <Hourglass className="w-5 h-5 text-purple-500 mt-0.5" />
          <div>
            <p className="text-2xl font-bold text-slate-900">{money(data.pendingValue)}</p>
            <p className="text-sm text-slate-600">
              waiting on {data.pendingCount} open appeal{data.pendingCount === 1 ? '' : 's'}
            </p>
          </div>
        </div>
      </div>

      {!hasResults ? (
        <div className="p-6 text-sm text-slate-600 flex items-start gap-2">
          <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <span>
            When an insurer pays on an appeal, open the claim, set its status to <strong>Won</strong> or{' '}
            <strong>Paid</strong>, and enter the amount received. Your recovered dollars will add up here.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 p-6">
          {/* Monthly chart */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Recovered per month</h3>
            <div className="flex items-end gap-1.5 h-40" role="img" aria-label="Recovered dollars per month for the last 12 months">
              {months.map(m => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <div
                    className="w-full rounded-t bg-emerald-500 min-h-[2px]"
                    style={{ height: `${(m.recovered / maxMonth) * 100}%` }}
                    title={`${monthLabel(m.month)}: ${money(m.recovered)}`}
                  />
                  <span className="text-[10px] text-slate-500">{monthLabel(m.month)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* By insurer */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Top insurers</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500">
                  <th className="pb-2 font-medium">Insurer</th>
                  <th className="pb-2 font-medium text-right">Win rate</th>
                  <th className="pb-2 font-medium text-right">Recovered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.byInsurer.map(i => (
                  <tr key={i.insurer}>
                    <td className="py-2 text-slate-900 truncate max-w-[10rem]" title={i.insurer}>{i.insurer}</td>
                    <td className="py-2 text-right text-slate-600">{i.winRate != null ? `${i.winRate}%` : '—'}</td>
                    <td className="py-2 text-right font-medium text-slate-900">{money(i.recovered)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {data.estimatedCount > 0 && (
        <p className="px-6 pb-5 text-xs text-slate-500">
          Includes {data.estimatedCount} won claim{data.estimatedCount === 1 ? '' : 's'} without a recorded payment
          amount; the denied amount is used for {data.estimatedCount === 1 ? 'it' : 'those'}. Enter the amount paid on
          each claim for exact totals.
        </p>
      )}
    </div>
  );
}
