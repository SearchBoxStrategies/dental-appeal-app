import { Link } from 'react-router-dom';
import { BookOpen, PlayCircle, FileQuestion, MessageCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CLINIC_FAQS = [
  { q: 'Where do I start?', a: 'Open the Step-by-Step Guide. It walks you from creating your account to sending your first appeal, one step at a time.' },
  { q: 'How much does it cost? Is there a free trial?', a: 'Every new practice gets a 14-day free trial with no card needed. After that the Professional plan is $199 per month. An owner subscribes from the Billing page and can cancel any time from Manage Subscription.' },
  { q: 'How long does it take to generate an appeal letter?', a: 'Usually well under a minute. The page tells you while the letter is being written. Always read the letter and fill in any [bracketed] details before you send it.' },
  { q: 'What files can I upload?', a: 'The denial notice can be a PDF or a photo (JPG, PNG or WebP). Supporting documents can be PDF, JPG or PNG. The limit is 10 MB per file.' },
  { q: 'Who can approve the dentist’s note?', a: 'Only a team member marked as Dentist. An owner can tick Dentist next to a name on the Team & Security page.' },
  { q: 'Do you guarantee appeal success?', a: 'No. Success depends on the clinical case, the evidence you include and the insurance plan. The checklist and dentist’s note are there to give each appeal its best chance.' },
  { q: 'Is DentalAppeal HIPAA compliant?', a: 'Not yet. Your data is encrypted and stored in the United States, but we do not currently sign Business Associate Agreements. US practices covered by HIPAA should not enter real patient information until a BAA is in place; Canadian practices can use DentalAppeal now. See our Terms of Service and Privacy Policy for details.' },
  { q: 'I forgot my password. What do I do?', a: 'On the sign-in page click Forgot password? and we will email you a reset link. If it does not arrive, check your spam or junk folder.' },
  { q: 'How do I get support?', a: 'Email support@dentalappeal.claims and we will get back to you.' },
];

const AFFILIATE_FAQS = [
  { q: 'Where do I find my link and my earnings?', a: 'Open your Affiliate Dashboard. Your link, clicks, sign-ups and commissions are all there.' },
  { q: 'How do I get paid?', a: 'Click Set up payouts in the Get Paid card on your dashboard and finish the secure payout set-up. Keep Pay me automatically each month ticked.' },
  { q: 'How do I get support?', a: 'Email support@dentalappeal.claims and we will get back to you.' },
];

export default function Help() {
  const { user } = useAuth();
  const isAffiliate = user?.user_type === 'affiliate';
  const faqs = isAffiliate ? AFFILIATE_FAQS : CLINIC_FAQS;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-gray-600 mt-1">Guides, answers to common questions, and how to reach us</p>
      </div>

      <Link
        to="/tutorials"
        className="flex items-center justify-between gap-4 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-sm hover:shadow-md transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100">
            {isAffiliate ? <PlayCircle className="h-6 w-6 text-blue-600" /> : <BookOpen className="h-6 w-6 text-blue-600" />}
          </div>
          <div>
            <h2 className="font-semibold text-blue-900">{isAffiliate ? 'Video Tutorials' : 'Step-by-Step Guide'}</h2>
            <p className="text-sm text-blue-800">
              {isAffiliate
                ? 'Short walkthroughs for the affiliate program.'
                : 'From your first sign-in to a sent appeal, one clear step at a time.'}
            </p>
          </div>
        </div>
        <ArrowRight className="h-5 w-5 shrink-0 text-blue-600" />
      </Link>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <FileQuestion className="w-5 h-5 text-blue-600" />
            Frequently Asked Questions
          </h2>
        </div>
        <div className="divide-y">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-4">
              <p className="font-medium text-gray-900 mb-1">{faq.q}</p>
              <p className="text-sm text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center gap-4 flex-wrap justify-between">
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Still need help?</h3>
            <p className="text-blue-800 text-sm">Contact our support team for assistance</p>
          </div>
          <a
            href="mailto:support@dentalappeal.claims"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-all shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
