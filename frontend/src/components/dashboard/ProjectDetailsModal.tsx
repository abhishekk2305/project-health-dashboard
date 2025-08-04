import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Project details modal showing metadata and project information
 * Provides context about the current project being monitored
 */
export function ProjectDetailsModal() {
  const projectDetails = {
    name: "Project Health Dashboard",
    owner: "Product Engineering Team",
    startDate: "2024-08-01",
    endDate: "2024-12-31",
    phase: "Development",
    description: "A comprehensive project health monitoring system that tracks schedule progress, budget utilization, and risk management across multiple project dimensions. Built to provide real-time insights for project stakeholders.",
    objectives: [
      "Deploy v1.0 by Q4 2024",
      "Maintain 95% system uptime",
      "Keep development costs under $125K",
      "Support 500+ monthly active users within 6 months"
    ]
  };

  const handleInfoClick = () => {
    const info = `Project: ${projectDetails.name}
Owner: ${projectDetails.owner}
Phase: ${projectDetails.phase}
Timeline: ${new Date(projectDetails.startDate).toLocaleDateString()} - ${new Date(projectDetails.endDate).toLocaleDateString()}

${projectDetails.description}

Key Objectives:
${projectDetails.objectives.map(obj => `• ${obj}`).join('\n')}`;
    
    alert(info);
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="text-gray-500 hover:text-gray-700"
      onClick={handleInfoClick}
    >
      <Info className="w-4 h-4 mr-2" />
      Project Info
    </Button>
  );
}