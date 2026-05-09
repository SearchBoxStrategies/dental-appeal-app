import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import api from '../lib/api';

interface CDTGrouped {
    [category: string]: Array<{
        code: string;
        category: string;
        description: string;
    }>;
}

interface CDTSelectorProps {
    selectedCodes: string[];
    onChange: (codes: string[]) => void;
}

export default function CDTSelector({ selectedCodes, onChange }: CDTSelectorProps) {
    const [cdtGroups, setCdtGroups] = useState<CDTGrouped>({});
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showOtherInput, setShowOtherInput] = useState(false);
    const [otherCode, setOtherCode] = useState('');
    const [otherDescription, setOtherDescription] = useState('');

    useEffect(() => {
        const fetchCDTCodes = async () => {
            try {
                const response = await api.get('/cdt-codes');
                setCdtGroups(response.data);
            } catch (error) {
                console.error('Error fetching CDT codes:', error);
                setError('Failed to load procedure codes');
            } finally {
                setLoading(false);
            }
        };
        fetchCDTCodes();
    }, []);

    const toggleCode = (code: string) => {
        if (selectedCodes.includes(code)) {
            onChange(selectedCodes.filter(c => c !== code));
        } else {
            onChange([...selectedCodes, code]);
        }
    };

    const addCustomCode = () => {
        if (!otherCode.trim()) {
            alert('Please enter a procedure code');
            return;
        }
        
        const customCode = otherCode.trim().toUpperCase();
        const customDescription = otherDescription.trim() || 'Custom Procedure';
        
        // Check if code already exists in selected list
        if (selectedCodes.includes(customCode)) {
            alert('This code is already selected');
            return;
        }
        
        // Add to selected codes
        onChange([...selectedCodes, customCode]);
        
        // Reset form
        setOtherCode('');
        setOtherDescription('');
        setShowOtherInput(false);
    };

    const removeCustomCode = (code: string) => {
        onChange(selectedCodes.filter(c => c !== code));
    };

    if (loading) {
        return <div className="text-center py-4 text-gray-500">Loading procedure codes...</div>;
    }

    if (error) {
        return <div className="text-center py-4 text-red-500">{error}</div>;
    }

    return (
        <div className="border rounded-lg p-4 bg-gray-50">
            {/* Standard CDT Categories */}
            <div className="space-y-2 mb-4">
                {Object.entries(cdtGroups).map(([category, codes]) => (
                    <div key={category} className="border rounded-lg bg-white">
                        <button
                            type="button"
                            onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                            className="w-full flex justify-between items-center p-3 font-semibold text-left hover:bg-gray-50"
                        >
                            <span>{category}</span>
                            <span>{expandedCategory === category ? '▼' : '▶'}</span>
                        </button>
                        
                        {expandedCategory === category && (
                            <div className="border-t p-3 space-y-2 max-h-60 overflow-y-auto">
                                {codes.map((code) => (
                                    <label key={code.code} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedCodes.includes(code.code)}
                                            onChange={() => toggleCode(code.code)}
                                            className="w-4 h-4"
                                        />
                                        <span className="font-mono font-bold w-16">{code.code}</span>
                                        <span className="flex-1 text-sm">{code.description}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Other / Custom Code Section */}
            <div className="border-t pt-4 mt-2">
                {!showOtherInput ? (
                    <button
                        type="button"
                        onClick={() => setShowOtherInput(true)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Add custom procedure code
                    </button>
                ) : (
                    <div className="bg-white border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-center">
                            <h4 className="font-medium text-gray-900">Add Custom Code</h4>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowOtherInput(false);
                                    setOtherCode('');
                                    setOtherDescription('');
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Procedure Code *</label>
                                <input
                                    type="text"
                                    placeholder="e.g., D9999"
                                    value={otherCode}
                                    onChange={(e) => setOtherCode(e.target.value)}
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Description (optional)</label>
                                <input
                                    type="text"
                                    placeholder="Procedure description"
                                    value={otherDescription}
                                    onChange={(e) => setOtherDescription(e.target.value)}
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                                />
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={addCustomCode}
                            className="w-full bg-blue-600 text-white py-1.5 rounded-lg text-sm hover:bg-blue-700"
                        >
                            Add Code
                        </button>
                    </div>
                )}
            </div>

            {/* Selected Codes Display */}
            {selectedCodes.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 mb-2">Selected Codes:</p>
                    <div className="flex flex-wrap gap-2">
                        {selectedCodes.map((code) => {
                            // Check if it's a standard code or custom
                            let isCustom = true;
                            let description = '';
                            for (const category of Object.values(cdtGroups)) {
                                const found = category.find(c => c.code === code);
                                if (found) {
                                    isCustom = false;
                                    description = found.description;
                                    break;
                                }
                            }
                            return (
                                <span
                                    key={code}
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm"
                                >
                                    <span className="font-mono font-medium">{code}</span>
                                    {description && <span className="text-xs">({description.substring(0, 30)})</span>}
                                    <button
                                        type="button"
                                        onClick={() => removeCustomCode(code)}
                                        className="ml-1 hover:text-blue-600"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
