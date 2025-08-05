import { useState } from "react";
import { Download, FileText, Image, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ExportButtonProps {
  onExport: (format: 'pdf' | 'png' | 'csv') => void;
}

/**
 * Export functionality for dashboard reports
 * Supports PDF, PNG, and CSV export formats common in enterprise tools
 */
export function ExportButton({ onExport }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const exportOptions = [
    {
      format: 'pdf' as const,
      label: 'PDF Report',
      description: 'Complete dashboard with charts',
      icon: FileText,
      recommended: true
    },
    {
      format: 'png' as const,
      label: 'PNG Image',
      description: 'Visual snapshot for presentations',
      icon: Image,
      recommended: false
    },
    {
      format: 'csv' as const,
      label: 'CSV Data',
      description: 'Raw data for analysis',
      icon: Download,
      recommended: false
    }
  ];

  const handleExport = (format: 'pdf' | 'png' | 'csv') => {
    setIsOpen(false);
    onExport(format);
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="flex items-center space-x-2"
        aria-label="Export dashboard report"
      >
        <Download className="w-4 h-4" />
        <span>Export</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-3 py-2">
              Export Format
            </div>
            {exportOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.format}
                  onClick={() => handleExport(option.format)}
                  className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-50 flex items-center space-x-3"
                >
                  <IconComponent className="w-4 h-4 text-gray-500" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{option.label}</span>
                      {option.recommended && (
                        <Badge variant="secondary" className="text-xs">Recommended</Badge>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">{option.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="border-t border-gray-200 p-3">
            <div className="text-xs text-gray-500">
              Exports include current time range and all visible data
            </div>
          </div>
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}