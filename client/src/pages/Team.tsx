import { useEffect, useState } from 'react';
import { Users, UserPlus, ShieldCheck, Stethoscope, Trash2, Mail } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface Member {
  id: number;
  name: string;
  email: string;
  practice_role: 'owner' | 'staff';
  is_dentist: boolean;
  two_factor_enabled: boolean;
}

interface Invite {
  id: number;
  email: string;
  name: string | null;
  practice_role: 'owner' | 'staff';
  is_dentist: boolean;
  expires_at: string;
}

const roleText = (role: string, dentist: boolean) =>
  `${role === 'owner' ? 'Owner' : 'Staff'}${dentist ? ' · Dentist' : ''}`;

// Team members, invitations, and your own two-step sign-in.
export default function Team() {
  const { user, refreshPractice } = useAuth();
  const isOwner = user?.practice_role === 'owner';
  const [members, setMembers] = useState<Member[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<'staff' | 'owner'>('staff');
  const [inviteDentist, setInviteDentist] = useState(false);
  const [sending, setSending] = useState(false);

  // Two-step sign-in
  const [twoFactorStep, setTwoFactorStep] = useState<'idle' | 'code' | 'disable'>('idle');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorBusy, setTwoFactorBusy] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get('/team');
      setMembers(data.members);
      setInvites(data.invites);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Could not load your team');
    }
  };

  useEffect(() => { load(); }, []);

  const flash = (message: string) => {
    setNotice(message);
    setError('');
    setTimeout(() => setNotice(''), 4000);
  };
  const fail = (err: any, fallback: string) => setError(err.response?.data?.error || fallback);

  const sendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const { data } = await api.post('/team/invites', {
        email: inviteEmail, name: inviteName || undefined, role: inviteRole, isDentist: inviteDentist,
      });
      setInviteEmail(''); setInviteName(''); setInviteRole('staff'); setInviteDentist(false);
      flash(data.emailSent ? `Invitation sent to ${data.email}.` : `Invitation created, but the email could not be sent. Try again later.`);
      load();
    } catch (err) {
      fail(err, 'Could not send the invitation');
    } finally {
      setSending(false);
    }
  };

  const updateMember = async (member: Member, changes: { role?: string; isDentist?: boolean }) => {
    try {
      await api.patch(`/team/members/${member.id}`, changes);
      await load();
      if (member.id === Number(user?.id)) await refreshPractice();
      flash('Saved.');
    } catch (err) {
      fail(err, 'Could not update this team member');
    }
  };

  const removeMember = async (member: Member) => {
    if (!confirm(`Remove ${member.name || member.email}? They will be signed out and lose access right away.`)) return;
    try {
      await api.delete(`/team/members/${member.id}`);
      flash(`${member.name || member.email} was removed.`);
      load();
    } catch (err) {
      fail(err, 'Could not remove this team member');
    }
  };

  const cancelInvite = async (invite: Invite) => {
    try {
      await api.delete(`/team/invites/${invite.id}`);
      load();
    } catch (err) {
      fail(err, 'Could not cancel the invitation');
    }
  };

  const startTwoFactor = async () => {
    setTwoFactorBusy(true);
    try {
      await api.post('/user/2fa/start');
      setTwoFactorStep('code');
      flash(`We emailed a 6-digit code to ${user?.email}.`);
    } catch (err) {
      fail(err, 'Could not send the code');
    } finally {
      setTwoFactorBusy(false);
    }
  };

  const confirmTwoFactor = async () => {
    setTwoFactorBusy(true);
    try {
      await api.post('/user/2fa/confirm', { code: twoFactorCode });
      setTwoFactorStep('idle'); setTwoFactorCode('');
      await refreshPractice();
      flash('Two-step sign-in is on. You will be asked for an emailed code each time you sign in.');
      load();
    } catch (err) {
      fail(err, 'That code did not work');
    } finally {
      setTwoFactorBusy(false);
    }
  };

  const disableTwoFactor = async () => {
    setTwoFactorBusy(true);
    try {
      await api.post('/user/2fa/disable', { password });
      setTwoFactorStep('idle'); setPassword('');
      await refreshPractice();
      flash('Two-step sign-in is off.');
      load();
    } catch (err) {
      fail(err, 'Could not turn it off');
    } finally {
      setTwoFactorBusy(false);
    }
  };

  const me = members.find(m => m.id === Number(user?.id));
  const twoFactorOn = me?.two_factor_enabled ?? (user as any)?.two_factor_enabled;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Team & Security</h1>
        <p className="text-gray-600 mt-1">Give each person their own sign-in. Only dentists can approve clinical notes.</p>
      </div>

      {notice && <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-lg text-sm">{notice}</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">{error}</div>}

      {/* Your sign-in */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className={`w-6 h-6 mt-0.5 ${twoFactorOn ? 'text-green-600' : 'text-gray-400'}`} />
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900">Two-step sign-in</h2>
            <p className="text-sm text-gray-600 mt-1">
              {twoFactorOn
                ? 'On. Each sign-in needs your password and a code emailed to you.'
                : 'Off. Turn it on so a stolen password alone is not enough to see patient claims.'}
            </p>

            {twoFactorStep === 'idle' && (
              <button
                onClick={twoFactorOn ? () => setTwoFactorStep('disable') : startTwoFactor}
                disabled={twoFactorBusy}
                className={`mt-3 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 ${
                  twoFactorOn ? 'border border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {twoFactorOn ? 'Turn off' : twoFactorBusy ? 'Sending code…' : 'Turn on'}
              </button>
            )}

            {twoFactorStep === 'code' && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <input
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  inputMode="numeric"
                  placeholder="6-digit code"
                  aria-label="Code from email"
                  className="w-36 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                />
                <button onClick={confirmTwoFactor} disabled={twoFactorBusy || twoFactorCode.length !== 6}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50">
                  Confirm
                </button>
                <button onClick={startTwoFactor} disabled={twoFactorBusy} className="px-2 py-2 text-sm text-blue-600">Resend code</button>
                <button onClick={() => setTwoFactorStep('idle')} className="px-2 py-2 text-sm text-gray-600">Cancel</button>
              </div>
            )}

            {twoFactorStep === 'disable' && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  aria-label="Your password"
                  className="w-48 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <button onClick={disableTwoFactor} disabled={twoFactorBusy || !password}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded-lg text-sm font-medium disabled:opacity-50">
                  Turn off
                </button>
                <button onClick={() => { setTwoFactorStep('idle'); setPassword(''); }} className="px-2 py-2 text-sm text-gray-600">Cancel</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Members */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold text-gray-900">Team members</h2>
        </div>
        <ul className="divide-y">
          {members.map((m) => (
            <li key={m.id} className="px-6 py-4 flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[12rem]">
                <p className="font-medium text-gray-900">
                  {m.name || m.email} {m.id === Number(user?.id) && <span className="text-xs text-gray-500">(you)</span>}
                </p>
                <p className="text-sm text-gray-500">{m.email}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">{roleText(m.practice_role, m.is_dentist)}</span>
                {m.two_factor_enabled && <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700">Two-step on</span>}
              </div>
              {isOwner && (
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  <select
                    value={m.practice_role}
                    onChange={(e) => updateMember(m, { role: e.target.value })}
                    aria-label={`Role for ${m.name || m.email}`}
                    className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="owner">Owner</option>
                    <option value="staff">Staff</option>
                  </select>
                  <label className="flex items-center gap-1.5 text-sm text-gray-700">
                    <input type="checkbox" checked={m.is_dentist} onChange={(e) => updateMember(m, { isDentist: e.target.checked })} />
                    <Stethoscope className="w-4 h-4" /> Dentist
                  </label>
                  {m.id !== Number(user?.id) && (
                    <button onClick={() => removeMember(m)} className="text-gray-400 hover:text-red-600" aria-label={`Remove ${m.name || m.email}`}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
        {!isOwner && (
          <p className="px-6 py-3 text-xs text-gray-500 border-t bg-gray-50">Only a practice owner can invite people or change roles.</p>
        )}
      </div>

      {/* Invite */}
      {isOwner && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-gray-900">Invite someone</h2>
          </div>
          <form onSubmit={sendInvite} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="email" required value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Email address" aria-label="Email address" className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            <input value={inviteName} onChange={(e) => setInviteName(e.target.value)}
              placeholder="Name (optional)" aria-label="Name" className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value as 'staff' | 'owner')}
              aria-label="Role" className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="staff">Staff: claims, letters, documents</option>
              <option value="owner">Owner: also team and billing</option>
            </select>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={inviteDentist} onChange={(e) => setInviteDentist(e.target.checked)} />
              Dentist (can approve clinical notes)
            </label>
            <div className="sm:col-span-2">
              <button type="submit" disabled={sending}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50">
                {sending ? 'Sending…' : 'Send invitation'}
              </button>
            </div>
          </form>

          {invites.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Waiting to accept</p>
              <ul className="space-y-2">
                {invites.map((inv) => (
                  <li key={inv.id} className="flex flex-wrap items-center gap-3 text-sm bg-slate-50 rounded-lg px-3 py-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="flex-1">{inv.name ? `${inv.name} · ` : ''}{inv.email} · {roleText(inv.practice_role, inv.is_dentist)}</span>
                    <span className="text-xs text-gray-500">expires {new Date(inv.expires_at).toLocaleDateString()}</span>
                    <button onClick={() => cancelInvite(inv)} className="text-xs text-red-600 hover:underline">Cancel</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
