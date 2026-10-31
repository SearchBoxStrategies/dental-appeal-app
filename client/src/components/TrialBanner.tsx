import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

// Shown only while a practice is on its free trial (or just after it ends).
export default function TrialBanner() {
  const { user } = useAuth();
  const isOwner = user?.practice_role === 'owner';
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    api.get('/billing/subscription')
      .then((r) => setDaysLeft(typeof r.data.trialDaysLeft === 'number' ? r.data.trialDaysLeft : null))
      .catch(() => setDaysLeft(null));
  }, []);

  if (daysLeft === null) return null;

  const ended = daysLeft === 0;
  const urgent = ended || daysLeft <= 3;
  const message = ended
    ? 'Your free trial has ended. Subscribe to keep writing appeal letters.'
    : `${daysLeft} day${daysLeft === 1 ? '' : 's'} left in your free trial. Subscribe to keep writing appeal letters.`;

  return (
    <div className={`flex flex-wrap items-center gap-3 rounded-xl border p-4 ${
      urgent ? 'border-red-200 bg-red-50 text-red-900' : 'border-blue-200 bg-blue-50 text-blue-900'
    }`}>
      <Clock className={`h-5 w-5 shrink-0 ${urgent ? 'text-red-600' : 'text-blue-600'}`} />
      <p className="flex-1 min-w-[12rem] text-sm font-medium">{message}</p>
      {isOwner ? (
        <Link
          to="/billing"
          className={`inline-flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-semibold text-white ${
            urgent ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Subscribe <ArrowRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="text-sm">Ask your practice owner to subscribe.</span>
      )}
    </div>
  );
}
