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

        try {
            // Convert amount fields properly
            const amountClaimed = formData.amountClaimed ? parseFloat(formData.amountClaimed) : null;
            const amountDenied = formData.amountDenied ? parseFloat(formData.amountDenied) : null;

            const response = await api.post('/claims', {
                patientName: formData.patientName,
                patientDob: formData.patientDob,
                insuranceCompany: formData.insuranceCompany,
                serviceDate: formData.serviceDate,
                policyNumber: formData.policyNumber || null,
                claimNumber: formData.claimNumber || null,
                amountClaimed: isNaN(amountClaimed as number) ? null : amountClaimed,
                amountDenied: isNaN(amountDenied as number) ? null : amountDenied,
                procedureCodes: formData.procedureCodes,
                denialReason: formData.denialReason,
            });

            // Success on any 2xx status code (200, 201, etc.)
            if (response.status >= 200 && response.status < 300) {
                navigate('/claims');
            } else {
                const errorMsg = response.data?.error;
                if (typeof errorMsg === 'string') {
                    setError(errorMsg);
                } else {
                    setError('Failed to create claim');
                }
            }
        } catch (err: any) {
            console.error('Claim submission error:', err);
            
            // Handle different error formats
            if (err.response?.data?.error) {
                const errorData = err.response.data.error;
                if (typeof errorData === 'string') {
                    setError(errorData);
                } else if (Array.isArray(errorData)) {
                    setError(errorData.map((e: any) => e.message).join(', '));
                } else if (errorData.message) {
                    setError(errorData.message);
                } else {
                    setError('Validation failed. Please check your form.');
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
