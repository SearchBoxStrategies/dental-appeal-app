import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { API_BASE_URL } from './lib/api';
import { rememberReferralFromUrl } from './lib/referral';

// An affiliate link can land on any page: remember the code for 90 days and count the click once.
const referral = rememberReferralFromUrl();
if (referral?.isNewClick) {
  fetch(`${API_BASE_URL}/affiliate/track/${encodeURIComponent(referral.code)}`, { method: 'GET' })
    .catch(() => {});
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);