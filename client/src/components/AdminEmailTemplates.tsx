import { useState, useEffect } from 'react';
import { Mail, Edit, Save, X, Send, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../lib/api';

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  description: string;
  is_active: boolean;
  updated_at: string;
}

export default function AdminEmailTemplates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ subject: '', body: '', is_active: true });
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [testEmail, setTestEmail] = useState('');
  const [testingId, setTestingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await api.get('/admin/email-templates');
      setTemplates(response.data);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      showMessage('error', 'Failed to load email templates');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const startEdit = (template: EmailTemplate) => {
    setEditingId(template.id);
    setEditForm({
      subject: template.subject,
      body: template.body,
      is_active: template.is_active
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ subject: '', body: '', is_active: true });
  };

  const saveTemplate = async (id: number) => {
    setSaving(true);
    try {
      await api.put(`/admin/email-templates/${id}`, editForm);
      showMessage('success', 'Template updated successfully');
      fetchTemplates();
      setEditingId(null);
    } catch (error) {
      console.error('Failed to save template:', error);
      showMessage('error', 'Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  const sendTestEmail = async (id: number) => {
    if (!testEmail) {
      showMessage('error', 'Please enter a test email address');
      return;
    }
    
    setTestingId(id);
    try {
      await api.post(`/admin/email-templates/${id}/test`, { test_email: testEmail });
      showMessage('success', `Test email sent to ${testEmail}`);
      setTestEmail('');
    } catch (error) {
      console.error('Failed to send test email:', error);
      showMessage('error', 'Failed to send test email');
    } finally {
      setTestingId(null);
    }
  };

  const getTemplateName = (name: string) => {
    const names: Record<string, string> = {
      verification: 'Verification Email',
      reset_password: 'Password Reset',
      weekly_digest: 'Weekly Digest',
      appeal_status: 'Appeal Status Update',
      payment_receipt: 'Payment Receipt'
    };
    return names[name] || name;
  };

  const renderVariables = (variables: string[]) => {
  if (!variables || variables.length === 0) {
    return null;
  }
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-sm font-medium text-gray-700 mb-1">Available Variables:</p>
      <div className="flex flex-wrap gap-2">
        {variables.map((v) => (
          <code key={v} className="px-2 py-0.5 bg-gray-200 rounded text-xs">
            {`{{${v}}}`}
          </code>
        ))}
      </div>
    </div>
  );
};

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
        <p className="text-gray-600 mt-1">Customize system email templates</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="grid gap-4">
        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <h2 className="font-semibold text-gray-900">{getTemplateName(template.name)}</h2>
                  <p className="text-sm text-gray-500">{template.description}</p>
                </div>
                {template.is_active ? (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">Active</span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500">Inactive</span>
                )}
              </div>
              <div className="flex gap-2">
                {editingId === template.id ? (
                  <>
                    <button
                      onClick={() => saveTemplate(template.id)}
                      disabled={saving}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(template)}
                      className="flex items-center gap-1 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => setExpandedId(expandedId === template.id ? null : template.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      {expandedId === template.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      {expandedId === template.id ? 'Hide' : 'Preview'}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Edit Form */}
            {editingId === template.id && (
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={editForm.subject}
                    onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Body (HTML)</label>
                  <textarea
                    value={editForm.body}
                    onChange={(e) => setEditForm({ ...editForm, body: e.target.value })}
                    rows={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editForm.is_active}
                      onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Active (send this email)</span>
                  </label>
                </div>
                {renderVariables(template.variables)}
              </div>
            )}

            {/* Preview */}
            {expandedId === template.id && editingId !== template.id && (
              <div className="p-6 border-t bg-gray-50">
                <div className="bg-white rounded-lg border p-4 max-h-96 overflow-y-auto">
                  <div dangerouslySetInnerHTML={{ __html: template.body }} />
                </div>
              </div>
            )}

            {/* Test Email Section */}
            {editingId !== template.id && (
              <div className="px-6 py-4 border-t bg-gray-50 flex items-center gap-3 flex-wrap">
                <input
                  type="email"
                  placeholder="Enter test email address"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <button
                  onClick={() => sendTestEmail(template.id)}
                  disabled={testingId === template.id}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {testingId === template.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Send Test
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
