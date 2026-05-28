import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Building2, UserPlus, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referralCodeFromUrl = searchParams.get('ref');
  
  const [formData, setFormData] = useState({
    practiceName: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: referralCodeFromUrl || ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [affiliateInfo, setAffiliateInfo] = useState<{ code: string; clicks?: number } | null>(null);

  // Fetch affiliate stats if referral code is present
  useEffect(() => {
    if (referralCodeFromUrl) {
      fetchAffiliateStats(referralCodeFromUrl);
    }
  }, [referralCodeFromUrl]);

  // NEW: Track affiliate click when page loads with referral code
  useEffect(() => {
    if (referralCodeFromUrl) {
      // Call tracking endpoint to record the click
      fetch(`https://api.dentalappeal.claims/api/affiliate/track/${referralCodeFromUrl}`, {
        method: 'GET',
      }).catch(err => console.log('Tracking error:', err));
    }
  }, [referralCodeFromUrl]);

  const fetchAffiliateStats = async (code: string) => {
    try {
      const response = await fetch(`https://api.dentalappeal.claims/api/affiliate/stats/${code}`);
      if (response.ok) {
        const data = await response.json();
        setAffiliateInfo({
          code: data.affiliate_code,
          clicks: data.total_clicks
        });
      }
    } catch (error) {
      console.log('Affiliate stats not available');
    }
  };

  // ... rest of your component code remains the same ...
