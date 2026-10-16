import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

// Joining a practice from an invitation link: choose your name and password, then you're signed in.
export default function AcceptInvite() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const navigate = useNavigate();
  const { login } = useAuth();
  const [invite, setInvite] = useState<{ email: string; name: string | null; practiceName: string; roleLabel: string } | null>(null);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('This invitation link is incomplete. Open the link from your email again.');
      return;
    }
    api.get(`/team/invites/accept/${token}`)
      .then(({ data }) => { setInvite(data); setName(data.name || ''); })
      .catch((err) => setError(err.response?.data?.error || 'This invitation is invalid or has expired.'));
  }, [token]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('The two passwords do not match.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await api.post(`/team/invites/accept/${token}`, { name, password });
      await login(invite!.email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Could not create your account. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border p-8">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Join your team on DentalAppeal</h1>
        {invite ? (
          <>
            <p className="text-sm text-gray-600 mb-6">
              You're joining <strong>{invite.practiceName}</strong> as <strong>{invite.roleLabel}</strong>.
            </p>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input value={invite.email} disabled className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600" />
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your name</label>
                <input id="name" required minLength={2} value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Jordan Lee" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <p className="text-xs text-gray-500 mt-1">Dentists: this is the name that signs appeal letters.</p>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Choose a password</label>
                <input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <p className="text-xs text-gray-500 mt-1">At least 8 characters.</p>
              </div>
              <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
                <input id="confirm" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              {error && <p className="text-sm text-red-700">{error}</p>}
              <button type="submit" disabled={saving}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50">
                {saving ? 'Creating your account…' : 'Create my account'}
              </button>
            </form>
          </>
        ) : (
          <div className="mt-4">
            {error ? <p className="text-sm text-red-700 mb-4">{error}</p> : <p className="text-sm text-gray-600">Checking your invitation…</p>}
            {error && <Link to="/login" className="text-sm text-blue-600 hover:underline">Go to sign in</Link>}
          </div>
        )}
      </div>
    </div>
  );
}
