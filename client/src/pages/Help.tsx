import { Mail, BookOpen } from 'lucide-react';

export default function Help() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-gray-600 mt-1">Get help with DentalAppeal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold">Documentation</h2>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Read our comprehensive guides and API documentation.
          </p>
          <a
            href="https://docs.dentalappeal.claims"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            View Documentation →
          </a>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold">Contact Support</h2>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Email our support team for assistance.
          </p>
          <a
            href="mailto:support@dentalappeal.claims"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            support@dentalappeal.claims →
          </a>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="font-semibold text-gray-900">Quick Start Guide</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 text-xs font-bold">1</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Create a Claim</p>
              <p className="text-sm text-gray-600">Enter patient information, insurance details, and procedure codes using the CDT selector.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 text-xs font-bold">2</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Upload Supporting Documents</p>
              <p className="text-sm text-gray-600">Add X-rays, clinical notes, or EOBs to strengthen your appeal.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 text-xs font-bold">3</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Generate Appeal Letter</p>
              <p className="text-sm text-gray-600">Click "Generate Appeal Letter" and let AI write a professional medical justification.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 text-xs font-bold">4</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Track Status</p>
              <p className="text-sm text-gray-600">Monitor your appeal from Draft to Won/Lost and receive email updates.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-2">Frequently Asked Questions</h3>
        <div className="space-y-3">
          <div>
            <p className="font-medium text-gray-800">How do I win more appeals?</p>
            <p className="text-sm text-gray-600">Upload all relevant clinical documentation (X-rays, notes, EOBs) before generating the appeal. Our AI uses this evidence to build stronger clinical justifications.</p>
          </div>
          <div>
            <p className="font-medium text-gray-800">How long does an appeal take?</p>
            <p className="text-sm text-gray-600">Insurance companies typically respond within 30-60 days. You can track the status in your Claims dashboard.</p>
          </div>
          <div>
            <p className="font-medium text-gray-800">Can I cancel my subscription?</p>
            <p className="text-sm text-gray-600">Yes, you can cancel anytime from the Billing page. Your subscription remains active until the end of your billing period.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
