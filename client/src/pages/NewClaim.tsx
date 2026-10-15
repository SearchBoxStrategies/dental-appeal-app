import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUp, Sparkles, AlertTriangle, CheckCircle } from 'lucide-react';
import CDTSelector from '../components/CDTSelector';
import api from '../lib/api';

interface Extracted {
  patientName: string | null;
  patientDob: string | null;
  insuranceCompany: string | null;
  insuranceCompanyId: number | null;
  policyNumber: string | null;
  claimNumber: string | null;
  serviceDate: string | null;
  denialDate: string | null;
  procedureCodes: string[];
  amountClaimed: number | null;
  amountDenied: number | null;
  denialReason: string | null;
  appealsAddress: string | null;
  uncertainFields: string[];
}

interface InsuranceCompany {
  id: number;
  name: string;
  code: string;
}

export default function NewClaim() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [insuranceCompanies, setInsuranceCompanies] = useState<InsuranceCompany[]>([]);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherInsuranceName, setOtherInsuranceName] = useState('');
  const [eobFile, setEobFile] = useState<File | null>(null);
  const [reading, setReading] = useState(false);
  const [readError, setReadError] = useState('');
  const [prefilled, setPrefilled] = useState(false);
  const [uncertain, setUncertain] = useState<string[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    patientName: '',
    patientDob: '',
    insuranceCompany: '',
    insuranceCompanyId: null as number | null,
    serviceDate: '',
    policyNumber: '',
    claimNumber: '',
    amountClaimed: '',
    amountDenied: '',
    procedureCodes: [] as string[],
    denialReason: '',
    denialDate: '',
    insurerAppealsAddress: '',
  });

  // Upload the insurer's denial (EOB); the AI reads it and fills in the form for review.
  const readDenialNotice = async (file: File) => {
    setEobFile(file);
    setReading(true);
    setReadError('');
    setPrefilled(false);
    try {
      const body = new FormData();
      body.append('file', file);
      const { data } = await api.post<Extracted>('/claims/extract', body, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 180000,
      });
      const listed = data.insuranceCompanyId != null;
      if (data.insuranceCompany && !listed) {
        setShowOtherInput(true);
        setOtherInsuranceName(data.insuranceCompany);
      } else if (listed) {
        setShowOtherInput(false);
        setOtherInsuranceName('');
      }
      setFormData(prev => ({
        ...prev,
        patientName: data.patientName ?? prev.patientName,
        patientDob: data.patientDob ?? prev.patientDob,
        insuranceCompany: listed ? (data.insuranceCompany as string) : prev.insuranceCompany,
        insuranceCompanyId: listed ? data.insuranceCompanyId : prev.insuranceCompanyId,
        serviceDate: data.serviceDate ?? prev.serviceDate,
        policyNumber: data.policyNumber ?? prev.policyNumber,
        claimNumber: data.claimNumber ?? prev.claimNumber,
        amountClaimed: data.amountClaimed != null ? String(data.amountClaimed) : prev.amountClaimed,
        amountDenied: data.amountDenied != null ? String(data.amountDenied) : prev.amountDenied,
        procedureCodes: data.procedureCodes.length ? data.procedureCodes : prev.procedureCodes,
        denialReason: data.denialReason ?? prev.denialReason,
        denialDate: data.denialDate ?? prev.denialDate,
        insurerAppealsAddress: data.appealsAddress ?? prev.insurerAppealsAddress,
      }));
      // Flag fields the AI was unsure of, plus required fields it could not find.
      const missing = (['patientName', 'patientDob', 'serviceDate', 'denialReason'] as const).filter(f => !data[f]);
      if (!data.procedureCodes.length) missing.push('procedureCodes' as any);
      setUncertain([...new Set([...data.uncertainFields, ...missing])]);
      setPrefilled(true);
    } catch (err: any) {
      setEobFile(null);
      setReadError(err.response?.data?.error || 'Could not read the document. Please enter the claim by hand.');
    } finally {
      setReading(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  const fieldClass = (name: string) =>
    `mt-1 block w-full border rounded-md shadow-sm p-2 ${
      prefilled && uncertain.includes(name) ? 'border-amber-400 bg-amber-50' : 'border-gray-300'
    }`;
  const checkHint = (name: string) =>
    prefilled && uncertain.includes(name) ? <p className="text-xs text-amber-700 mt-1">Please check this field</p> : null;

  useEffect(() => {
    fetchInsuranceCompanies();
  }, []);

  const fetchInsuranceCompanies = async () => {
    try {
      const response = await api.get('/insurance');
      setInsuranceCompanies(response.data);
    } catch (error) {
      console.error('Failed to fetch insurance companies:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const amountClaimed = formData.amountClaimed ? parseFloat(formData.amountClaimed) : null;
      const amountDenied = formData.amountDenied ? parseFloat(formData.amountDenied) : null;

      // Use "Other" value if selected
      let insuranceCompanyName = formData.insuranceCompany;
      if (showOtherInput && otherInsuranceName.trim()) {
        insuranceCompanyName = otherInsuranceName.trim();
      }

      const response = await api.post('/claims', {
        patientName: formData.patientName.trim(),
        patientDob: formData.patientDob,
        insuranceCompany: insuranceCompanyName,
        insuranceCompanyId: formData.insuranceCompanyId,
        serviceDate: formData.serviceDate,
        policyNumber: formData.policyNumber?.trim() || null,
        claimNumber: formData.claimNumber?.trim() || null,
        amountClaimed: isNaN(amountClaimed as number) ? null : amountClaimed,
        amountDenied: isNaN(amountDenied as number) ? null : amountDenied,
        procedureCodes: formData.procedureCodes,
        denialReason: formData.denialReason.trim(),
        denialDate: formData.denialDate || null,
        insurerAppealsAddress: formData.insurerAppealsAddress.trim() || null,
      });

      if (response.status >= 200 && response.status < 300) {
        // Keep the uploaded denial with the claim; it is the first item on the checklist.
        if (eobFile && response.data?.id) {
          const doc = new FormData();
          doc.append('file', eobFile);
          await api.post(`/documents/claims/${response.data.id}/documents`, doc, {
            headers: { 'Content-Type': 'multipart/form-data' },
          }).catch(err => console.error('Could not attach the denial notice:', err));
        }
        navigate(response.data?.id ? `/claims/${response.data.id}` : '/claims');
      } else {
        setError(response.data?.error || 'Failed to create claim');
      }
    } catch (err: any) {
      console.error('Claim submission error:', err);
      if (err.response?.data?.error) {
        const errorData = err.response.data.error;
        if (typeof errorData === 'string') {
          setError(errorData);
        } else if (Array.isArray(errorData)) {
          setError(errorData.map((e: any) => e.message).join(', '));
        } else {
          setError('Please check your form for errors');
        }
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'insuranceCompany') {
      if (value === 'other') {
        setShowOtherInput(true);
        setFormData(prev => ({ ...prev, insuranceCompany: '', insuranceCompanyId: null }));
      } else {
        setShowOtherInput(false);
        setOtherInsuranceName('');
        const selected = insuranceCompanies.find((ic: InsuranceCompany) => ic.name === value);
        setFormData(prev => ({
          ...prev,
          insuranceCompany: value,
          insuranceCompanyId: selected?.id || null
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">New Dental Claim</h1>

      {error && (
        <div className="bg-red-50 border border-red-500 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/50 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Have the denial notice? Let the AI fill this in.</p>
            <p className="text-sm text-gray-600">Upload the insurer's EOB or denial letter (PDF or a phone photo). You review everything before saving.</p>
          </div>
          <label className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer shrink-0 ${
            reading ? 'bg-gray-300 text-gray-600 pointer-events-none' : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}>
            {reading ? (
              <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>Reading…</>
            ) : (
              <><FileUp className="w-4 h-4" />Upload denial</>
            )}
            <input
              ref={fileInput}
              type="file"
              accept="application/pdf,image/jpeg,image/png,image/webp"
              className="hidden"
              disabled={reading}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) readDenialNotice(f); }}
            />
          </label>
        </div>
        {reading && <p className="text-sm text-gray-600 mt-3">Reading the document. This can take up to a minute.</p>}
        {readError && <p className="text-sm text-red-700 mt-3">{readError}</p>}
        {prefilled && (
          <div className="mt-3 text-sm flex items-start gap-2">
            {uncertain.length ? (
              <><AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <span className="text-amber-800">Form filled from <strong>{eobFile?.name}</strong>. Check the highlighted fields, then submit.</span></>
            ) : (
              <><CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                <span className="text-green-800">Form filled from <strong>{eobFile?.name}</strong>. Review it, then submit. The file will be attached to the claim.</span></>
            )}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Patient Name *</label>
            <input
              type="text"
              name="patientName"
              required
              value={formData.patientName}
              onChange={handleChange}
              className={fieldClass('patientName')}
            />
            {checkHint('patientName')}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth *</label>
            <input
              type="date"
              name="patientDob"
              required
              value={formData.patientDob}
              onChange={handleChange}
              className={fieldClass('patientDob')}
            />
            {checkHint('patientDob')}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Insurance Company *</label>
            <select
              name="insuranceCompany"
              required
              value={showOtherInput ? 'other' : formData.insuranceCompany}
              onChange={handleChange}
              className={fieldClass('insuranceCompany')}
            >
              <option value="">Select Insurance Company</option>
              {insuranceCompanies.map((ic: InsuranceCompany) => (
                <option key={ic.id} value={ic.name}>
                  {ic.name}
                </option>
              ))}
              <option value="other">Other (Not Listed)</option>
            </select>
            
            {showOtherInput && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Enter insurance company name"
                  value={otherInsuranceName}
                  onChange={(e) => setOtherInsuranceName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                  required={showOtherInput}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Service *</label>
            <input
              type="date"
              name="serviceDate"
              required
              value={formData.serviceDate}
              onChange={handleChange}
              className={fieldClass('serviceDate')}
            />
            {checkHint('serviceDate')}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Policy Number</label>
            <input
              type="text"
              name="policyNumber"
              value={formData.policyNumber}
              onChange={handleChange}
              className={fieldClass('policyNumber')}
            />
            {checkHint('policyNumber')}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Claim Number</label>
            <input
              type="text"
              name="claimNumber"
              value={formData.claimNumber}
              onChange={handleChange}
              className={fieldClass('claimNumber')}
            />
            {checkHint('claimNumber')}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Amount Claimed ($)</label>
            <input
              type="number"
              step="0.01"
              name="amountClaimed"
              value={formData.amountClaimed}
              onChange={handleChange}
              className={fieldClass('amountClaimed')}
            />
            {checkHint('amountClaimed')}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Amount Denied ($)</label>
            <input
              type="number"
              step="0.01"
              name="amountDenied"
              value={formData.amountDenied}
              onChange={handleChange}
              className={fieldClass('amountDenied')}
            />
            {checkHint('amountDenied')}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date on the Denial</label>
            <input
              type="date"
              name="denialDate"
              value={formData.denialDate}
              onChange={handleChange}
              className={fieldClass('denialDate')}
            />
            {checkHint('denialDate') || <p className="text-xs text-gray-500 mt-1">Used to work out your appeal deadline.</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Procedure Codes *</label>
          <CDTSelector
            selectedCodes={formData.procedureCodes}
            onChange={(codes: string[]) => setFormData(prev => ({ ...prev, procedureCodes: codes }))}
          />
          {checkHint('procedureCodes')}
          {formData.procedureCodes.length === 0 && (
            <p className="text-xs text-red-500 mt-1">Please select at least one procedure code</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Denial Reason *</label>
          <textarea
            name="denialReason"
            required
            rows={4}
            value={formData.denialReason}
            onChange={handleChange}
            className={fieldClass('denialReason')}
            placeholder="Paste the denial reason from the insurance EOB..."
          />
          {checkHint('denialReason')}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Where to send the appeal</label>
          <textarea
            name="insurerAppealsAddress"
            rows={3}
            value={formData.insurerAppealsAddress}
            onChange={handleChange}
            className={fieldClass('appealsAddress')}
            placeholder="Appeals address printed on the denial notice (optional)"
          />
          {checkHint('appealsAddress') || <p className="text-xs text-gray-500 mt-1">Used as the address on the appeal letter. Leave blank to use the insurer's address on file.</p>}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || reading}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Submit Claim'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/claims')}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
