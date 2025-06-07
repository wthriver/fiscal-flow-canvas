
import React, { useState } from "react";
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
  const { currentCompany, addTimeEntry, updateTimeEntry } = useCompany();
  const [formData, setFormData] = useState({
    employeeId: timeEntry?.employeeId || "",
    projectId: timeEntry?.projectId || "",
    date: timeEntry?.date || new Date().toISOString().split('T')[0],
    hours: timeEntry?.hours?.toString() || "",
    startTime: timeEntry?.startTime || "",
    endTime: timeEntry?.endTime || "",
    description: timeEntry?.description || "",
    billable: timeEntry?.billable || true,
    status: timeEntry?.status || "Draft"
  });

  const handleSave = () => {
    if (!formData.employeeId || !formData.projectId || !formData.hours) {
      toast.error("Please fill in all required fields");
      return;
    }

    const entryData: TimeEntry = {
      id: timeEntry?.id || `time-${Date.now()}`,
      employeeId: formData.employeeId,
      projectId: formData.projectId,
      date: formData.date,
      hours: parseFloat(formData.hours),
      startTime: formData.startTime,
      endTime: formData.endTime,
      description: formData.description,
      billable: formData.billable,
      status: formData.status
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{timeEntry ? 'Edit Time Entry' : 'Add Time Entry'}</DialogTitle>
          <DialogDescription>
            {timeEntry ? 'Update time entry details' : 'Log time spent on a project'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">Employee*</label>
            <Select onValueChange={(value) => setFormData({...formData, employeeId: value})}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={formData.employeeId || "Select employee"} />
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
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">Project*</label>
            <Select onValueChange={(value) => setFormData({...formData, projectId: value})}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={formData.projectId || "Select project"} />
              </SelectTrigger>
              <SelectContent>
                {currentCompany.projects?.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">Date*</label>
            <Input
              type="date"
              className="col-span-3"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">Hours*</label>
            <Input
              type="number"
              step="0.25"
              className="col-span-3"
              value={formData.hours}
              onChange={(e) => setFormData({...formData, hours: e.target.value})}
              placeholder="0.00"
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <label className="text-right">Description</label>
            <Textarea
              className="col-span-3"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="What did you work on?"
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
