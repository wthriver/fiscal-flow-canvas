
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";
import { TimeEntry } from "@/types/company";
import { Play, Pause, Square } from "lucide-react";

interface TimeEntryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  timeEntry?: TimeEntry | null;
}

export const TimeEntryDialog: React.FC<TimeEntryDialogProps> = ({ 
  isOpen, 
  onClose, 
  timeEntry 
}) => {
  const { currentCompany, addTimeEntry, updateTimeEntry } = useCompany();
  const [formData, setFormData] = useState({
    employeeId: "",
    projectId: "",
    taskId: "",
    date: new Date().toISOString().split('T')[0],
    hours: "",
    startTime: "",
    endTime: "",
    description: "",
    billable: true,
    status: "Draft",
    hourlyRate: "",
    tags: [] as string[]
  });

  const [isTracking, setIsTracking] = useState(false);
  const [startTimestamp, setStartTimestamp] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (timeEntry && isOpen) {
      setFormData({
        employeeId: timeEntry.employeeId || "",
        projectId: timeEntry.projectId || "",
        taskId: timeEntry.taskId || "",
        date: timeEntry.date || new Date().toISOString().split('T')[0],
        hours: timeEntry.hours?.toString() || "",
        startTime: timeEntry.startTime || "",
        endTime: timeEntry.endTime || "",
        description: timeEntry.description || "",
        billable: timeEntry.billable !== undefined ? timeEntry.billable : true,
        status: timeEntry.status || "Draft",
        hourlyRate: timeEntry.hourlyRate?.toString() || "",
        tags: timeEntry.tags || []
      });
    } else if (!timeEntry && isOpen) {
      setFormData({
        employeeId: "",
        projectId: "",
        taskId: "",
        date: new Date().toISOString().split('T')[0],
        hours: "",
        startTime: "",
        endTime: "",
        description: "",
        billable: true,
        status: "Draft",
        hourlyRate: "",
        tags: []
      });
    }
  }, [timeEntry, isOpen]);

  // Timer functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking && startTimestamp) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTimestamp.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, startTimestamp]);

  const startTimer = () => {
    const now = new Date();
    setStartTimestamp(now);
    setIsTracking(true);
    setFormData(prev => ({
      ...prev,
      startTime: now.toTimeString().slice(0, 5)
    }));
  };

  const pauseTimer = () => {
    setIsTracking(false);
  };

  const stopTimer = () => {
    if (startTimestamp) {
      const now = new Date();
      const totalMinutes = Math.floor((now.getTime() - startTimestamp.getTime()) / (1000 * 60));
      const hours = (totalMinutes / 60).toFixed(2);
      
      setFormData(prev => ({
        ...prev,
        endTime: now.toTimeString().slice(0, 5),
        hours: hours
      }));
    }
    setIsTracking(false);
    setStartTimestamp(null);
    setElapsedTime(0);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const calculateAmount = () => {
    const hours = parseFloat(formData.hours) || 0;
    const rate = parseFloat(formData.hourlyRate) || 0;
    return (hours * rate).toFixed(2);
  };

  const handleSave = () => {
    if (!formData.employeeId || !formData.projectId || !formData.hours) {
      toast.error("Please fill in all required fields");
      return;
    }

    const entryData: TimeEntry = {
      id: timeEntry?.id || `time-${Date.now()}`,
      employeeId: formData.employeeId,
      projectId: formData.projectId,
      taskId: formData.taskId,
      date: formData.date,
      hours: parseFloat(formData.hours),
      startTime: formData.startTime,
      endTime: formData.endTime,
      description: formData.description,
      billable: formData.billable,
      status: formData.status,
      hourlyRate: parseFloat(formData.hourlyRate) || 0,
      tags: formData.tags,
      amount: parseFloat(calculateAmount())
    };

    if (timeEntry && updateTimeEntry) {
      updateTimeEntry(timeEntry.id, entryData);
      toast.success("Time entry updated successfully!");
    } else if (addTimeEntry) {
      addTimeEntry(entryData);
      toast.success("Time entry added successfully!");
    }
    
    onClose();
  };

  const selectedProject = currentCompany.projects?.find(p => p.id === formData.projectId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{timeEntry ? 'Edit Time Entry' : 'Add Time Entry'}</DialogTitle>
          <DialogDescription>
            {timeEntry ? 'Update time entry details' : 'Log time spent on a project'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Timer Section */}
          <div className="border rounded-lg p-4 bg-muted/50">
            <h3 className="text-lg font-semibold mb-4">Time Tracker</h3>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-mono font-bold">
                {formatTime(elapsedTime)}
              </div>
              <div className="flex gap-2">
                <Button
                  variant={isTracking ? "secondary" : "default"}
                  size="sm"
                  onClick={startTimer}
                  disabled={isTracking}
                >
                  <Play className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={pauseTimer}
                  disabled={!isTracking}
                >
                  <Pause className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={stopTimer}
                  disabled={!startTimestamp}
                >
                  <Square className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Employee*</label>
              <Select value={formData.employeeId} onValueChange={(value) => setFormData({...formData, employeeId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {currentCompany.employees?.map(employee => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Project*</label>
              <Select value={formData.projectId} onValueChange={(value) => setFormData({...formData, projectId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {currentCompany.projects?.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name} - {project.client}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Task Selection */}
          {selectedProject && (
            <div>
              <label className="text-sm font-medium">Task</label>
              <Select value={formData.taskId} onValueChange={(value) => setFormData({...formData, taskId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select task (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {selectedProject.tasks?.map(task => (
                    <SelectItem key={task.id} value={task.id}>
                      {task.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Time Details */}
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Date*</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Hours*</label>
              <Input
                type="number"
                step="0.25"
                value={formData.hours}
                onChange={(e) => setFormData({...formData, hours: e.target.value})}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Start Time</label>
              <Input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">End Time</label>
              <Input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
              />
            </div>
          </div>

          {/* Billing Info */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Hourly Rate</label>
              <Input
                type="number"
                step="0.01"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Invoiced">Invoiced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="billable"
                checked={formData.billable}
                onChange={(e) => setFormData({...formData, billable: e.target.checked})}
              />
              <label htmlFor="billable" className="text-sm font-medium">Billable</label>
            </div>
          </div>

          {/* Amount Display */}
          {formData.hours && formData.hourlyRate && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Total Amount</div>
              <div className="text-xl font-semibold">${calculateAmount()}</div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="What did you work on?"
              rows={3}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium">Tags</label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <Button type="button" onClick={addTag}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                  {tag} ×
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>
            {timeEntry ? 'Update Entry' : 'Add Entry'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
