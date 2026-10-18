import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const H2 = ({ id, children }: { id?: string; children: React.ReactNode }) => (
  <h2 id={id} className="text-xl font-semibold text-gray-900 mt-8 scroll-mt-6">{children}</h2>
);

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = 'Privacy Policy | DentalAppeal';
    if (window.location.hash) {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-500 mb-8">Effective date: October 18, 2026</p>

          <div className="space-y-4 text-gray-700">
            <p>
              This policy explains what information DentalAppeal collects, how we use and protect it, where it is stored, and the
              choices you have. DentalAppeal is operated by Search Box Strategies, a Canadian business ("we", "us"). We follow
              Canada's Personal Information Protection and Electronic Documents Act (PIPEDA) and, where they apply, provincial
              privacy laws, including Quebec's.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <p className="text-blue-900 text-sm">
                <strong>Patient information:</strong> your patients' information is stored and processed in the United States.
                We do not currently sign HIPAA Business Associate Agreements. US practices covered by HIPAA should not enter
                protected health information until a BAA is in place (see our{' '}
                <Link to="/terms#patient-information" className="text-blue-700 underline">Terms of Service</Link>).
              </p>
            </div>

            <H2>1. Information we collect</H2>
            <p><strong>Practice and account information:</strong> practice name, address, phone and fax, provider details (such as NPI or licence numbers), and the name, email address and role of each person on the account. Passwords are stored only in scrambled (hashed) form.</p>
            <p><strong>Patient and claim information you enter:</strong> patient names and dates of birth, insurance and claim details, procedure codes, denial reasons, clinical notes, and documents you upload (such as explanation-of-benefits forms, x-rays and photos).</p>
            <p><strong>Billing information:</strong> your subscription status and payment history. Card numbers are entered directly with our payment processor, Stripe; we never see or store them.</p>
            <p><strong>Affiliate information:</strong> if you join the affiliate program, your name, company and email, and the practices credited to you. Identity and bank details for payouts are collected and held by Stripe, not by us.</p>
            <p><strong>Technical information:</strong> sign-in records, the IP address and browser of visitors who click an affiliate referral link, and basic server logs used for security and troubleshooting.</p>

            <H2>2. How we use it</H2>
            <ul className="list-disc pl-6 space-y-1">
              <li>to run the service: read denial notices, draft appeal letters and notes, track claims and deadlines, and send you reminders you have turned on;</li>
              <li>to manage accounts, billing and the affiliate program;</li>
              <li>to keep the service secure and fix problems;</li>
              <li>to contact you about your account and important changes.</li>
            </ul>
            <p>
              We do <strong>not</strong> sell personal information, use patient information for marketing, or use your data to train
              AI models.
            </p>

            <H2>3. Who we share it with</H2>
            <p>We share information only with the service providers we need to run DentalAppeal, and only for that purpose:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Hostinger</strong> (United States): hosts the application and stores uploaded files, and sends our emails. Emails do not include patient information.</li>
              <li><strong>Supabase</strong>, on Amazon Web Services (United States, Virginia): stores the database.</li>
              <li><strong>Anthropic</strong> (United States): its Claude AI reads denial notices and drafts letters. Anthropic does not use this data to train its models, and keeps it only for a limited period under its commercial terms.</li>
              <li><strong>Stripe</strong> (United States and Canada): payment processing and affiliate payouts.</li>
            </ul>
            <p>We may also disclose information if the law requires it, or to protect the rights and safety of our users or others.</p>

            <H2 id="storage">4. Where your information is stored</H2>
            <p>
              Our servers, database and AI provider are in the United States. Information stored there is protected by our safeguards
              and our providers' contracts, but it is subject to United States law and may be accessed by US courts and authorities
              under that law. Canadian practices should tell their patients that their information may be stored and processed
              outside Canada.
            </p>

            <H2>5. How we protect it</H2>
            <ul className="list-disc pl-6 space-y-1">
              <li>all connections are encrypted in transit (HTTPS);</li>
              <li>uploaded documents are encrypted on our servers (AES-256), and the database is encrypted by our provider;</li>
              <li>each practice can only see its own data, and staff accounts have roles;</li>
              <li>two-step verification is available for every account and required for administrators;</li>
              <li>administrative actions are logged.</li>
            </ul>
            <p>No system is perfectly secure. If a breach affects your information, we will notify the affected practice without undue delay and report it where the law requires, so that you can meet your own obligations to your patients.</p>

            <H2>6. How long we keep it</H2>
            <p>
              We keep your information while your account is open. When you close your account, you can ask us to export it or delete
              it; we will delete it within 30 days of your request, except billing and tax records we must keep by law. Your practice
              is responsible for keeping its own patient records for as long as your professional rules require.
            </p>

            <H2>7. Cookies and browser storage</H2>
            <p>
              We use your browser's storage to keep you signed in and, if you arrived through an affiliate link, to remember that
              referral for 90 days. We do not use advertising or third-party tracking cookies.
            </p>

            <H2>8. Your rights</H2>
            <p>
              You can ask to see, correct, export or delete the personal information we hold about you, and to withdraw consent where
              that applies. Requests about patient information should normally go through the dental practice, which controls it; we
              will help the practice respond. Email <a href="mailto:privacy@dentalappeal.claims" className="text-blue-600">privacy@dentalappeal.claims</a> and
              we will reply within 30 days.
            </p>
            <p>
              If you are not satisfied with our answer, you can complain to the Office of the Privacy Commissioner of Canada
              (priv.gc.ca) or your provincial privacy commissioner.
            </p>

            <H2>9. Changes to this policy</H2>
            <p>We will post any changes here and update the date above. If a change materially affects you, we will email the account owner before it takes effect.</p>

            <H2>10. Contact</H2>
            <p>
              Privacy questions and requests: <a href="mailto:privacy@dentalappeal.claims" className="text-blue-600">privacy@dentalappeal.claims</a><br />
              Everything else: <a href="mailto:support@dentalappeal.claims" className="text-blue-600">support@dentalappeal.claims</a>
            </p>

            <hr className="my-8" />
            <p className="text-center text-gray-500 text-sm">
              DentalAppeal — AI-Powered Dental Insurance Appeals<br />
              © {new Date().getFullYear()}{' '}
              <a
                href="https://searchboxstrategies.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Search Box Strategies
              </a>
              . All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
