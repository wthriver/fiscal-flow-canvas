
import React, { useState } from "react";
import TimeTracking from "@/components/timetracking/TimeTracking";
import { TimeEntryDialog } from "@/components/timetracking/TimeEntryDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const TimeTrackingPage: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Time Tracking</h1>
        <Button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Time Entry
        </Button>
      </div>
      
      <TimeTracking />
      
      <TimeEntryDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
};

export default TimeTrackingPage;
