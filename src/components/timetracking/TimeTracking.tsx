
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCompany } from "@/contexts/CompanyContext";
import { formatHoursDisplay, formatCurrency } from "./utils/timeTrackingUtils";
import { TimeTrackingControls } from "./TimeTrackingControls";
import { TimeEntry, Project, ProjectSummary, TimeEntryFormData, EnhancedTimeEntry } from "./TimeTrackingTypes";
import { toast } from "sonner";

export const TimeTracking: React.FC = () => {
  const { currentCompany, addTimeEntry, updateTimeEntry, deleteTimeEntry } = useCompany();
  const [activeTab, setActiveTab] = useState("time-entries");
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [projectSummaries, setProjectSummaries] = useState<ProjectSummary[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
  const [formData, setFormData] = useState<TimeEntryFormData>({
    projectId: "",
    employeeId: "emp-1", // Default to first employee
    date: new Date().toISOString().split('T')[0],
    hours: 0,
    description: "",
    billable: true
  });
  
  // Get projects from the company context
  const projects = currentCompany?.projects || [];
  
  // Load time entries from company context
  useEffect(() => {
    if (currentCompany && currentCompany.timeEntries) {
      setTimeEntries(currentCompany.timeEntries);
    }
  }, [currentCompany]);
  
  // Calculate project summaries whenever time entries change
  useEffect(() => {
    if (!projects || !timeEntries) return;
    
    const summaries: ProjectSummary[] = projects.map(project => {
      // Filter time entries for this project
      const projectEntries = timeEntries.filter(entry => entry.projectId === project.id);
      
      // Calculate total tracked hours
      const trackedHours = projectEntries.reduce((total, entry) => 
        total + entry.hours, 0);
      
      // Calculate billable hours - ensure we handle billable property correctly
      const billableHours = projectEntries.reduce((total, entry) => {
        // Safely check if billable is true (not just truthy)
        const isBillable = entry.billable === true;
        return total + (isBillable ? entry.hours : 0);
      }, 0);
      
      return {
        id: project.id,
        name: project.name,
        trackedHours,
        billableHours
      };
    });
    
    setProjectSummaries(summaries);
  }, [timeEntries, projects]);
  
  const calculateTotalHours = (entries: TimeEntry[]) => {
    return entries.reduce((total, entry) => total + entry.hours, 0);
  };
  
  const calculateTotalBillableHours = (entries: TimeEntry[]) => {
    return entries.reduce((total, entry) => {
      // Safely check if billable is true (not just truthy)
      const isBillable = entry.billable === true;
      return isBillable ? total + entry.hours : total;
    }, 0);
  };
  
  const calculateBillableAmount = (entries: TimeEntry[]) => {
    // For simplicity, assume $50 per billable hour
    const billableHours = calculateTotalBillableHours(entries);
    return billableHours * 50;
  };
  
  const getProjectNameById = (projectId: string) => {
    const project = projects?.find(p => p.id === projectId);
    return project ? project.name : "Unknown Project";
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmitTimeEntry = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.projectId || !formData.date || formData.hours <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (editingEntry) {
      // Update existing time entry
      const updatedEntry: TimeEntry = {
        ...editingEntry,
        projectId: formData.projectId,
        date: formData.date,
        hours: formData.hours,
        description: formData.description,
        billable: formData.billable
      };
      
      // Updated: Fix the type mismatch by passing the timeEntryId as string instead of the whole object
      updateTimeEntry(updatedEntry.id, {
        projectId: formData.projectId,
        date: formData.date,
        hours: formData.hours,
        description: formData.description,
        billable: formData.billable
      });
      
      setEditingEntry(null);
      toast.success("Time entry updated");
    } else {
      // Create new time entry
      const newTimeEntry: TimeEntry = {
        id: `time-${Date.now()}`,
        employeeId: formData.employeeId,
        projectId: formData.projectId,
        date: formData.date,
        hours: formData.hours,
        description: formData.description,
        billable: formData.billable,
        status: "Pending" // Default status for new entries
      };
      
      addTimeEntry(newTimeEntry);
      toast.success("Time entry added");
    }
    
    // Reset form
    setFormData({
      projectId: "",
      employeeId: "emp-1",
      date: new Date().toISOString().split('T')[0],
      hours: 0,
      description: "",
      billable: true
    });
    setIsAddingEntry(false);
  };
  
  const handleEditEntry = (entry: TimeEntry) => {
    setEditingEntry(entry);
    setFormData({
      projectId: entry.projectId,
      employeeId: entry.employeeId,
      date: entry.date,
      hours: entry.hours,
      description: entry.description,
      billable: entry.billable === true // Ensure boolean type
    });
    setIsAddingEntry(true);
  };
  
  const handleDeleteEntry = (entry: TimeEntry) => {
    if (confirm("Are you sure you want to delete this time entry?")) {
      // Fix for the deleteTimeEntry function - pass only the ID
      deleteTimeEntry(entry.id);
      toast.success("Time entry deleted");
    }
  };
  
  const handleCancelEdit = () => {
    setEditingEntry(null);
    setFormData({
      projectId: "",
      employeeId: "emp-1",
      date: new Date().toISOString().split('T')[0],
      hours: 0,
      description: "",
      billable: true
    });
    setIsAddingEntry(false);
  };
  
  const handleEntryComplete = (entry: TimeEntry) => {
    if (addTimeEntry) {
      addTimeEntry(entry);
    }
    // Refresh time entries
    if (currentCompany && currentCompany.timeEntries) {
      setTimeEntries([...currentCompany.timeEntries]);
    }
  };
  
  const filteredTimeEntries = selectedProject
    ? timeEntries.filter(entry => entry.projectId === selectedProject)
    : timeEntries;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle>Time Tracking</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={isAddingEntry ? "outline" : "default"}
                    onClick={() => setIsAddingEntry(!isAddingEntry)}
                  >
                    {isAddingEntry ? "Cancel" : "Add Time Entry"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="time-entries">Time Entries</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                </TabsList>
                
                <TabsContent value="time-entries">
                  {isAddingEntry ? (
                    <div className="bg-gray-50 p-4 mb-4 rounded-md">
                      <h3 className="text-lg font-medium mb-3">
                        {editingEntry ? "Edit Time Entry" : "Add New Time Entry"}
                      </h3>
                      <form onSubmit={handleSubmitTimeEntry} className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Project</label>
                            <Select 
                              value={formData.projectId} 
                              onValueChange={(value) => handleSelectChange("projectId", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select project" />
                              </SelectTrigger>
                              <SelectContent>
                                {projects?.map((project) => (
                                  <SelectItem key={project.id} value={project.id}>
                                    {project.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Date</label>
                            <Input
                              type="date"
                              name="date"
                              value={formData.date}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Hours</label>
                            <Input
                              type="number"
                              name="hours"
                              min="0.25"
                              step="0.25"
                              value={formData.hours}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Billable</label>
                            <div className="pt-2">
                              <Input
                                type="checkbox"
                                name="billable"
                                checked={formData.billable}
                                onChange={handleInputChange}
                                className="w-4 h-4"
                              />
                              <span className="ml-2">Billable to client</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Description</label>
                          <Input
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="What did you work on?"
                          />
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <Button 
                            type="button"
                            variant="outline" 
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">
                            {editingEntry ? "Update" : "Save"}
                          </Button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <div>
                          <Select 
                            value={selectedProject} 
                            onValueChange={setSelectedProject}
                          >
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Filter by project" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">All Projects</SelectItem>
                              {projects?.map((project) => (
                                <SelectItem key={project.id} value={project.id}>
                                  {project.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {filteredTimeEntries.length > 0 ? (
                    <div>
                      <div className="overflow-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Project</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead className="text-right">Hours</TableHead>
                              <TableHead>Billable</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredTimeEntries.map((entry) => (
                              <TableRow key={entry.id}>
                                <TableCell>{entry.date}</TableCell>
                                <TableCell>{getProjectNameById(entry.projectId)}</TableCell>
                                <TableCell>{entry.description}</TableCell>
                                <TableCell className="text-right">
                                  {formatHoursDisplay(entry.hours)}
                                </TableCell>
                                <TableCell>{entry.billable === true ? "Yes" : "No"}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleEditEntry(entry)}
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDeleteEntry(entry)}
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      
                      <div className="mt-4 bg-gray-50 p-4 rounded-md">
                        <div className="flex justify-between">
                          <span className="font-medium">Total Hours:</span>
                          <span>{formatHoursDisplay(calculateTotalHours(filteredTimeEntries))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Billable Hours:</span>
                          <span>{formatHoursDisplay(calculateTotalBillableHours(filteredTimeEntries))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Billable Amount:</span>
                          <span>{formatCurrency(calculateBillableAmount(filteredTimeEntries))}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No time entries found</p>
                      <Button 
                        variant="outline" 
                        className="mt-2"
                        onClick={() => setIsAddingEntry(true)}
                      >
                        Add Your First Time Entry
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="projects">
                  {projectSummaries.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Project</TableHead>
                          <TableHead className="text-right">Hours Tracked</TableHead>
                          <TableHead className="text-right">Billable Hours</TableHead>
                          <TableHead className="text-right">Billable Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projectSummaries.map((project) => (
                          <TableRow key={project.id}>
                            <TableCell>{project.name}</TableCell>
                            <TableCell className="text-right">
                              {formatHoursDisplay(project.trackedHours)}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatHoursDisplay(project.billableHours)}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(project.billableHours * 50)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No project data available</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full md:w-1/3">
          <TimeTrackingControls 
            projectId={selectedProject} 
            onEntryComplete={handleEntryComplete} 
          />
        </div>
      </div>
    </div>
  );
};

export default TimeTracking;
