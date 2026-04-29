import { useState, useEffect } from 'react';

interface CDTGrouped {
    [category: string]: Array<{
        code: string;
        category: string;
        description: string;
        full_descriptor: string;
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
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCDTCodes = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/cdt-codes', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                setCdtGroups(data);
            } catch (error) {
                console.error('Error fetching CDT codes:', error);
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

    const toggleCategory = (category: string) => {
        setExpandedCategory(expandedCategory === category ? null : category);
    };

    const filterGroups = () => {
        if (!searchTerm.trim()) return cdtGroups;
        
        const filtered: CDTGrouped = {};
        for (const [category, codes] of Object.entries(cdtGroups)) {
            const matchingCodes = codes.filter(code => 
                code.code.includes(searchTerm.toUpperCase()) ||
                code.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
            if (matchingCodes.length > 0) {
                filtered[category] = matchingCodes;
            }
        }
        return filtered;
    };

    const filteredGroups = filterGroups();

    if (loading) {
        return <div className="text-center py-4">Loading CDT codes...</div>;
    }

    return (
        <div className="cdt-selector border rounded-lg p-4 bg-gray-50">
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by code or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border rounded-md"
                />
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
                {Object.entries(filteredGroups).map(([category, codes]) => (
                    <div key={category} className="border rounded-lg bg-white">
                        <button
                            onClick={() => toggleCategory(category)}
                            className="w-full flex justify-between items-center p-3 font-semibold text-left hover:bg-gray-50"
                        >
                            <span className="flex items-center gap-2">
                                <span className="text-xl">
                                    {category === 'Restorative' && '🦷'}
                                    {category === 'Diagnostic' && '🔍'}
                                    {category === 'Endodontic' && '⚙️'}
                                    {category === 'Periodontic' && '😁'}
                                    {category === 'Prosthodontic' && '🦷'}
                                    {category === 'Implant' && '💉'}
                                    {category === 'Oral Surgery' && '🔪'}
                                    {category === 'Preventive' && '🧼'}
                                    {category === 'Emergency' && '🚨'}
                                    {category === 'Orthodontic' && '😬'}
                                </span>
                                {category}
                            </span>
                            <span className="transform transition-transform">
                                {expandedCategory === category ? '▼' : '▶'}
                            </span>
                        </button>
                        
                        {expandedCategory === category && (
                            <div className="border-t p-3 space-y-2">
                                {codes.map(code => (
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
                <div className="mt-4 p-2 bg-blue-50 rounded">
                    <strong>Selected:</strong> {selectedCodes.join(', ')}
                </div>
            )}
        </div>
    );
}