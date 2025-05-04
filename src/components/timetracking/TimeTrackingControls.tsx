
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Timer, Play, Pause, CheckCircle } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";
import { TimeEntry } from "@/contexts/CompanyContext";

interface TimeTrackingControlsProps {
  projectId?: string;
  onEntryComplete: (entry: TimeEntry) => void;
}

export const TimeTrackingControls: React.FC<TimeTrackingControlsProps> = ({ 
  projectId, 
  onEntryComplete 
}) => {
  const { currentCompany, addTimeEntry } = useCompany();
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
  const [description, setDescription] = useState("");
  
  // Format time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      remainingSeconds.toString().padStart(2, '0')
    ].join(':');
  };
  
  // Format time as HH:MM for database
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0')
    ].join(':');
  };
  
  // Update the timer every second when active
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTracking && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setElapsedTime(diff);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, startTime]);
  
  const handleStartTimer = () => {
    const now = new Date();
    setStartTime(now);
    setIsTracking(true);
    toast.info("Time tracking started");
  };
  
  const handleStopTimer = () => {
    setIsTracking(false);
    toast.info("Time tracking paused");
  };
  
  const handleCompleteTimeEntry = () => {
    if (!startTime || elapsedTime === 0) {
      return;
    }
    
    const now = new Date();
    const formattedStartTime = startTime.toTimeString().slice(0, 5); // HH:MM
    const formattedEndTime = now.toTimeString().slice(0, 5); // HH:MM
    const duration = formatDuration(elapsedTime);
    
    const newTimeEntry: TimeEntry = {
      id: `time-${Date.now()}`,
      employeeId: "emp1", // Assuming current user is first employee
      projectId: projectId,
      date: new Date().toISOString().split('T')[0],
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      duration: duration,
      description: description,
      billable: true
    };
    
    addTimeEntry(newTimeEntry);
    onEntryComplete(newTimeEntry);
    
    // Reset the timer
    setIsTracking(false);
    setStartTime(null);
    setElapsedTime(0);
    setDescription("");
    
    toast.success("Time entry saved");
  };
  
  return (
    <Card>
      <CardHeader className="pb-2 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Time Tracker</h3>
          </div>
          <div className="text-2xl font-mono">{formatTime(elapsedTime)}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <textarea
            placeholder="What are you working on?"
            className="w-full min-h-[60px] rounded-md border border-input p-2 text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={!isTracking}
          />
          
          <div className="flex justify-between items-center gap-2">
            {isTracking ? (
              <Button 
                variant="outline" 
                className="flex-1 gap-2" 
                onClick={handleStopTimer}
              >
                <Pause size={16} />
                <span>Pause</span>
              </Button>
            ) : (
              <Button 
                variant={startTime ? "outline" : "default"} 
                className="flex-1 gap-2" 
                onClick={handleStartTimer}
              >
                <Play size={16} />
                <span>{startTime ? "Resume" : "Start"}</span>
              </Button>
            )}
            
            <Button 
              variant="default" 
              className="flex-1 gap-2" 
              onClick={handleCompleteTimeEntry}
              disabled={!startTime}
            >
              <CheckCircle size={16} />
              <span>Complete</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
