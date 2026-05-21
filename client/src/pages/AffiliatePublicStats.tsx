import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  MousePointerClick, 
  DollarSign, 
  Award, 
  Calendar,
  Share2,
  Copy,
  CheckCircle,
  BarChart3,
  Rocket
} from 'lucide-react';

interface StatsData {
  code: string;
  name: string;
  memberSince: string;
  clicks: number;
  signups: number;
  conversions: number;
  commissionRate: number;
  tier: string;
  estimatedEarnings: number;
  joinLink: string;
}

export default function AffiliatePublicStats() {
  const { code } = useParams<{ code: string }>();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    fetchStats();
  }, [code]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.dentalappeal.claims/api/affiliate/public-stats/${code}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load stats');
      }
      
      setStats(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: 'code' | 'link') => {
    await navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const shareOnTwitter = () => {
    const text = `I've helped ${stats?.signups} practices save time on insurance appeals with @DentalAppeal! Join me and start saving:`;
    const url = stats?.joinLink;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url!)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = stats?.joinLink;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url!)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading affiliate stats...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Affiliate Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || "This affiliate code doesn't exist or hasn't been activated yet."}
          </p>
          <Link
            to="/affiliate/signup"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Become an Affiliate →
          </Link>
        </div>
      </div>
    );
  }

  const conversionRate = stats.clicks > 0 ? ((stats.signups / stats.clicks) * 100).toFixed(1) : 0;
  const signupToConversionRate = stats.signups > 0 ? ((stats.conversions / stats.signups) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1 mb-4">
              <Award className="w-4 h-4" />
              <span className="text-sm font-medium">Verified Affiliate</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {stats.name}
            </h1>
            <p className="text-xl text-blue-100 mb-2">
              Helped {stats.signups} practices save time on insurance appeals
            </p>
            <p className="text-blue-200">
              Member since {stats.memberSince} • {stats.tier.charAt(0).toUpperCase() + stats.tier.slice(1)} Tier
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <MousePointerClick className="w-8 h-8 text-blue-500" />
              <span className="text-xs text-gray-400">Total</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.clicks.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">Referral Clicks</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-green-500" />
              <span className="text-xs text-gray-400">Total</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.signups.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">Practice Signups</p>
            <p className="text-xs text-green-600 mt-1">↑ {conversionRate}% click-to-signup</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-8 h-8 text-purple-500" />
              <span className="text-xs text-gray-400">Total</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.conversions.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">Paid Conversions</p>
            <p className="text-xs text-purple-600 mt-1">↑ {signupToConversionRate}% signup-to-conversion</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-6 border border-green-100">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-green-600" />
              <span className="text-xs text-green-600 font-medium">Est. Earnings</span>
            </div>
            <p className="text-3xl font-bold text-green-700">${stats.estimatedEarnings.toLocaleString()}</p>
            <p className="text-sm text-green-600 mt-1">@{stats.commissionRate}% commission</p>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Performance Funnel
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Clicks → Signups</span>
                <span className="font-medium">{conversionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(parseFloat(conversionRate as string), 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Signups → Conversions</span>
                <span className="font-medium">{signupToConversionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(parseFloat(signupToConversionRate as string), 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-xl p-8 text-white mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Rocket className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Ready to start saving?</h3>
                <p className="text-gray-300">Join {stats.signups} practices already saving time on insurance appeals</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => copyToClipboard(stats.joinLink, 'link')}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 rounded-lg font-semibold hover:bg-white/20 transition"
              >
                {copiedLink ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedLink ? 'Copied!' : 'Copy Link'}
              </button>
              <a
                href={stats.joinLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition text-center justify-center"
              >
                Try DentalAppeal Free →
              </a>
            </div>
          </div>
        </div>

        {/* Share Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Share This Success</h2>
          <p className="text-gray-600 mb-6">Help other practices discover DentalAppeal</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => copyToClipboard(stats.code, 'code')}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              {copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : `Copy Code: ${stats.code}`}
            </button>
            <button
              onClick={shareOnTwitter}
              className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Twitter
            </button>
            <button
              onClick={shareOnLinkedIn}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/>
              </svg>
              LinkedIn
            </button>
          </div>
        </div>

        {/* Badge/Embed Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500 mb-3">Want to embed this stats badge on your website?</p>
          <code className="text-xs bg-gray-100 px-3 py-2 rounded break-all">
            &lt;iframe src="https://app.dentalappeal.claims/affiliate/badge/{stats.code}" width="300" height="200" frameborder="0"&gt;&lt;/iframe&gt;
          </code>
        </div>
      </div>
    </div>
  );
}
