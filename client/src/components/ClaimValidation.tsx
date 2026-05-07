import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle, AlertTriangle, Shield } from 'lucide-react';
import api from '../lib/api';

interface ValidationResult {
  passed: boolean;
  warnings: string[];
  errors: string[];
  autoFixed: boolean;
}

interface ClaimValidationProps {
  claimId: number;
  onValidationComplete?: (passed: boolean) => void;
}

export default function ClaimValidation({ claimId, onValidationComplete }: ClaimValidationProps) {
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [validating, setValidating] = useState(false);

  const runValidation = async () => {
    setValidating(true);
    try {
      const response = await api.post(`/claims/${claimId}/validate`);
      setValidation(response.data);
      onValidationComplete?.(response.data.passed);
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setValidating(false);
    }
  };

  useEffect(() => {
    runValidation();
  }, [claimId]);

  if (validating) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
          <span className="text-yellow-700">Validating claim...</span>
        </div>
      </div>
    );
  }

  if (!validation) return null;

  if (validation.passed && validation.warnings.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <p className="font-medium text-green-800">Claim is ready for appeal!</p>
            <p className="text-sm text-green-700 mt-1">All validation checks passed. You can generate the appeal letter.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`border rounded-lg p-4 ${validation.passed ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
      <div className="flex items-start gap-3 mb-3">
        {validation.passed ? (
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
        ) : (
          <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
        )}
        <div>
          <p className={`font-medium ${validation.passed ? 'text-yellow-800' : 'text-red-800'}`}>
            {validation.passed ? 'Issues detected that may affect appeal success' : 'Critical issues must be fixed'}
          </p>
        </div>
      </div>

      {validation.errors.length > 0 && (
        <div className="mb-3">
          <p className="text-sm font-medium text-red-800 mb-2">Errors to fix:</p>
          <ul className="space-y-1">
            {validation.errors.map((error, idx) => (
              <li key={idx} className="text-sm text-red-700 flex items-start gap-2">
                <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {validation.warnings.length > 0 && (
        <div>
          <p className="text-sm font-medium text-yellow-800 mb-2">Recommendations:</p>
          <ul className="space-y-1">
            {validation.warnings.map((warning, idx) => (
              <li key={idx} className="text-sm text-yellow-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={runValidation}
        disabled={validating}
        className="mt-3 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
      >
        <Shield className="w-4 h-4" />
        Re-validate
      </button>
    </div>
  );
}
