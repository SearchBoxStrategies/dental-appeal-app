import type { ComponentType } from 'react';
import {
  Rocket, UserPlus, Building2, Users, PlusCircle, Compass, ClipboardCheck, FileText,
  CalendarClock, LayoutDashboard, Upload, TrendingUp, Bell, CreditCard, LifeBuoy,
  Lightbulb, AlertTriangle, Printer,
} from 'lucide-react';

interface Block {
  title: string;
  steps?: string[];
  bullets?: string[];
  tip?: string;
  warn?: string;
}

interface Section {
  id: string;
  title: string;
  icon: ComponentType<{ className?: string }>;
  where: string;
  blurb: string;
  blocks: Block[];
}

const QUICK_START = [
  'Create your account and click the link in the verification email',
  'Fill in your Practice Profile (name, address, phone, NPI)',
  'Invite your team and tick who is a dentist (optional)',
  'New Claim: upload the denial, check the highlighted fields, Submit Claim',
  'On the claim: tick the checklist, upload X-rays, get the dentist’s note approved',
  'Generate Appeal Letter, fill any [bracketed] details, Download PDF, mail or fax it',
  'Set the status to Appeal Sent, then Won or Paid (with the amount) when the insurer answers',
];

const SECTIONS: Section[] = [
  {
    id: 'account',
    title: 'Create your account and sign in',
    icon: UserPlus,
    where: 'Sign-in page → Create an account',
    blurb: 'Takes about two minutes. Your 14-day free trial starts right away and needs no card.',
    blocks: [
      {
        title: 'Create the account',
        steps: [
          'Open the sign-in page and click Create an account',
          'Enter your Practice Name, Your Name and Email Address',
          'Choose a password with all five of: 8+ characters, 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character (!@#$%^&*)',
          'Type it again in Confirm Password. The strength bar turns green and says Very Strong when it qualifies',
          'Tick the box agreeing to the Terms of Service and Privacy Policy',
          'Click Create Account (the button stays grey until everything is filled in)',
          'Open the verification email and click the link',
        ],
        tip: 'No email after a few minutes? Check your spam or junk folder. You can also try to sign in and click Resend verification email.',
      },
      {
        title: 'Sign in',
        steps: [
          'Enter your email and password, then click Sign in',
          'If two-step sign-in is on, check your email for a 6-digit code, type it in and click Verify Code',
          'No code? Click Resend code',
        ],
      },
      {
        title: 'Forgot your password',
        steps: [
          'On the sign-in page click Forgot password?',
          'Enter your email and click Send Reset Link',
          'Open the email and follow the link to choose a new password',
        ],
      },
      {
        title: 'Good to know',
        bullets: [
          'The person who creates the account becomes the practice Owner',
          'During the free trial you can use everything. When it ends you need a subscription to keep generating appeals (see Billing below)',
        ],
      },
    ],
  },
  {
    id: 'profile',
    title: 'Set up your practice profile',
    icon: Building2,
    where: 'Left menu → Practice Profile',
    blurb: 'Fill this in once. It becomes the letterhead and signature details on every appeal letter.',
    blocks: [
      {
        title: 'Fill it in',
        steps: [
          'Open Practice Profile',
          'Enter the Practice Name (required) and the Provider Name, e.g. Dr. John Smith, DDS',
          'Enter the Street Address, City, State and ZIP Code',
          'Enter the Phone Number, Fax Number, Email Address and Website',
          'Under Professional Credentials enter the NPI Number, Tax ID / EIN and State License Number',
          'Click Save Profile',
        ],
        tip: 'A green “Profile Complete” badge appears when it is done. Canadian clinics: use your 2-letter province code (ON, BC, AB…) in State and your postal code in the ZIP box.',
      },
      {
        title: 'Why it matters',
        bullets: [
          'The letter prints your practice name, address, phone and fax at the top',
          'If the dentist name, address or phone is missing, you get a warning before the letter is written',
        ],
      },
    ],
  },
  {
    id: 'team',
    title: 'Add your team and turn on two-step sign-in',
    icon: Users,
    where: 'Left menu → Team & Security',
    blurb: 'Everyone gets their own sign-in. Only a dentist can approve a clinical note.',
    blocks: [
      {
        title: 'Invite someone (owners only)',
        steps: [
          'Open Team & Security',
          'Under Invite someone, enter their email (name is optional)',
          'Pick a role: Staff (claims, letters, documents) or Owner (also team and billing)',
          'Tick Dentist if they can approve clinical notes',
          'Click Send invitation',
        ],
        bullets: [
          'Pending invitations show under Waiting to accept, with an expiry date',
          'Click Cancel next to an invitation to withdraw it',
        ],
      },
      {
        title: 'If you were invited',
        steps: [
          'Open the invitation email and click the link',
          'Check the practice name and role shown at the top',
          'Enter your name (dentists: this is the name that signs appeal letters)',
          'Choose a password (8+ characters) and confirm it',
          'Click Create my account. You are signed in straight away',
        ],
      },
      {
        title: 'Change a role or remove someone (owners only)',
        steps: [
          'Find the person under Team members',
          'Use the dropdown to switch between Owner and Staff',
          'Tick or untick Dentist',
          'Click the trash icon to remove them. They are signed out immediately',
        ],
        tip: 'If you are the dentist, tick Dentist next to your own name. Otherwise nobody on the team can approve the clinical note.',
      },
      {
        title: 'Turn on two-step sign-in',
        steps: [
          'In the Two-step sign-in box click Turn on',
          'We email a 6-digit code to you',
          'Type the code and click Confirm',
        ],
        bullets: [
          'From then on every sign-in needs your password and a code from your email',
          'To switch it off: click Turn off, enter your password, click Turn off again',
        ],
        tip: 'Turn this on. A stolen password alone is then not enough to see patient claims.',
      },
    ],
  },
  {
    id: 'new-claim',
    title: 'Start a claim',
    icon: PlusCircle,
    where: 'Left menu → New Claim (or the New Claim button on the Dashboard)',
    blurb: 'The quickest way is to upload the insurer’s denial and let the AI fill in the form. You check everything before saving.',
    blocks: [
      {
        title: 'Option A: upload the denial (recommended)',
        steps: [
          'Click New Claim',
          'Click Upload denial and choose the insurer’s EOB or denial letter',
          'Use a PDF or a phone photo (JPG, PNG or WebP), up to 10 MB',
          'Wait while it is read. This can take up to a minute',
          'The form fills in. Fields highlighted in amber need a second look against the paper',
          'Correct anything wrong and fill in anything left empty',
          'Click Submit Claim',
        ],
        tip: 'The uploaded denial is attached to the claim automatically and counts as the first item on the checklist.',
        warn: 'Always compare the form to the paper. The AI can misread a number or date, and the letter is built from what you save.',
      },
      {
        title: 'Option B: type it in',
        bullets: [
          'Patient Name (required)',
          'Date of Birth (required)',
          'Insurance Company (required): pick from the US or Canada list, or choose Other (Not Listed) and type the name',
          'Date of Service (required)',
          'Policy Number and Claim Number',
          'Amount Claimed and Amount Denied',
          'Date on the Denial: used to work out your appeal deadline',
          'Procedure Codes (required): see below',
          'Denial Reason (required): paste it from the EOB',
          'Where to send the appeal: the appeals address printed on the denial (optional)',
        ],
      },
      {
        title: 'Adding procedure codes',
        steps: [
          'Type codes in the box: US codes look like D2740, Canadian codes like 27211',
          'Add several at once by separating them with spaces or commas',
          'Click Add (or press Enter)',
          'Or click a category such as Restorative and tick the boxes',
          'Selected codes show as blue chips. Click the × on a chip to remove it',
        ],
        tip: 'You need at least one code. The list is a shortcut for common codes, not a limit: any correctly formatted code works.',
      },
      {
        title: 'Two fields that save you trouble later',
        bullets: [
          'Date on the Denial: with it, the deadline is worked out for you from the insurer’s appeal window',
          'Where to send the appeal: if blank, the letter uses the insurer’s address on file, or leaves a blank when we have none',
        ],
      },
    ],
  },
  {
    id: 'claim-page',
    title: 'Find your way around a claim',
    icon: Compass,
    where: 'All Claims → View',
    blurb: 'Everything for one denial lives on one page. From top to bottom:',
    blocks: [
      {
        title: 'What you will see',
        bullets: [
          'Header: patient name, status badge, and the main button (Generate Appeal Letter, later Download PDF and Print)',
          'Claim Information: patient, insurer, service date, codes, amounts, denial reason',
          'Deadline box: appeal-by date, or the follow-up date once the appeal is sent. Click Edit dates to change them',
          'Appeal Status dropdown: where you record progress',
          'What to include: the evidence checklist for this claim',
          'Dentist’s note: the clinical note, with approval',
          'Supporting Documents: your uploaded files',
          'Generated Appeal Letter: appears after you write it',
        ],
      },
    ],
  },
  {
    id: 'prepare',
    title: 'Prepare the appeal: checklist, documents and dentist’s note',
    icon: ClipboardCheck,
    where: 'Open a claim → What to include, Dentist’s note, Supporting Documents',
    blurb: 'Insurers decide on the evidence. Do this before writing the letter so the letter can use it.',
    blocks: [
      {
        title: 'The “What to include” checklist',
        steps: [
          'Open the claim and find the What to include card',
          'Read each item. The small grey line explains why the insurer wants it',
          'Tick each item once you have it ready (the card shows, for example, “3 of 7 ready”)',
        ],
        bullets: [
          'The list is built from your procedure codes and the denial reason, so it differs for a crown, a root canal, scaling and so on',
          'Ticked items are printed as enclosures in the letter, so only tick what you will actually send',
        ],
      },
      {
        title: 'Upload supporting documents',
        steps: [
          'In Supporting Documents click Upload',
          'Choose a PDF, JPG or PNG, up to 10 MB each',
          'Repeat for each file: X-rays, photos, perio charting, clinical notes, EOBs',
        ],
        bullets: [
          'Eye icon: view the file',
          'Download icon: save a copy',
          '× icon: delete it (you are asked to confirm)',
        ],
        tip: 'Files are only available to signed-in members of your practice.',
      },
      {
        title: 'Get the dentist’s note approved',
        steps: [
          'In the Dentist’s note card click Draft note with AI (up to a minute). Or click Write it myself',
          'Read the draft and fill in every [bracketed] detail: diagnosis, findings, history, why the treatment was needed',
          'Click Save draft if you need to come back later',
          'A dentist clicks Approve as [their name]',
        ],
        bullets: [
          'The Approve button stays grey until the text is not empty and no [brackets] remain',
          'Only a user marked as Dentist sees the Approve button',
          'Editing an approved note sends it back for sign-off',
          'New AI draft replaces the current note (you are asked first)',
        ],
        warn: 'Only an approved note is used in the letter. Without one, the letter’s clinical details are left as blanks.',
      },
    ],
  },
  {
    id: 'letter',
    title: 'Generate, edit and send the appeal letter',
    icon: FileText,
    where: 'Open a claim → Generate Appeal Letter',
    blurb: 'The AI writes the first draft. A person reviews it, completes it and sends it.',
    blocks: [
      {
        title: 'Write the letter',
        steps: [
          'Click Generate Appeal Letter at the top of the claim',
          'If something is missing you see a yellow box, “Before you write the letter”. It lists gaps such as an unapproved dentist’s note, an incomplete practice profile or no appeals address',
          'Click the link beside a gap to fix it, or click Write it anyway (fill blanks later)',
          'Wait while the letter is written. It can take up to a minute',
          'The letter appears under Generated Appeal Letter (click Show Letter if it is hidden)',
        ],
      },
      {
        title: 'Review and complete it',
        steps: [
          'Read the whole letter against the claim and the denial',
          'If you see a yellow warning about [bracketed] details, click Edit',
          'Replace every [bracketed] item with the real information',
          'Click Save letter',
        ],
        warn: 'Never send a letter that still has [brackets] in it. Read every line: you and the dentist are responsible for what goes out.',
      },
      {
        title: 'Your options once it is written',
        bullets: [
          'Download PDF: the letter with your letterhead (best for faxing or emailing)',
          'Print: opens a print view with your letterhead',
          'Copy: copies the letter and letterhead to paste elsewhere',
          '.txt: downloads a plain-text version',
          'Rewrite: writes a fresh version. The old one stays in the history',
          'Hide Letter / Show Letter: collapses the letter box',
        ],
      },
      {
        title: 'Send it',
        steps: [
          'Print the letter or save the PDF',
          'Gather the enclosures listed in the letter (EOB, x-rays, dentist’s note and so on)',
          'Mail or fax everything to the insurer’s appeals address',
          'Set the status to Appeal Sent (next section)',
        ],
        tip: 'No tool can promise the outcome. Success depends on the clinical case and the plan, which is why the checklist and dentist’s note matter.',
      },
    ],
  },
  {
    id: 'track',
    title: 'Track deadlines, follow up and record the result',
    icon: CalendarClock,
    where: 'Open a claim → Deadline box and Appeal Status',
    blurb: 'Keep the status current. The Dashboard reminders and your recovered-dollars total depend on it.',
    blocks: [
      {
        title: 'What each status means',
        bullets: [
          'Pending / Draft: claim saved, appeal not sent yet',
          'Appeal Sent: you mailed or faxed it',
          'Under Review: the insurer confirmed they are looking at it',
          'Won: the insurer reversed the denial',
          'Lost: the insurer upheld the denial',
          'Paid: the money has been received',
        ],
      },
      {
        title: 'After you send the appeal',
        steps: [
          'Open the claim',
          'Change Appeal Status to Appeal Sent',
          'The Deadline box now shows a follow-up date 30 days out',
          'If there is still no answer after 30 days, the box turns amber and says to call the insurer. The claim also appears under Needs attention on the Dashboard',
        ],
      },
      {
        title: 'Watch the appeal deadline',
        bullets: [
          'The Deadline box shows “Appeal by [date]” with the days left',
          'It turns red when 14 days or fewer are left, and the claim appears under Needs attention',
          'If the deadline is missing or wrong, check the denial notice',
        ],
      },
      {
        title: 'Fix a missing or wrong deadline',
        steps: [
          'Click Edit dates',
          'Change the Date on the denial (the deadline is recalculated from the insurer’s appeal window) or type the Appeal deadline yourself',
          'Click Save',
        ],
      },
      {
        title: 'Record the result',
        steps: [
          'Set Appeal Status to Won or Paid',
          'A green box asks, “How much did the insurer pay on this appeal?”',
          'Enter the amount, e.g. 450.00',
          'Click Mark as Won (or Mark as Paid)',
        ],
        bullets: [
          'For Lost, just choose Lost: no amount is needed',
          'The amounts you enter add up to the “Money recovered” total on the Dashboard and in Analytics',
          'Entered the wrong amount? Choose Won or Paid again and re-enter it',
        ],
      },
    ],
  },
  {
    id: 'dashboard',
    title: 'Dashboard and All Claims',
    icon: LayoutDashboard,
    where: 'Left menu → Dashboard and All Claims',
    blurb: 'Your daily view: what needs doing, and how much you have recovered.',
    blocks: [
      {
        title: 'On the Dashboard',
        bullets: [
          'Needs attention: appeals due within 14 days, and appeals sent 30+ days ago with no answer. Click one to open it',
          'Money recovered: your all-time and this-month total, win rate, return on your subscription, and the value waiting on open appeals',
          'Once you have results it also shows recovered dollars per month and your top insurers',
          'Total Claims, Total Appeals and Appeals This Month',
          'Recent Claims: your latest five, with a View link',
        ],
      },
      {
        title: 'In All Claims',
        steps: [
          'Type in the search box to find a claim by patient, insurer or denial reason',
          'Use the status dropdown to show only one status, such as Appeal Sent',
          'Click View on a row to open the claim',
        ],
        bullets: [
          'The cards at the top show Total Claims, Active Appeals, Success Rate and Recovered',
          'Click New Claim at the top right to add another',
        ],
      },
    ],
  },
  {
    id: 'bulk',
    title: 'Bulk upload many claims from a spreadsheet',
    icon: Upload,
    where: 'Left menu → Bulk Upload',
    blurb: 'Handy when you have a backlog of denials to add at once.',
    blocks: [
      {
        title: 'Upload a CSV',
        steps: [
          'Open Bulk Upload and click Download Template',
          'Open the template in Excel or Google Sheets and replace the example row with your claims, one per row',
          'Save it as CSV (in Excel: File > Save As > CSV)',
          'Back on Bulk Upload click Select File and choose your CSV',
          'Read the result: Successful, Failed and Total processed',
        ],
      },
      {
        title: 'Fill the columns correctly',
        bullets: [
          'Required: patient_name, patient_dob, insurance_company, procedure_codes, denial_reason, service_date',
          'Optional: policy_number, claim_number, amount_claimed, amount_denied, denial_date',
          'Dates must be YYYY-MM-DD, e.g. 2026-09-15',
          'Put several procedure codes in one cell separated by spaces, e.g. D2740 D2750',
          'Amounts are plain numbers, e.g. 1250.00',
          'Up to 10,000 claims per file, and the file can be up to 10 MB',
        ],
      },
      {
        title: 'If some rows fail',
        steps: [
          'Read the list “Rows not imported”. It gives the row number and the reason',
          'Fix just those rows in a new CSV',
          'Upload that new file',
        ],
        warn: 'Do not re-upload the whole file: the rows that worked would be added a second time.',
        tip: 'Bulk upload only creates the claims (as Draft). Open each one to add documents, get the dentist’s note approved and generate its letter.',
      },
    ],
  },
  {
    id: 'analytics',
    title: 'Analytics',
    icon: TrendingUp,
    where: 'Left menu → Analytics',
    blurb: 'See how your appeals are performing.',
    blocks: [
      {
        title: 'Read the report',
        steps: [
          'Open Analytics',
          'Choose a period: Last 7 Days, Last 30 Days, Last 90 Days or Last 12 Months',
          'Click Export CSV to download the figures',
        ],
        bullets: [
          'Total Claims, Success Rate, Appeals Won and Est. Recovered',
          'Average response time, top payer and time saved',
          'Return on your subscription and a month-by-month chart',
        ],
        tip: 'The numbers only mean something if statuses and amounts paid are kept up to date on each claim.',
      },
    ],
  },
  {
    id: 'notifications',
    title: 'Email notifications',
    icon: Bell,
    where: 'Left menu → Notifications',
    blurb: 'Choose which emails you get.',
    blocks: [
      {
        title: 'Change your preferences',
        steps: [
          'Open Notifications',
          'Switch each type on or off',
          'Click Save Preferences',
        ],
        bullets: [
          'Appeal Status Updates: when an appeal’s status changes',
          'Payment Receipts: receipts for successful payments',
          'Weekly Digest: a weekly summary of your claims and appeals',
          'Product Updates: new features and tips (off by default)',
        ],
      },
    ],
  },
  {
    id: 'billing',
    title: 'Billing, your subscription and cancelling',
    icon: CreditCard,
    where: 'Left menu → Billing (owners only)',
    blurb: 'Professional plan: $199 USD per month, with a 14-day free trial that needs no card.',
    blocks: [
      {
        title: 'Subscribe',
        steps: [
          'Open Billing',
          'Click Subscribe Now',
          'Enter your card on Stripe’s secure payment page',
          'You return to Billing and the status shows Active',
        ],
        tip: 'Your card details are entered on Stripe’s page only. DentalAppeal never sees or stores them.',
      },
      {
        title: 'Update your card or cancel',
        steps: [
          'Open Billing and click Manage Subscription',
          'You are taken to Stripe’s customer portal',
          'Update your payment method, or cancel there',
        ],
        bullets: [
          'You can cancel any time',
          'Staff members see “Only a practice owner can manage billing”',
        ],
      },
      {
        title: 'When the trial ends',
        bullets: [
          'Writing new appeal letters needs an active subscription. You will see “Your free trial has ended” until an owner subscribes on the Billing page',
        ],
      },
    ],
  },
  {
    id: 'trouble',
    title: 'Something not working?',
    icon: LifeBuoy,
    where: 'Quick fixes for the most common snags',
    blurb: 'Start here. If it is still stuck, email support@dentalappeal.claims.',
    blocks: [
      {
        title: 'Common problems',
        bullets: [
          'No verification email: check spam or junk, then use Resend verification email on the sign-in page',
          'Password rejected: it needs all five requirements (8+ characters, uppercase, lowercase, number, special character)',
          'No 6-digit sign-in code: click Resend code and check spam',
          'Upload denial says it could not read the document: try a clearer scan or photo (PDF, JPG, PNG or WebP, max 10 MB), or type the claim in by hand',
          'Approve button is grey: remove every [bracket], make sure the note is not empty, and sign in as a user marked Dentist',
          'No one can approve the note: an owner opens Team & Security and ticks Dentist on the right person',
          'Letter has blanks or [brackets]: click Edit and fill them in, or get the dentist’s note approved and rewrite',
          'Message “Your free trial has ended”: an owner opens Billing and clicks Subscribe Now',
          'Cannot see subscription buttons: Billing is for owners only',
          'Wrong appeal deadline: open the claim and click Edit dates',
          'Wrong amount recovered: set the status to Won or Paid again and re-enter the amount',
          'Bulk upload rows failed: read the reason next to each row, fix those rows and upload only them',
        ],
      },
    ],
  },
];

function BlockView({ block }: { block: Block }) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900">{block.title}</h3>

      {block.steps && (
        <ol className="space-y-2">
          {block.steps.map((s, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                {i + 1}
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      )}

      {block.bullets && (
        <ul className="space-y-1.5">
          {block.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}

      {block.tip && (
        <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
          <span>{block.tip}</span>
        </div>
      )}

      {block.warn && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <span>{block.warn}</span>
        </div>
      )}
    </div>
  );
}

export default function ClinicGuide() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Step-by-Step Guide</h1>
          <p className="mt-1 text-gray-600">Everything you need to go from a denied claim to a sent appeal. Pick a topic on the left.</p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 print:hidden"
        >
          <Printer className="h-4 w-4" /> Print this guide
        </button>
      </div>

      <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Rocket className="h-5 w-5 text-blue-600" />
          <h2 className="font-semibold text-gray-900">Quick start: your first appeal in 7 steps</h2>
        </div>
        <ol className="space-y-2.5">
          {QUICK_START.map((s, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-800">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                {i + 1}
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-gray-600">Each step is explained in detail below.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <nav aria-label="Guide topics" className="print:hidden lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-xl border bg-white p-3 shadow-sm">
            <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Topics</p>
            <ul className="grid grid-cols-1 gap-0.5 sm:grid-cols-2 lg:grid-cols-1">
              {SECTIONS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-gray-400" />
                      <span>{i + 1}. {s.title.split(':')[0]}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        <div className="space-y-6">
          {SECTIONS.map((s, i) => {
            const Icon = s.icon;
            return (
              <section
                key={s.id}
                id={s.id}
                className="scroll-mt-20 overflow-hidden rounded-xl border bg-white shadow-sm print:break-inside-avoid"
              >
                <header className="border-b bg-gray-50 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </span>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{i + 1}. {s.title}</h2>
                      <p className="text-xs text-gray-500">Where: {s.where}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-700">{s.blurb}</p>
                </header>
                <div className="space-y-6 p-6">
                  {s.blocks.map((b) => <BlockView key={b.title} block={b} />)}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Still stuck? Email{' '}
        <a className="text-blue-600 hover:underline" href="mailto:support@dentalappeal.claims">support@dentalappeal.claims</a>.
      </p>
    </div>
  );
}
