import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProjectDetailsModal } from "./ProjectDetailsModal";

/**
 * Top navigation component for the Project Health Dashboard
 * Displays title, deploy status, and user profile information
 */
export function TopNavigation() {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            Project Health Dashboard
          </h1>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
              <span className="text-lg">⚡</span>
              <span className="text-sm font-medium text-blue-700">Demo</span>
            </div>
            <ProjectDetailsModal />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm"
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <Bell className="w-5 h-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-blue-100 text-blue-600">
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <div className="font-medium text-gray-700">Demo User</div>
              <div className="text-xs text-gray-500">demo@projecthealth.io</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
