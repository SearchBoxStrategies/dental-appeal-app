import { PlayCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ClinicGuide from '../components/ClinicGuide';

interface Tutorial {
  id: number;
  title: string;
  minutes: number;
  summary: string;
  steps: string[];
  // YouTube video id of the UNLISTED video. Leave empty until the video is uploaded.
  youtubeId: string;
}

// Affiliates keep their own video tutorial. Clinics get the written step-by-step guide.
const AFFILIATE_TUTORIALS: Tutorial[] = [
  {
    id: 9, minutes: 4, youtubeId: '',
    title: 'Affiliate program: share your link and get paid',
    summary: 'Find your link, track referrals and commissions, and set up payouts.',
    steps: ['Copy your link from the Affiliate Dashboard', 'Watch clicks, sign-ups and commissions', 'Click Set up payouts in the Get Paid card', 'Keep Pay me automatically each month ticked'],
  },
];

function AffiliateTutorials() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Video Tutorials</h1>
        <p className="text-gray-600 mt-1">Short step-by-step videos. Each one covers a single task.</p>
      </div>

      {AFFILIATE_TUTORIALS.map((t) => (
        <div key={t.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between gap-3 flex-wrap">
            <h2 className="font-semibold text-gray-900">{t.title}</h2>
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="w-4 h-4" /> about {t.minutes} min
            </span>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {t.youtubeId ? (
                <div className="aspect-video rounded-lg overflow-hidden bg-black">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(t.youtubeId)}?rel=0`}
                    title={t.title}
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="aspect-video rounded-lg bg-slate-100 border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500 text-sm">
                  <PlayCircle className="w-10 h-10 mb-2" />
                  Video coming soon
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-700">{t.summary}</p>
              <ol className="mt-3 space-y-1.5 text-sm text-gray-600 list-decimal list-inside">
                {t.steps.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </div>
          </div>
        </div>
      ))}

      <p className="text-sm text-gray-500">
        Still stuck? Email <a className="text-blue-600 hover:underline" href="mailto:support@dentalappeal.claims">support@dentalappeal.claims</a>.
      </p>
    </div>
  );
}

export default function Tutorials() {
  const { user } = useAuth();
  return user?.user_type === 'affiliate' ? <AffiliateTutorials /> : <ClinicGuide />;
}
