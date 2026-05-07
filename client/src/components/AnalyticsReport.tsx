import { useState, useEffect } from 'react';
import { TrendingUp, FileText, Award, DollarSign, Download } from 'lucide-react';
import api from '../lib/api';

interface ReportData {
  period: string;
  totalClaims: number;
  totalAppeals: number;
  wonAppeals: number;
  lostAppeals: number;
  pendingAppeals: number;
  successRate: number;
  amountRecovered: number;
  timeSaved: number;
  avgResponseDays: number;
  topPayer: string;
  topPayerSuccessRate: number;
}

interface ChartData {
  month: string;
  claims: number;
  won: number;
}

export default function AnalyticsReport() {
  const [report, setReport] = useState<ReportData | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    fetchReport();
    fetchChartData();
  }, [period]);

  const fetchReport = async () => {
    try {
      const response = await api.get(`/analytics/report?period=${period}`);
      setReport(response.data);
    } catch (error) {
      console.error('Failed to fetch report:', error);
    }
  };

  const fetchChartData = async () => {
    try {
      const response = await api.get('/analytics/chart');
      setChartData(response.data);
    } catch (error) {
      console.error('Failed to fetch chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async () => {
    try {
      const response = await api.get(`/analytics/report/export?period=${period}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `appeal_report_${period}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download report:', error);
    }
  };

  const getMaxValue = () => {
    if (!chartData.length) return 100;
    return Math.max(...chartData.flatMap(d => [d.claims, d.won])) + 10;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Performance Report</h2>
          <p className="text-gray-500 text-sm">Track your appeal success and revenue recovery</p>
        </div>
        <div className="flex gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last 90 Days</option>
            <option value="year">Last 12 Months</option>
          </select>
          <button
            onClick={downloadReport}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Claims</p>
              <p className="text-2xl font-bold text-gray-900">{report.totalClaims}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Success Rate</p>
              <p className="text-2xl font-bold text-green-600">{report.successRate}%</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Appeals Won</p>
              <p className="text-2xl font-bold text-gray-900">{report.wonAppeals}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Est. Recovered</p>
              <p className="text-2xl font-bold text-green-600">${report.amountRecovered.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-xs text-gray-500">Avg Response Time</p>
          <p className="text-xl font-bold text-gray-900">{report.avgResponseDays}</p>
          <p className="text-xs text-gray-400">days</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-xs text-gray-500">Top Payer</p>
          <p className="text-xl font-bold text-gray-900">{report.topPayer}</p>
          <p className="text-xs text-gray-400">{report.topPayerSuccessRate}% success</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-xs text-gray-500">Time Saved</p>
          <p className="text-xl font-bold text-gray-900">{report.timeSaved}</p>
          <p className="text-xs text-gray-400">hours</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-900">Detailed Breakdown</h3>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Total Appeals Filed</span>
              <span className="font-medium">{report.totalAppeals}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Appeals Won</span>
              <span className="font-medium text-green-600">{report.wonAppeals}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Appeals Lost</span>
              <span className="font-medium text-red-600">{report.lostAppeals}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Pending Review</span>
              <span className="font-medium text-yellow-600">{report.pendingAppeals}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Time Saved (est.)</span>
              <span className="font-medium">{report.timeSaved} hours</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">ROI on Subscription</span>
              <span className="font-medium text-green-600">{((report.amountRecovered || 0) / 199).toFixed(1)}x</span>
            </div>
          </div>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Monthly Performance</h3>
          <div className="space-y-3">
            {chartData.slice(0, 6).map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{new Date(item.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                  <span className="text-gray-600">{item.claims} claims · {item.won} won</span>
                </div>
                <div className="flex gap-1">
                  <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${(item.claims / getMaxValue()) * 100}%` }}></div>
                  <div className="h-2 bg-green-500 rounded-full" style={{ width: `${(item.won / getMaxValue()) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Insight</h3>
        <p className="text-blue-800 text-sm">
          Based on your success rate of {report.successRate}%, you're recovering significantly more than manual appeals ({Math.max(40, report.successRate - 15)}% vs {report.successRate}%).
          Continue submitting appeals within 14 days of denial for best results.
        </p>
      </div>
    </div>
  );
}
