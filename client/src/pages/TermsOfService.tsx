import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const H2 = ({ id, children }: { id?: string; children: React.ReactNode }) => (
  <h2 id={id} className="text-xl font-semibold text-gray-900 mt-8 scroll-mt-6">{children}</h2>
);

export default function TermsOfService() {
  useEffect(() => {
    document.title = 'Terms of Service | DentalAppeal';
    // Deep links such as /terms#affiliate-program
    if (window.location.hash) {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-500 mb-8">Effective date: October 18, 2026</p>

          <div className="space-y-4 text-gray-700">
            <p>
              These terms are an agreement between you and Search Box Strategies, a Canadian business that operates
              DentalAppeal ("we", "us"). "You" means the dental practice that creates an account, and the people it
              invites to use it. By creating an account or using DentalAppeal you agree to these terms and to
              our <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
            </p>

            <H2>1. The service</H2>
            <p>
              DentalAppeal is web-based software that helps dental practices prepare insurance appeals. You enter or upload
              a denied claim, and the software drafts an appeal letter and related documents using artificial intelligence (AI).
            </p>
            <p>
              <strong>You are responsible for every letter you send.</strong> AI-drafted content can contain mistakes. A qualified
              member of your team must review and, where needed, correct each letter before it is sent, and the treating
              dentist is responsible for any clinical statements. DentalAppeal does not provide legal, medical or billing advice,
              and we do not guarantee that any appeal will succeed or that any insurer will pay.
            </p>

            <H2 id="patient-information">2. Patient information</H2>
            <p>
              DentalAppeal stores the information you enter, which can include patient names, dates of birth, insurance
              details, procedure codes and supporting documents. Our servers, database and AI provider are in the United States.
              How we protect and use this information is described in our{' '}
              <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
            </p>
            <p>
              <strong>United States practices (HIPAA):</strong> we do not currently sign Business Associate Agreements (BAAs),
              and DentalAppeal is not yet set up for HIPAA-regulated patient information. If your practice is a HIPAA covered
              entity, do not enter protected health information until we have signed a BAA with you. You can use DentalAppeal
              with fictional or de-identified examples in the meantime. Contact{' '}
              <a href="mailto:legal@dentalappeal.claims" className="text-blue-600">legal@dentalappeal.claims</a> to be told
              when BAAs are available.
            </p>
            <p>
              <strong>Canadian practices:</strong> you remain responsible for the patient information you collect, including
              having the consent and giving the notices your provincial and federal privacy laws require, among them that the
              information will be stored and processed in the United States.
            </p>
            <p>
              Only enter information you are allowed to share with us, and only what the appeal needs.
            </p>

            <H2>3. Accounts and security</H2>
            <p>
              Keep your sign-in details private and turn on two-step verification. You are responsible for what happens in
              your account, including the people you invite. Tell us right away at{' '}
              <a href="mailto:support@dentalappeal.claims" className="text-blue-600">support@dentalappeal.claims</a> if you
              think someone has used your account without permission.
            </p>

            <H2 id="billing">4. Free trial, subscription and billing</H2>
            <p>
              <strong>Free trial.</strong> New practices get a 14-day free trial. No payment card is needed to start it. At the
              end of the trial, you need a paid subscription to keep creating appeals.
            </p>
            <p>
              <strong>Price.</strong> The Professional Plan costs <strong>US$199 per month</strong>. All prices are in United
              States dollars (USD). Taxes are added where they apply. Your bank or card issuer may charge its own currency
              conversion fees; those are not set by us.
            </p>
            <p>
              <strong>Renewal.</strong> Your subscription renews automatically each month and is charged to the card on file
              through our payment processor, Stripe. If a payment fails, we may limit access until it is resolved.
            </p>
            <p>
              <strong>Price changes.</strong> We will give you at least 30 days' notice by email before a price change takes
              effect. You can cancel before then.
            </p>

            <H2 id="cancellation">5. Cancellation and refunds</H2>
            <p>
              <strong>Cancel any time</strong> from <em>Billing → Manage Subscription</em> in the app, or by emailing us. Your
              subscription stays active until the end of the month you have already paid for, and you will not be charged again.
            </p>
            <p>
              <strong>Refunds.</strong> Monthly fees are not refunded for partial months or unused time, except where the law
              requires it. If you were charged by mistake (for example, twice, or after you cancelled), contact us within 30 days
              of the charge and we will refund it.
            </p>

            <H2>6. Acceptable use</H2>
            <p>Do not use DentalAppeal to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>submit false, misleading or fraudulent claims or appeals;</li>
              <li>enter information you have no right to share;</li>
              <li>try to break, overload, copy or get around the security of the service;</li>
              <li>resell or share access outside your practice.</li>
            </ul>
            <p>We may suspend or close accounts that break these rules.</p>

            <H2>7. Your data</H2>
            <p>
              You own the information you put into DentalAppeal and the letters it produces for you. You give us permission to
              store and process it only to run the service for you. When you close your account you can ask us to export or
              delete your data, as described in the Privacy Policy.
            </p>

            <H2 id="affiliate-program">8. Affiliate program</H2>
            <p>
              These terms apply if you join the DentalAppeal affiliate program (an "affiliate") to refer dental practices to us.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Approval.</strong> Applications are reviewed by us. We can decline an application or end an affiliate's
                participation at any time.
              </li>
              <li>
                <strong>Credit.</strong> A practice is credited to you when it signs up through your referral link (within 90 days
                of clicking it, in the same browser) or enters your referral code when it signs up. The most recent referral link a
                practice clicked wins.
              </li>
              <li>
                <strong>Commission.</strong> You earn a percentage of every subscription payment a credited practice makes, for as
                long as it remains a paying customer. The rate depends on how many of the practices you referred are paying
                customers at the time of each payment: 25% (Standard, 1 to 4 paying practices), 30% (Pro, 5 to 14) or 35% (Partner,
                15 or more). Free trials earn nothing; commission starts with the first paid month.
              </li>
              <li>
                <strong>Bonuses.</strong> For each practice you refer, you also earn a US$50 sign-on bonus once its first payment has
                cleared the 30-day hold, and a US$50 loyalty bonus at 6 months and again at 12 months if the practice is still a
                paying customer on those dates. Bonuses are added automatically and paid out with your commissions.
              </li>
              <li>
                <strong>What you can see.</strong> Your dashboard shows whether each practice you referred is active, has a failed
                payment, or has not started a claim recently, so you can check in with them. It never shows claim, patient or
                clinical information.
              </li>
              <li>
                <strong>Refunds and chargebacks.</strong> If a payment is refunded or disputed, the commission on it is reversed.
              </li>
              <li>
                <strong>Payment.</strong> Commissions are held for 30 days, then paid monthly, around the 15th, in US dollars through
                Stripe to the account you connect. You must complete Stripe's identity verification to be paid. Balances under US$50
                carry over to the next month. Any currency conversion is done by Stripe or your bank on your side.
              </li>
              <li>
                <strong>Not allowed:</strong> referring your own practice or one you own or manage; spam or misleading claims about
                DentalAppeal; bidding on "DentalAppeal" in paid search ads; and offering incentives we have not approved. Commission
                earned this way is forfeited.
              </li>
              <li>
                <strong>Taxes.</strong> You are responsible for reporting and paying tax on your commissions. Stripe may ask for tax
                information and issue tax forms where required.
              </li>
              <li>
                <strong>Relationship.</strong> Affiliates are independent. You are not our employee, agent or partner, and you may
                not make promises on our behalf.
              </li>
              <li>
                <strong>Changes.</strong> We may change commission rates or program rules with 30 days' notice by email. Commissions
                already earned are paid under the rules in place when they were earned.
              </li>
            </ul>

            <H2>9. Availability and changes to the service</H2>
            <p>
              We work to keep DentalAppeal available and your data safe, but we do not promise it will always be available or
              error-free. Keep your own copies of letters you send. We may improve or change features over time.
            </p>

            <H2>10. Limitation of liability</H2>
            <p>
              To the maximum extent permitted by law, we are not liable for indirect or consequential losses, including denied or
              unpaid claims, lost revenue or lost data, and our total liability for any claim is limited to the fees you paid us in
              the 12 months before the claim.
            </p>

            <H2>11. Changes to these terms</H2>
            <p>
              We may update these terms. If a change materially affects you, we will email the account owner at least 30 days before
              it takes effect. Continuing to use DentalAppeal after that means you accept the updated terms.
            </p>

            <H2>12. Contact</H2>
            <p>
              Support: <a href="mailto:support@dentalappeal.claims" className="text-blue-600">support@dentalappeal.claims</a><br />
              Legal: <a href="mailto:legal@dentalappeal.claims" className="text-blue-600">legal@dentalappeal.claims</a><br />
              Affiliates: <a href="mailto:affiliates@dentalappeal.claims" className="text-blue-600">affiliates@dentalappeal.claims</a>
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
