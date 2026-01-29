import { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { AbstractSubmission } from '@/types';
import { getAcceptedPapers, formatPaperDisplay } from '@/services/paperService';
import Button from '@/components/ui/Button';

interface PaperSelectorProps {
  selectedPaperIds: string[];
  onChange: (paperIds: string[]) => void;
  label?: string;
  error?: string;
}

export default function PaperSelector({ selectedPaperIds, onChange, label, error }: PaperSelectorProps) {
  const [acceptedPapers, setAcceptedPapers] = useState<AbstractSubmission[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load accepted papers
    const papers = getAcceptedPapers();
    setAcceptedPapers(papers);
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredPapers = acceptedPapers.filter(paper => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    const paperDisplay = formatPaperDisplay(paper).toLowerCase();
    return paperDisplay.includes(searchLower);
  });

  const selectedPapers = acceptedPapers.filter(p => selectedPaperIds.includes(p.id));
  const availablePapers = filteredPapers.filter(p => !selectedPaperIds.includes(p.id));

  const handleTogglePaper = (paperId: string) => {
    if (selectedPaperIds.includes(paperId)) {
      onChange(selectedPaperIds.filter(id => id !== paperId));
    } else {
      onChange([...selectedPaperIds, paperId]);
    }
  };

  const handleRemovePaper = (paperId: string) => {
    onChange(selectedPaperIds.filter(id => id !== paperId));
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-surface-700">
          {label}
        </label>
      )}

      {/* Selected Papers Display */}
      {selectedPapers.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedPapers.map(paper => (
            <div
              key={paper.id}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm"
            >
              <span className="font-medium">[{paper.paperId}]</span>
              <span className="max-w-xs truncate">{paper.title}</span>
              <button
                type="button"
                onClick={() => handleRemovePaper(paper.id)}
                className="hover:text-primary-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dropdown Selector */}
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-4 py-2.5 border rounded-lg bg-white transition-colors ${
            error
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-surface-200 hover:border-surface-300 focus:ring-primary-500 focus:border-primary-500'
          }`}
        >
          <span className="text-sm text-surface-600">
            {selectedPapers.length > 0
              ? `${selectedPapers.length} paper${selectedPapers.length === 1 ? '' : 's'} selected`
              : 'Select papers from accepted submissions'}
          </span>
          <ChevronDown className={`w-4 h-4 text-surface-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-surface-200 rounded-lg shadow-lg max-h-96 overflow-hidden">
            {/* Search Input */}
            <div className="p-3 border-b border-surface-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search papers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Papers List */}
            <div className="max-h-64 overflow-y-auto">
              {availablePapers.length === 0 ? (
                <div className="p-4 text-center text-sm text-surface-500">
                  {acceptedPapers.length === 0
                    ? 'No accepted papers available'
                    : 'No papers match your search'}
                </div>
              ) : (
                <div className="py-1">
                  {availablePapers.map(paper => (
                    <button
                      key={paper.id}
                      type="button"
                      onClick={() => handleTogglePaper(paper.id)}
                      className="w-full px-4 py-2.5 text-left hover:bg-surface-50 transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="w-4 h-4 border-2 border-surface-300 rounded"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-surface-900 mb-0.5">
                            <span className="text-primary-600">[{paper.paperId}]</span> {paper.title}
                          </div>
                          <div className="text-xs text-surface-500 truncate">
                            {paper.authors.map(a => a.name).join(', ')}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {availablePapers.length > 0 && (
              <div className="p-3 border-t border-surface-100 bg-surface-50">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => setIsOpen(false)}
                  className="w-full"
                >
                  Done
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Help Text */}
      <p className="text-xs text-surface-500">
        Only papers with "Accepted" status are available for selection
      </p>
    </div>
  );
}
