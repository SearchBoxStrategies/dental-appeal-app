import { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import api from '../lib/api';

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalRevenue: 0,
    activePractices: 0,
    totalAppeals: 0,
    successRate: 0
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/admin/analytics');
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Platform performance and metrics</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex items-center justify-between">
            <DollarSign className="w-6 h-6 text-green-500" />
            <span className="text-2xl font-bold">${data.totalRevenue.toLocaleString()}</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Total Revenue</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex items-center justify-between">
            <Users className="w-6 h-6 text-blue-500" />
            <span className="text-2xl font-bold">{data.activePractices}</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Active Practices</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex items-center justify-between">
            <Activity className="w-6 h-6 text-purple-500" />
            <span className="text-2xl font-bold">{data.totalAppeals}</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Total Appeals</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex items-center justify-between">
            <TrendingUp className="w-6 h-6 text-teal-500" />
            <span className="text-2xl font-bold">{data.successRate}%</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Success Rate</p>
        </div>
      </div>
    </div>
  );
}
