import { useEffect } from 'react';

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = 'Privacy Policy | DentalAppeal';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-500 mb-8">Effective Date: May 10, 2026 | Last Updated: May 10, 2026</p>

          <div className="space-y-6 text-gray-700">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <p className="text-yellow-800 text-sm">
                <strong>⚠️ HIPAA COMPLIANCE NOTICE:</strong> DentalAppeal is a HIPAA-compliant platform designed for dental practices. 
                We serve as a Business Associate under HIPAA and protect all Protected Health Information (PHI) in accordance with federal regulations.
              </p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mt-6">1. Information We Collect</h2>
            <p><strong>Practice Information:</strong> Practice name, address, phone, fax, NPI number, tax ID, and provider credentials.</p>
            <p><strong>User Account Information:</strong> Name, email address, password, and role within the practice.</p>
            <p><strong>Patient Information (PHI):</strong> Patient names, dates of birth, insurance information, procedure codes, clinical notes, denial reasons, and supporting documentation.</p>

            <h2 className="text-xl font-semibold text-gray-900 mt-6">2. How We Use Your Information</h2>
            <p>We use your information to generate appeal letters, track claim status, provide analytics, and improve our AI models. We never sell PHI or use it for marketing without authorization.</p>

            <h2 className="text-xl font-semibold text-gray-900 mt-6">3. HIPAA Compliance</h2>
            <p>DentalAppeal is fully HIPAA-compliant. We implement encryption (TLS 1.3 and AES-256), access controls, audit logs, and secure infrastructure to protect PHI.</p>

            <h2 className="text-xl font-semibold text-gray-900 mt-6">4. Data Sharing</h2>
            <p>We share data only with necessary service providers (Anthropic, Supabase, Stripe, Hostinger) who sign Business Associate Agreements. We do not sell your data.</p>

            <h2 className="text-xl font-semibold text-gray-900 mt-6">5. Data Retention</h2>
            <p>PHI is retained for 7 years from the last date of Service as required by HIPAA and state dental records laws.</p>

            <h2 className="text-xl font-semibold text-gray-900 mt-6">6. Your Rights</h2>
            <p>You have the right to access, correct, export, and request deletion of your data. Contact <a href="mailto:privacy@dentalappeal.claims" className="text-blue-600">privacy@dentalappeal.claims</a> to exercise these rights.</p>

            <h2 className="text-xl font-semibold text-gray-900 mt-6">7. Contact Information</h2>
            <p>Email: <a href="mailto:privacy@dentalappeal.claims" className="text-blue-600">privacy@dentalappeal.claims</a></p>

            <hr className="my-8" />
            <p className="text-center text-gray-500 text-sm">
              DentalAppeal — AI-Powered Dental Insurance Appeals<br />
              HIPAA-Compliant Platform for Dental Practices<br />
              &copy; 2026 Search Box Strategies. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
