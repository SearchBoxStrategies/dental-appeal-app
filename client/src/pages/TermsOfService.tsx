import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function TermsOfService() {
  useEffect(() => {
    document.title = 'Terms of Service | DentalAppeal';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-500 mb-8">Effective Date: May 10, 2026</p>

          <div className="space-y-6 text-gray-700">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <p className="text-yellow-800 text-sm">
                <strong>⚠️ IMPORTANT NOTICE FOR DENTAL PRACTICES:</strong> This Service processes Protected Health Information (PHI). 
                By using DentalAppeal, you acknowledge that you are a Covered Entity under HIPAA and agree to execute our 
                Business Associate Agreement (BAA) before processing any PHI.
              </p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mt-6">1. Definitions</h2>
            <p><strong>"Service"</strong> means the DentalAppeal SaaS platform, including the website, API, and AI-powered appeal letter generation tools.</p>
            <p><strong>"Customer"</strong> means the dental practice or healthcare organization subscribing to the Service.</p>
            <p><strong>"PHI"</strong> means Protected Health Information as defined under HIPAA (45 C.F.R. § 160.103).</p>

            <h2 className="text-xl font-semibold text-gray-900 mt-6">2. HIPAA Compliance</h2>
            <p>DentalAppeal acts as a Business Associate under HIPAA. Before processing any PHI, Customer must execute a separate Business Associate Agreement (BAA) with the Company.</p>
            <p>To request a BAA, contact <a href="mailto:legal@dentalappeal.claims" className="text-blue-600">legal@dentalappeal.claims</a>.</p>

            <h2 className="text-xl font-semibold text-gray-900 mt-6">3. Subscription and Fees</h2>
            <p>The Service is offered on a monthly subscription basis at $199 per month for the Professional Plan. Subscriptions automatically renew monthly unless cancelled with 30 days' notice.</p>

            <h2 className="text-xl font-semibold text-gray-900 mt-6">4. Data Ownership</h2>
            <p>Customer retains all ownership rights to Client Data, including all PHI. The Company does not claim ownership over any Client Data.</p>

            <h2 className="text-xl font-semibold text-gray-900 mt-6">5. Limitation of Liability</h2>
            <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE COMPANY'S TOTAL LIABILITY SHALL NOT EXCEED THE FEES PAID BY CUSTOMER IN THE 12 MONTHS PRECEDING THE CLAIM.</p>

            <h2 className="text-xl font-semibold text-gray-900 mt-6">6. Contact Information</h2>
            <p>Email: <a href="mailto:support@dentalappeal.claims" className="text-blue-600">support@dentalappeal.claims</a></p>

            <hr className="my-8" />
            <p className="text-center text-gray-500 text-sm">
              DentalAppeal — AI-Powered Dental Insurance Appeals<br />
              &copy; 2026 Search Box Strategies. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
