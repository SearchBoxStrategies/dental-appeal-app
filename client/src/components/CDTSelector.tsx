import { useState, useEffect } from 'react';
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

    useEffect(() => {
        const fetchCDTCodes = async () => {
            try {
                const response = await api.get('/cdt-codes');
                console.log('CDT Codes received:', response.data);
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

    if (loading) {
        return <div className="text-center py-4 text-gray-500">Loading procedure codes...</div>;
    }

    if (error) {
        return <div className="text-center py-4 text-red-500">{error}</div>;
    }

    if (Object.keys(cdtGroups).length === 0) {
        return <div className="text-center py-4 text-yellow-500">No procedure codes available</div>;
    }

    return (
        <div className="border rounded-lg p-4 bg-gray-50">
            <div className="space-y-2">
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
            
            {selectedCodes.length > 0 && (
                <div className="mt-4 p-2 bg-blue-50 rounded text-sm">
                    <strong>Selected:</strong> {selectedCodes.join(', ')}
                </div>
            )}
        </div>
    );
}
