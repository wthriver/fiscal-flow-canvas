
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";
import { TimeEntry } from "@/types/company";

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
  const { currentCompany, updateCompany } = useCompany();
  
  const [formData, setFormData] = useState({
    employeeId: "",
    projectId: "",
    date: new Date().toISOString().split('T')[0],
    startTime: "",
    endTime: "",
    hours: "",
    hourlyRate: "",
    description: "",
    billable: true,
    status: "Draft"
  });

  useEffect(() => {
    if (timeEntry && isOpen) {
      setFormData({
        employeeId: timeEntry.employeeId || "",
        projectId: timeEntry.projectId || "",
        date: timeEntry.date || new Date().toISOString().split('T')[0],
        startTime: timeEntry.startTime || "",
        endTime: timeEntry.endTime || "",
        hours: timeEntry.hours?.toString() || "",
        hourlyRate: timeEntry.hourlyRate?.toString() || "",
        description: timeEntry.description || "",
        billable: timeEntry.billable !== undefined ? timeEntry.billable : true,
        status: timeEntry.status || "Draft"
      });
    } else if (!timeEntry && isOpen) {
      setFormData({
        employeeId: "",
        projectId: "",
        date: new Date().toISOString().split('T')[0],
        startTime: "",
        endTime: "",
        hours: "",
        hourlyRate: "",
        description: "",
        billable: true,
        status: "Draft"
      });
    }
  }, [timeEntry, isOpen]);

  const calculateHours = () => {
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      const diffMs = end.getTime() - start.getTime();
      const hours = diffMs / (1000 * 60 * 60);
      if (hours > 0) {
        setFormData(prev => ({ ...prev, hours: hours.toFixed(2) }));
      }
    }
  };

  const calculateAmount = () => {
    const hours = parseFloat(formData.hours) || 0;
    const rate = parseFloat(formData.hourlyRate) || 0;
    return hours * rate;
  };

  const handleSave = () => {
    if (!formData.employeeId || !formData.projectId || !formData.hours) {
      toast.error("Please fill in all required fields");
      return;
    }

    const timeEntryData: TimeEntry = {
      id: timeEntry?.id || `time-${Date.now()}`,
      employeeId: formData.employeeId,
      projectId: formData.projectId,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      hours: parseFloat(formData.hours) || 0,
      hourlyRate: parseFloat(formData.hourlyRate) || 0,
      amount: calculateAmount(),
      description: formData.description,
      billable: formData.billable,
      status: formData.status
    };

    const updatedTimeEntries = timeEntry 
      ? currentCompany.timeEntries?.map(entry => entry.id === timeEntry.id ? timeEntryData : entry) || []
      : [...(currentCompany.timeEntries || []), timeEntryData];

    updateCompany({
      ...currentCompany,
      timeEntries: updatedTimeEntries
    });

    toast.success(timeEntry ? "Time entry updated successfully!" : "Time entry added successfully!");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{timeEntry ? 'Edit Time Entry' : 'Add New Time Entry'}</DialogTitle>
          <DialogDescription>
            Track time spent on projects with hourly rates and billing information
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Employee*</label>
              <Select value={formData.employeeId} onValueChange={(value) => setFormData({...formData, employeeId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {currentCompany.employees?.map((employee) => (
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
                  {currentCompany.projects?.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Date*</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Start Time</label>
              <Input
                type="time"
                value={formData.startTime}
                onChange={(e) => {
                  setFormData({...formData, startTime: e.target.value});
                  setTimeout(calculateHours, 100);
                }}
              />
            </div>
            <div>
              <label className="text-sm font-medium">End Time</label>
              <Input
                type="time"
                value={formData.endTime}
                onChange={(e) => {
                  setFormData({...formData, endTime: e.target.value});
                  setTimeout(calculateHours, 100);
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Hours*</label>
              <Input
                type="number"
                step="0.25"
                value={formData.hours}
                onChange={(e) => setFormData({...formData, hours: e.target.value})}
                placeholder="8.00"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Hourly Rate ($)</label>
              <Input
                type="number"
                step="0.01"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                placeholder="50.00"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Total Amount</label>
              <Input
                value={`$${calculateAmount().toFixed(2)}`}
                disabled
                className="bg-muted"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="billable"
                checked={formData.billable}
                onChange={(e) => setFormData({...formData, billable: e.target.checked})}
              />
              <label htmlFor="billable" className="text-sm font-medium">Billable</label>
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
                  <SelectItem value="Billed">Billed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe the work performed"
              rows={3}
            />
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
