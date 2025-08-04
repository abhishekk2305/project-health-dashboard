import { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TimeRangeSelectorProps {
  currentRange: string;
  onRangeChange: (range: string) => void;
}

const timeRanges = [
  { value: "7d", label: "Last 7 days", description: "Recent activity" },
  { value: "current_sprint", label: "Current Sprint", description: "Sprint 12 data" },
  { value: "30d", label: "Last 30 days", description: "Monthly view" },
  { value: "90d", label: "Last 3 months", description: "Quarterly view" },
  { value: "all", label: "All time", description: "Complete history" }
];

/**
 * Time range selector for filtering dashboard data
 * Enables dynamic pivoting without page reloads
 */
export function TimeRangeSelector({ currentRange, onRangeChange }: TimeRangeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const currentRangeLabel = timeRanges.find(r => r.value === currentRange)?.label || "Current Sprint";

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="flex items-center space-x-2 min-w-[140px]"
        aria-label="Select time range for dashboard data"
      >
        <Calendar className="w-4 h-4" />
        <span className="text-sm">{currentRangeLabel}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-3 py-2">
              Data Range
            </div>
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => {
                  onRangeChange(range.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-50 flex items-center justify-between ${
                  currentRange === range.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                <div>
                  <div className="font-medium">{range.label}</div>
                  <div className="text-xs text-gray-500">{range.description}</div>
                </div>
                {currentRange === range.value && (
                  <Badge variant="secondary" className="text-xs">Active</Badge>
                )}
              </button>
            ))}
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