import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CDTSelector from '../components/CDTSelector';
import api from '../lib/api';

export default function NewClaim() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        patientName: '',
        patientDob: '',
        insuranceCompany: '',
        serviceDate: '',
        policyNumber: '',
        claimNumber: '',
        amountClaimed: '',
        amountDenied: '',
        procedureCodes: [] as string[],
        denialReason: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Trim all string values
        const patientName = formData.patientName.trim();
        const patientDob = formData.patientDob;
        const insuranceCompany = formData.insuranceCompany.trim();
        const serviceDate = formData.serviceDate;
        const denialReason = formData.denialReason.trim();
        
        // IMPORTANT: Use empty string instead of null
        const policyNumber = formData.policyNumber?.trim() || '';
        const claimNumber = formData.claimNumber?.trim() || '';

        // Validation - Required fields
        if (!patientName) {
            setError('Patient name is required');
            setLoading(false);
            return;
        }
        if (!patientDob) {
            setError('Date of birth is required');
            setLoading(false);
            return;
        }
        if (!insuranceCompany) {
            setError('Insurance company is required');
            setLoading(false);
            return;
        }
        if (!serviceDate) {
            setError('Date of service is required');
            setLoading(false);
            return;
        }
        if (!denialReason) {
            setError('Denial reason is required');
            setLoading(false);
            return;
        }
        if (formData.procedureCodes.length === 0) {
            setError('At least one procedure code is required');
            setLoading(false);
            return;
        }

        // Convert amount fields safely - use 0 instead of null
        let amountClaimed = 0;
        let amountDenied = 0;

        if (formData.amountClaimed && formData.amountClaimed !== '') {
            const parsed = parseFloat(formData.amountClaimed);
            if (!isNaN(parsed) && parsed > 0) {
                amountClaimed = parsed;
            }
        }

        if (formData.amountDenied && formData.amountDenied !== '') {
            const parsed = parseFloat(formData.amountDenied);
            if (!isNaN(parsed) && parsed > 0) {
                amountDenied = parsed;
            }
        }

        const payload = {
            patientName,
            patientDob,
            insuranceCompany,
            serviceDate,
            policyNumber,
            claimNumber,
            amountClaimed,
            amountDenied,
            procedureCodes: formData.procedureCodes,
            denialReason,
        };

        try {
            const response = await api.post('/claims', payload);

            if (response.status >= 200 && response.status < 300) {
                navigate('/claims');
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
                } else if (errorData.message) {
                    setError(errorData.message);
                } else {
                    setError('Please check your form for errors');
                }
            } else if (err.message === 'Network Error') {
                setError('Network error. Please check your connection and try again.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">New Dental Claim</h1>

            {error && (
                <div className="bg-red-50 border border-red-500 text-red-700 p-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Patient Name *</label>
                        <input
                            type="text"
                            name="patientName"
                            required
                            value={formData.patientName}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date of Birth *</label>
                        <input
                            type="date"
                            name="patientDob"
                            required
                            value={formData.patientDob}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Insurance Company *</label>
                        <input
                            type="text"
                            name="insuranceCompany"
                            required
                            value={formData.insuranceCompany}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder="e.g., Delta Dental"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date of Service *</label>
                        <input
                            type="date"
                            name="serviceDate"
                            required
                            value={formData.serviceDate}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Policy Number</label>
                        <input
                            type="text"
                            name="policyNumber"
                            value={formData.policyNumber}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Claim Number</label>
                        <input
                            type="text"
                            name="claimNumber"
                            value={formData.claimNumber}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Amount Claimed ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            name="amountClaimed"
                            value={formData.amountClaimed}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Amount Denied ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            name="amountDenied"
                            value={formData.amountDenied}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Procedure Codes *</label>
                    <CDTSelector
                        selectedCodes={formData.procedureCodes}
                        onChange={(codes) => setFormData(prev => ({ ...prev, procedureCodes: codes }))}
                    />
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
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        placeholder="Paste the denial reason from the insurance EOB..."
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Saving...' : 'Submit Claim'}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/claims')}
                        className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
