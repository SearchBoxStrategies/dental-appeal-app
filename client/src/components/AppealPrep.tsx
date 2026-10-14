import { useEffect, useState } from 'react';
import { ClipboardCheck, Stethoscope, Sparkles, CheckCircle, Pencil } from 'lucide-react';
import api from '../lib/api';

interface ChecklistItem {
  id: string;
  label: string;
  why: string;
}

interface Workflow {
  checklist: ChecklistItem[];
  checklistState: Record<string, boolean>;
  dentistNote: string | null;
  dentistNoteApprovedAt: string | null;
  dentistNoteApprovedBy: string | null;
}

const PLACEHOLDER = /\[[^\]]+\]/g;

// What to enclose with the appeal, and the dentist's clinical note for sign-off.
export default function AppealPrep({ claimId, providerName }: { claimId: number; providerName?: string | null }) {
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [editingNote, setEditingNote] = useState(false);
  const [approverName, setApproverName] = useState(providerName || '');
  const [busy, setBusy] = useState<'' | 'draft' | 'save' | 'approve'>('');
  const [error, setError] = useState('');

  const apply = (data: Workflow) => {
    setWorkflow(data);
    setNoteDraft(data.dentistNote || '');
  };

  useEffect(() => {
    api.get(`/claims/${claimId}/workflow`).then((r) => apply(r.data)).catch(() => setError('Could not load the checklist'));
  }, [claimId]);

  useEffect(() => {
    if (providerName && !approverName) setApproverName(providerName);
  }, [providerName]);

  if (!workflow) {
    return error ? <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">{error}</div> : null;
  }

  const toggle = async (id: string) => {
    const state = { ...workflow.checklistState, [id]: !workflow.checklistState[id] };
    setWorkflow({ ...workflow, checklistState: state });
    try {
      apply((await api.put(`/claims/${claimId}/checklist`, { state })).data);
    } catch {
      setError('Could not save the checklist. Please try again.');
    }
  };

  const draftNote = async () => {
    if (workflow.dentistNote && !confirm('Replace the current note with a new AI draft?')) return;
    setBusy('draft');
    setError('');
    try {
      apply((await api.post(`/claims/${claimId}/dentist-note/draft`)).data);
      setEditingNote(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Could not draft the note. Please try again.');
    } finally {
      setBusy('');
    }
  };

  const saveNote = async (approve: boolean) => {
    setBusy(approve ? 'approve' : 'save');
    setError('');
    try {
      apply((await api.put(`/claims/${claimId}/dentist-note`, {
        note: noteDraft,
        ...(approve ? { approve: true, approverName: approverName.trim() } : {}),
      })).data);
      setEditingNote(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Could not save the note.');
    } finally {
      setBusy('');
    }
  };

  const done = workflow.checklist.filter((i) => workflow.checklistState[i.id]).length;
  const total = workflow.checklist.length;
  const placeholders = noteDraft.match(PLACEHOLDER) || [];
  const approved = !!workflow.dentistNoteApprovedAt;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-gray-900">What to include</h2>
          </div>
          <span className={`text-sm font-medium ${done === total ? 'text-green-600' : 'text-gray-500'}`}>
            {done} of {total} ready
          </span>
        </div>
        <ul className="divide-y">
          {workflow.checklist.map((item) => (
            <li key={item.id}>
              <label className="flex items-start gap-3 px-6 py-3 cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={!!workflow.checklistState[item.id]}
                  onChange={() => toggle(item.id)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>
                  <span className={`block text-sm ${workflow.checklistState[item.id] ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                    {item.label}
                  </span>
                  <span className="block text-xs text-gray-500 mt-0.5">{item.why}</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
        <p className="px-6 py-3 text-xs text-gray-500 border-t bg-gray-50">
          Ticked items are listed as enclosures in the appeal letter.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-gray-900">Dentist's note</h2>
          </div>
          {approved ? (
            <span className="flex items-center gap-1 text-sm text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
              <CheckCircle className="w-4 h-4" /> Approved by {workflow.dentistNoteApprovedBy}
            </span>
          ) : workflow.dentistNote ? (
            <span className="text-sm text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">Waiting for dentist sign-off</span>
          ) : null}
        </div>

        <div className="p-6 flex-1 space-y-4">
          {!workflow.dentistNote && !editingNote && (
            <div className="text-sm text-gray-600 space-y-3">
              <p>
                A short clinical note from the dentist is the strongest evidence in an appeal. The AI drafts it from
                this claim; the dentist fills in the bracketed details and approves it.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={draftNote}
                  disabled={busy !== ''}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  {busy === 'draft' ? 'Drafting… (up to a minute)' : 'Draft note with AI'}
                </button>
                <button
                  onClick={() => setEditingNote(true)}
                  className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2"
                >
                  Write it myself
                </button>
              </div>
            </div>
          )}

          {(editingNote || (workflow.dentistNote && !approved)) && (
            <>
              <textarea
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                rows={9}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm leading-relaxed focus:ring-2 focus:ring-blue-500"
                placeholder="Diagnosis, findings, history, treatment and why it was necessary…"
              />
              {placeholders.length > 0 && (
                <p className="text-xs text-amber-700">
                  Fill in {placeholders.length} bracketed detail{placeholders.length === 1 ? '' : 's'} before approving:{' '}
                  {placeholders.slice(0, 4).join(', ')}{placeholders.length > 4 ? '…' : ''}
                </p>
              )}
              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <label htmlFor="approver" className="block text-xs text-gray-600 mb-1">Dentist approving</label>
                  <input
                    id="approver"
                    value={approverName}
                    onChange={(e) => setApproverName(e.target.value)}
                    placeholder="Dr. Name"
                    className="w-48 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <button
                  onClick={() => saveNote(true)}
                  disabled={busy !== '' || !noteDraft.trim() || placeholders.length > 0 || approverName.trim().length < 2}
                  className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  {busy === 'approve' ? 'Approving…' : 'Approve note'}
                </button>
                <button
                  onClick={() => saveNote(false)}
                  disabled={busy !== '' || !noteDraft.trim()}
                  className="text-sm text-gray-700 border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  {busy === 'save' ? 'Saving…' : 'Save draft'}
                </button>
                {workflow.dentistNote && (
                  <button onClick={draftNote} disabled={busy !== ''} className="text-sm text-blue-600 hover:text-blue-800 px-2 py-2 disabled:opacity-50">
                    {busy === 'draft' ? 'Drafting…' : 'New AI draft'}
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500">Only an approved note is used in the appeal letter. Editing an approved note sends it back for sign-off.</p>
            </>
          )}

          {approved && !editingNote && (
            <>
              <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{workflow.dentistNote}</p>
              <button
                onClick={() => setEditingNote(true)}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <Pencil className="w-4 h-4" /> Edit note
              </button>
            </>
          )}

          {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">{error}</div>}
        </div>
      </div>
    </div>
  );
}
