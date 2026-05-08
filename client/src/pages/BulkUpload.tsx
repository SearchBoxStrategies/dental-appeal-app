import { useState, useRef } from 'react';
import { Upload, FileSpreadsheet } from 'lucide-react';
import api from '../lib/api';

export default function BulkUpload() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ successful: number; failed: number; total: number } | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    setUploading(true);
    setResult(null);
    setError('');
    
    try {
      const response = await api.post('/bulk/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const downloadTemplate = () => {
    const headers = [
      'patient_name', 'patient_dob', 'insurance_company', 'policy_number',
      'claim_number', 'procedure_codes', 'denial_reason', 'service_date',
      'amount_claimed', 'amount_denied'
    ];
    
    const exampleRow = [
      'John Smith', '1980-01-15', 'Delta Dental', 'POL123456',
      'CLM789012', 'D2740,D2750', 'Procedure not medically necessary',
      '2024-01-15', '1250.00', '1250.00'
    ];
    
    const csvContent = [headers.join(','), exampleRow.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'claim_upload_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bulk Claim Upload</h1>
        <p className="text-gray-600 mt-1">Upload multiple claims at once using CSV format</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Upload CSV File</h2>
            <p className="text-gray-500 text-sm mt-1">Upload a CSV file with your claims data</p>
          </div>
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Download Template
          </button>
        </div>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleUpload}
            className="hidden"
          />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Drag and drop your CSV file here, or click to browse</p>
          <p className="text-gray-400 text-sm">Supports up to 10,000 claims per file</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Select File'}
          </button>
        </div>
        
        {result && (
          <div className="mt-4 p-4 rounded-lg border">
            <h3 className="font-medium mb-2">Upload Complete</h3>
            <div className="space-y-1 text-sm">
              <p className="text-green-600">✓ Successful: {result.successful}</p>
              <p className="text-red-600">✗ Failed: {result.failed}</p>
              <p className="text-gray-600">Total processed: {result.total}</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
