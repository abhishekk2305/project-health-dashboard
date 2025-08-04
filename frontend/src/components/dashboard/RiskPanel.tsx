import { AlertTriangle, ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

interface RiskPanelProps {
  data?: any;
  isLoading: boolean;
  error?: Error | null;
}

/**
 * Risk register panel component displaying top project risks
 * Shows sortable table of risks with severity levels and risk summary
 */
export function RiskPanel({ data, isLoading, error }: RiskPanelProps) {
  const [sortBy, setSortBy] = useState<'description' | 'severity'>('severity');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  if (error) {
    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
            Risk Register
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 text-sm">Failed to load risk data</p>
            <p className="text-gray-500 text-xs mt-1">Please try refreshing the page</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading || !data) {
    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
            Risk Register
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort risks based on current sort settings
  const sortedRisks = [...(data.risks || [])].sort((a, b) => {
    if (sortBy === 'severity') {
      return sortOrder === 'desc' ? b.severity - a.severity : a.severity - b.severity;
    } else {
      const comparison = a.description.localeCompare(b.description);
      return sortOrder === 'desc' ? -comparison : comparison;
    }
  });

  // Take top 5 risks for display
  const displayRisks = sortedRisks.slice(0, 5);

  /**
   * Handle sorting column changes
   */
  const handleSort = (column: 'description' | 'severity') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  /**
   * Get severity badge styling based on severity level
   */
  const getSeverityBadge = (severity: number) => {
    if (severity >= 4) {
      return <Badge className="bg-red-100 text-red-800">High ({severity})</Badge>;
    } else if (severity === 3) {
      return <Badge className="bg-yellow-100 text-yellow-800">Medium ({severity})</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800">Low ({severity})</Badge>;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
            Risk Register
          </CardTitle>
          <Badge className="bg-red-100 text-red-800">
            {data.summary?.high || 0} High
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Risk Table */}
        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('description')}
                    className="p-0 h-auto font-medium text-xs hover:text-gray-700"
                  >
                    Risk
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('severity')}
                    className="p-0 h-auto font-medium text-xs hover:text-gray-700"
                  >
                    Severity
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayRisks.map((risk) => (
                <TableRow 
                  key={risk.id} 
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <TableCell className="py-3">
                    <div>
                      <span className="text-sm text-gray-900 font-medium">
                        {risk.description}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {risk.impact}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    {getSeverityBadge(risk.severity)}
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-sm text-gray-700 font-medium">
                      {risk.owner || 'Unassigned'}
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge 
                      variant={risk.status === 'open' ? 'destructive' : 
                              risk.status === 'in_progress' ? 'default' : 'secondary'}
                      className={`text-xs ${
                        risk.status === 'open' ? 'bg-red-100 text-red-800 border-red-300' :
                        risk.status === 'in_progress' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                        'bg-green-100 text-green-800 border-green-300'
                      }`}
                    >
                      {risk.status === 'in_progress' ? 'In Progress' : 
                       risk.status.charAt(0).toUpperCase() + risk.status.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* View All Risks Link */}
        <div className="pt-4 border-t border-gray-200">
          <Button 
            variant="link" 
            className="p-0 h-auto text-sm text-blue-600 hover:text-blue-800"
          >
            View all risks →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
