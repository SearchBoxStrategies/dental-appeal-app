import { PlayCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Tutorial {
  id: number;
  title: string;
  minutes: number;
  summary: string;
  steps: string[];
  audience: 'clinic' | 'affiliate';
  // YouTube video id of the UNLISTED video. Leave empty until the video is uploaded.
  youtubeId: string;
}

const TUTORIALS: Tutorial[] = [
  {
    id: 1, audience: 'clinic', minutes: 2, youtubeId: '',
    title: 'Create your account and sign in',
    summary: 'Register your clinic, verify your email and sign in for the first time.',
    steps: ['Enter your practice name, your name and email', 'Choose a password that meets all five requirements', 'Click Create Account, then open the verification email', 'Sign in with your email and password'],
  },
  {
    id: 2, audience: 'clinic', minutes: 2, youtubeId: '',
    title: 'Set up your practice profile',
    summary: 'Add your letterhead details once so every appeal letter carries them.',
    steps: ['Open Practice Profile', 'Fill in the dentist name, address, phone and fax', 'Add your NPI, tax ID and licence number', 'Click Save Profile'],
  },
  {
    id: 3, audience: 'clinic', minutes: 3, youtubeId: '',
    title: 'Add your team and turn on two-step sign-in',
    summary: 'Give each person their own sign-in, mark who is a dentist, and protect the account.',
    steps: ['Open Team & Security', 'Enter an email, choose Staff or Owner, tick Dentist if needed', 'Click Send invitation', 'Turn on two-step sign-in and confirm the emailed code'],
  },
  {
    id: 4, audience: 'clinic', minutes: 3, youtubeId: '',
    title: 'Start a claim by uploading the denial',
    summary: 'Upload the insurer’s denial and let the AI fill in the claim for you to check.',
    steps: ['Click New Claim, then Upload denial', 'Wait while the document is read', 'Check every amber-highlighted field against the paper', 'Click Submit Claim'],
  },
  {
    id: 5, audience: 'clinic', minutes: 3, youtubeId: '',
    title: 'Prepare the appeal: checklist and dentist’s note',
    summary: 'Gather the evidence and get the dentist’s clinical note approved.',
    steps: ['Tick the items in What to include as you gather them', 'Upload X-rays and documents under Supporting Documents', 'Click Draft note with AI and fill in the bracketed details', 'A dentist clicks Approve'],
  },
  {
    id: 6, audience: 'clinic', minutes: 3, youtubeId: '',
    title: 'Generate, edit and send the appeal letter',
    summary: 'Write the letter, review it, download it as a PDF and mark the claim as sent.',
    steps: ['Click Generate Appeal Letter', 'Read the letter and complete any [bracketed] details with Edit', 'Click Download PDF or Print', 'Set Appeal Status to Appeal Sent'],
  },
  {
    id: 7, audience: 'clinic', minutes: 3, youtubeId: '',
    title: 'Deadlines, follow-ups and recording results',
    summary: 'Keep track of appeal deadlines, follow up on time and record what the insurer paid.',
    steps: ['Check the deadline banner on the claim', 'Use Edit dates if the deadline is missing or wrong', 'Follow up after 30 days if there is no answer', 'Set Won or Paid and enter the amount paid'],
  },
  {
    id: 8, audience: 'clinic', minutes: 2, youtubeId: '',
    title: 'Billing, your subscription and cancelling',
    summary: 'Subscribe after your trial, update your card, and cancel if you need to.',
    steps: ['Open Billing (owners only)', 'Click Subscribe Now to pay on Stripe’s secure page', 'Click Manage Subscription to update your card or cancel'],
  },
  {
    id: 9, audience: 'affiliate', minutes: 4, youtubeId: '',
    title: 'Affiliate program: share your link and get paid',
    summary: 'Find your link, track referrals and commissions, and set up payouts.',
    steps: ['Copy your link from the Affiliate Dashboard', 'Watch clicks, sign-ups and commissions', 'Click Set up payouts in the Get Paid card', 'Keep Pay me automatically each month ticked'],
  },
];

export default function Tutorials() {
  const { user } = useAuth();
  const audience = user?.user_type === 'affiliate' ? 'affiliate' : 'clinic';
  const videos = TUTORIALS.filter((t) => t.audience === audience);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Video Tutorials</h1>
        <p className="text-gray-600 mt-1">Short step-by-step videos. Each one covers a single task.</p>
      </div>

      {videos.map((t) => (
        <div key={t.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between gap-3 flex-wrap">
            <h2 className="font-semibold text-gray-900">
              {audience === 'clinic' ? `${t.id}. ` : ''}{t.title}
            </h2>
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
