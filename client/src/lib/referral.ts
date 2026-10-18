// Remembers an affiliate's referral code in this browser for 90 days, so a dentist who clicks a
// link, leaves, and comes back later (typing the address, a bookmark, a search) is still credited
// to that affiliate when they sign up. The latest link clicked wins.

const KEY = 'dentalappeal_ref';
const DAYS = 90;
const CODE = /^[A-Za-z0-9_-]{3,80}$/;

interface Stored {
  code: string;
  at: number; // when the link was clicked (ms)
}

function read(): Stored | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Stored;
    if (!v || typeof v.code !== 'string' || !CODE.test(v.code) || typeof v.at !== 'number') return null;
    return v;
  } catch {
    return null; // storage blocked (private mode, cookies off): fall back to the link only
  }
}

// Saves ?ref= from the current address. Returns the code, and whether this is a new click (not a
// reload of the same link within the last hour) so the click is only counted once.
export function rememberReferralFromUrl(search: string = window.location.search): { code: string; isNewClick: boolean } | null {
  const params = new URLSearchParams(search);
  const code = params.get('ref')?.trim();
  if (!code || !CODE.test(code)) return null;
  const prev = read();
  const isNewClick = !(prev && prev.code === code && Date.now() - prev.at < 60 * 60 * 1000);
  try {
    if (isNewClick) window.localStorage.setItem(KEY, JSON.stringify({ code, at: Date.now() }));
  } catch {
    // ignore: storage blocked
  }
  // Arriving through the API's /affiliate/track link: that click was already counted there.
  return { code, isNewClick: isNewClick && params.get('counted') !== '1' };
}

// The remembered code, if the link was clicked in the last 90 days.
export function getRememberedReferral(): string | null {
  const v = read();
  if (!v) return null;
  if (Date.now() - v.at > DAYS * 24 * 60 * 60 * 1000) {
    forgetReferral();
    return null;
  }
  return v.code;
}

// After a successful sign-up the code has done its job.
export function forgetReferral() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
