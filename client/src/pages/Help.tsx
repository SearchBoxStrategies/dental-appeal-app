import { useState, useRef } from 'react';
import { 
  BookOpen, FileText, TrendingUp, Upload, 
  Building2, CreditCard, Bell, ChevronDown, 
  ChevronUp, CheckCircle, Video, 
  FileQuestion, MessageCircle
} from 'lucide-react';

export default function Help() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const tutorials = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: BookOpen,
      steps: [
        '1. Complete your Practice Profile with your business information',
        '2. Add your NPI number and license information',
        '3. Subscribe to the Professional plan ($199/month)',
        '4. Start creating claims and generating appeal letters'
      ]
    },
    {
      id: 'claims',
      title: 'Creating a Claim',
      icon: FileText,
      steps: [
        '1. Click "New Claim" from the sidebar menu',
        '2. Enter patient information (name, DOB, insurance)',
        '3. Select procedure codes from the CDT selector',
        '4. Paste the denial reason from the insurance EOB',
        '5. Upload supporting documents (X-rays, clinical notes)',
        '6. Click "Submit Claim"'
      ]
    },
    {
      id: 'cdt-codes',
      title: 'CDT Code Selector',
      icon: FileText,
      steps: [
        '1. Click on a category (e.g., "Restorative") to expand',
        '2. Check the boxes next to the procedure codes you need',
        '3. Use "Other" to add custom codes not in the list',
        '4. Selected codes appear at the bottom of the selector'
      ]
    },
    {
      id: 'appeal-letter',
      title: 'Generating an Appeal Letter',
      icon: TrendingUp,
      steps: [
        '1. Go to an existing claim from the Claims list',
        '2. Click "Validate" to check for issues',
        '3. Fix any errors or warnings shown',
        '4. Click "Generate Appeal Letter"',
        '5. Wait 3-5 seconds for the AI to write the letter',
        '6. Review, copy, download, or print the letter'
      ]
    },
    {
      id: 'status-tracking',
      title: 'Tracking Appeal Status',
      icon: TrendingUp,
      steps: [
        '1. Go to the Claims list page',
        '2. View status badges (Draft, Appeal Sent, Under Review, Won, Lost, Paid)',
        '3. Click on a claim to see details',
        '4. Update status from the dropdown on the claim detail page',
        '5. Status changes trigger email notifications'
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics & Reports',
      icon: TrendingUp,
      steps: [
        '1. Go to Analytics from the sidebar',
        '2. View performance metrics (success rate, appeals won, etc.)',
        '3. Change date range using the period selector',
        '4. Click "Export CSV" to download your data'
      ]
    },
    {
      id: 'bulk-upload',
      title: 'Bulk Claim Upload',
      icon: Upload,
      steps: [
        '1. Go to Bulk Upload from the sidebar',
        '2. Download the CSV template',
        '3. Fill in your claims data following the template format',
        '4. Upload the CSV file',
        '5. Review the results (successful/failed counts)'
      ]
    },
    {
      id: 'practice-profile',
      title: 'Practice Profile',
      icon: Building2,
      steps: [
        '1. Go to Practice Profile from the sidebar',
        '2. Fill in your practice information (name, address, phone, etc.)',
        '3. Add your NPI number and license information',
        '4. Click "Save Profile"',
        '5. Your information will appear in all generated appeal letters'
      ]
    },
    {
      id: 'billing',
      title: 'Billing & Subscription',
      icon: CreditCard,
      steps: [
        '1. Go to Billing from the sidebar',
        '2. View your current plan status',
        '3. Click "Subscribe Now" to start your subscription',
        '4. Use the test card 4242 4242 4242 4242 for testing',
        '5. Click "Manage Subscription" to update payment method or cancel'
      ]
    },
    {
      id: 'notifications',
      title: 'Email Notifications',
      icon: Bell,
      steps: [
        '1. Go to Notifications from the sidebar',
        '2. Toggle which emails you want to receive',
        '3. Options include: Appeal Status Updates, Payment Receipts, Weekly Digest',
        '4. Click "Save Preferences"'
      ]
    }
  ];

  const faqs = [
    { q: 'How long does it take to generate an appeal letter?', a: 'Typically 3-5 seconds using Claude AI.' },
    { q: 'What file types can I upload?', a: 'PDF, JPG, JPEG, PNG files up to 10MB.' },
    { q: 'Do you guarantee appeal success?', a: 'No. Success depends on clinical justification and insurance policies.' },
    { q: 'Is my data HIPAA compliant?', a: 'Yes. DentalAppeal is fully HIPAA-compliant with encryption and Business Associate Agreements.' },
    { q: 'Can I cancel my subscription anytime?', a: 'Yes. Cancel anytime from the Billing page.' },
    { q: 'How do I get support?', a: 'Email support@dentalappeal.claims for assistance.' }
  ];

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const scrollToSection = (id: string) => {
    setExpandedSection(id);
    setTimeout(() => {
      const element = sectionRefs.current[id];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-gray-600 mt-1">Tutorials, guides, and frequently asked questions</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => scrollToSection('getting-started')}
          className="bg-white rounded-xl shadow-sm border p-4 text-center hover:shadow-md transition-all cursor-pointer"
        >
          <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <span className="text-sm font-medium">Getting Started</span>
        </button>
        <button
          onClick={() => scrollToSection('claims')}
          className="bg-white rounded-xl shadow-sm border p-4 text-center hover:shadow-md transition-all cursor-pointer"
        >
          <FileText className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <span className="text-sm font-medium">Claims</span>
        </button>
        <button
          onClick={() => scrollToSection('analytics')}
          className="bg-white rounded-xl shadow-sm border p-4 text-center hover:shadow-md transition-all cursor-pointer"
        >
          <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <span className="text-sm font-medium">Analytics</span>
        </button>
        <button
          onClick={() => scrollToSection('billing')}
          className="bg-white rounded-xl shadow-sm border p-4 text-center hover:shadow-md transition-all cursor-pointer"
        >
          <CreditCard className="w-6 h-6 text-teal-600 mx-auto mb-2" />
          <span className="text-sm font-medium">Billing</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Video className="w-5 h-5 text-blue-600" />
            Tutorials & Guides
          </h2>
        </div>
        <div className="divide-y">
          {tutorials.map((tutorial) => {
            const Icon = tutorial.icon;
            const isExpanded = expandedSection === tutorial.id;
            return (
              <div 
                key={tutorial.id} 
                id={tutorial.id}
                ref={(el) => sectionRefs.current[tutorial.id] = el}
              >
                <button
                  onClick={() => toggleSection(tutorial.id)}
                  className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-500" />
                    <span className="font-medium text-gray-900">{tutorial.title}</span>
                  </div>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4 pl-12">
                    <ul className="space-y-2 text-sm text-gray-600">
                      {tutorial.steps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

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
