import { Mail, BookOpen, FileText, TrendingUp, CheckCircle } from 'lucide-react';

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
            View Docs <ExternalLink className="w-4 h-4" />
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
            support@dentalappeal.claims <Mail className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-2">Quick Tips</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Upload supporting documents (X-rays, EOBs) to strengthen your appeal</li>
          <li>• Track your appeal status from the Claims page</li>
          <li>• Generate AI-powered appeal letters with one click</li>
          <li>• Review your success rate in the Analytics section</li>
        </ul>
      </div>
    </div>
  );
}
