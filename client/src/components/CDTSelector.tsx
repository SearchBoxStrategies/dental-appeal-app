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

// Any correctly formatted code is accepted: US ADA CDT codes (D2740) or Canadian CDA
// USC&LS codes (27211). The list below is a shortcut for common codes, not a limit.
const normalizeCode = (raw: string) => {
    const code = raw.toUpperCase().replace(/[\s-]/g, '');
    return /^\d{4}$/.test(code) ? `D${code}` : code;
};
const isValidCode = (code: string) => /^D\d{4}$/.test(code) || /^\d{5}$/.test(code);

export default function CDTSelector({ selectedCodes, onChange }: CDTSelectorProps) {
    const [cdtGroups, setCdtGroups] = useState<CDTGrouped>({});
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [typed, setTyped] = useState('');
    const [typedError, setTypedError] = useState('');

    useEffect(() => {
        const fetchCDTCodes = async () => {
            try {
                const response = await api.get('/cdt-codes');
                setCdtGroups(response.data);
            } catch (error) {
                console.error('Error fetching CDT codes:', error);
                setError('Could not load the code list. You can still type codes above.');
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

    // Several codes can be typed at once, separated by spaces or commas.
    const addTypedCodes = () => {
        const parts = typed.split(/[\s,;]+/).filter(Boolean).map(normalizeCode);
        if (!parts.length) return;
        const bad = parts.filter(c => !isValidCode(c));
        if (bad.length) {
            setTypedError(`${bad.join(', ')}: use a US code like D2740 or a Canadian code like 27211.`);
            return;
        }
        onChange([...new Set([...selectedCodes, ...parts])]);
        setTyped('');
        setTypedError('');
    };

    const getCodeDescription = (code: string): string => {
        for (const category of Object.values(cdtGroups)) {
            const found = category.find(c => c.code === code);
            if (found) return found.description;
        }
        return '';
    };

    return (
        <div className="border rounded-lg p-4 bg-gray-50">
            <div className="mb-4">
                <label htmlFor="procedure-code-input" className="block text-xs font-medium text-gray-700 mb-1">
                    Type procedure codes (US like D2740, Canada like 27211)
                </label>
                <div className="flex gap-2">
                    <input
                        id="procedure-code-input"
                        type="text"
                        placeholder="e.g. D2740 D2950"
                        value={typed}
                        onChange={(e) => { setTyped(e.target.value); setTypedError(''); }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                addTypedCodes();
                            }
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                    />
                    <button
                        type="button"
                        onClick={addTypedCodes}
                        className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700"
                    >
                        <Plus className="w-4 h-4" />
                        Add
                    </button>
                </div>
                {typedError && <p className="text-xs text-red-600 mt-1">{typedError}</p>}
            </div>

            {loading ? (
                <div className="text-center py-2 text-gray-500 text-sm">Loading common codes...</div>
            ) : error ? (
                <div className="text-center py-2 text-gray-500 text-sm">{error}</div>
            ) : (
                <div className="space-y-2">
                    <p className="text-xs text-gray-500">Or pick from common codes:</p>
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
            )}

            {selectedCodes.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 mb-2">Selected Codes:</p>
                    <div className="flex flex-wrap gap-2">
                        {selectedCodes.map((code) => {
                            const description = getCodeDescription(code);
                            return (
                                <span
                                    key={code}
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm"
                                >
                                    <span className="font-mono font-medium">{code}</span>
                                    {description && <span className="text-xs">({description.substring(0, 30)})</span>}
                                    <button
                                        type="button"
                                        onClick={() => onChange(selectedCodes.filter(c => c !== code))}
                                        className="ml-1 hover:text-blue-600"
                                        aria-label={`Remove ${code}`}
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
