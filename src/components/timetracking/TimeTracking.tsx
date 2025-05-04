
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Edit, Filter, MoreHorizontal, Play, Plus, Search, Trash2, Download, FileText } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { TimeTrackingControls } from "./TimeTrackingControls";
import { TimeEntry } from "@/contexts/CompanyContext";

export const TimeTracking: React.FC = () => {
  const { currentCompany, updateCompany } = useCompany();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const projectIdParam = searchParams.get('projectId');
  
  const [activeTab, setActiveTab] = useState("daily");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | undefined>(projectIdParam || undefined);
  const [selectedEmployee, setSelectedEmployee] = useState<string | undefined>(undefined);
  const [dateFilter, setDateFilter] = useState<string>(new Date().toISOString().split('T')[0]);
  
  // Calculate total hours for the day
  const getTotalHoursForDay = (date: string): string => {
    const entries = currentCompany.timeEntries.filter(entry => entry.date === date);
    
    let totalSeconds = 0;
    entries.forEach(entry => {
      const [hours, minutes] = entry.duration.split(':').map(Number);
      totalSeconds += (hours * 3600) + (minutes * 60);
    });
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    return `${hours}h ${minutes}m`;
  };
  
  // Filter time entries based on search term, project, employee, and date
  const filteredTimeEntries = currentCompany.timeEntries.filter(entry => {
    const matchesSearch = !searchTerm || 
      entry.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (currentCompany.projects.find(p => p.id === entry.projectId)?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProject = !selectedProject || entry.projectId === selectedProject;
    const matchesEmployee = !selectedEmployee || entry.employeeId === selectedEmployee;
    
    // Date filtering logic based on active tab
    let matchesDate = true;
    if (activeTab === "daily") {
      matchesDate = entry.date === dateFilter;
    } else if (activeTab === "weekly") {
      // Check if in same week as dateFilter
      const entryDate = new Date(entry.date);
      const filterDate = new Date(dateFilter);
      
      const entryWeekStart = new Date(entryDate);
      entryWeekStart.setDate(entryDate.getDate() - entryDate.getDay());
      
      const filterWeekStart = new Date(filterDate);
      filterWeekStart.setDate(filterDate.getDate() - filterDate.getDay());
      
      matchesDate = entryWeekStart.toISOString().slice(0, 10) === filterWeekStart.toISOString().slice(0, 10);
    }
    
    return matchesSearch && matchesProject && matchesEmployee && matchesDate;
  });
  
  // Get project name by ID
  const getProjectName = (projectId?: string): string => {
    if (!projectId) return "No Project";
    const project = currentCompany.projects.find(p => p.id === projectId);
    return project ? project.name : "Unknown Project";
  };
  
  // Get employee name by ID
  const getEmployeeName = (employeeId: string): string => {
    const employee = currentCompany.employees.find(e => e.id === employeeId);
    return employee ? employee.name : "Unknown Employee";
  };
  
  // Calculate billable amount
  const calculateBillableAmount = (duration: string, billable: boolean): string => {
    if (!billable) return "$0.00";
    
    const [hours, minutes] = duration.split(':').map(Number);
    const totalHours = hours + (minutes / 60);
    const amount = totalHours * 75; // Assume $75/hour rate
    
    return `$${amount.toFixed(2)}`;
  };
  
  // Add a new time entry from the modal
  const handleAddTimeEntry = (entry: TimeEntry) => {
    const updatedEntries = [...currentCompany.timeEntries, entry];
    
    // Update project info if a project is selected
    if (entry.projectId) {
      const project = currentCompany.projects.find(p => p.id === entry.projectId);
      if (project) {
        // Calculate hours from duration
        const [hours, minutes] = entry.duration.split(':').map(Number);
        const durationInHours = hours + (minutes / 60);
        
        // Calculate billable amount if entry is billable
        const billableAmount = entry.billable ? durationInHours * 75 : 0;
        
        const updatedProjects = currentCompany.projects.map(p => {
          if (p.id === entry.projectId) {
            // Update tracked time
            const currentTracked = p.tracked ? parseFloat(p.tracked) : 0;
            const newTracked = (currentTracked + durationInHours).toFixed(1);
            
            // Update billed amount if billable
            const currentBilled = p.billed ? parseFloat(p.billed.replace(/[^0-9.-]+/g, '')) : 0;
            const newBilled = entry.billable ? `$${(currentBilled + billableAmount).toFixed(2)}` : p.billed;
            
            return {
              ...p,
              tracked: newTracked,
              billed: newBilled || "$0.00"
            };
          }
          return p;
        });
        
        updateCompany(currentCompany.id, { 
          timeEntries: updatedEntries,
          projects: updatedProjects
        });
      } else {
        updateCompany(currentCompany.id, { timeEntries: updatedEntries });
      }
    } else {
      updateCompany(currentCompany.id, { timeEntries: updatedEntries });
    }
  };
  
  // Delete a time entry
  const handleDeleteTimeEntry = (entryId: string) => {
    const entryToDelete = currentCompany.timeEntries.find(entry => entry.id === entryId);
    if (!entryToDelete) return;
    
    const updatedEntries = currentCompany.timeEntries.filter(entry => entry.id !== entryId);
    
    // If entry was associated with a project, update project tracking
    if (entryToDelete.projectId && entryToDelete.billable) {
      const [hours, minutes] = entryToDelete.duration.split(':').map(Number);
      const durationInHours = hours + (minutes / 60);
      const billableAmount = durationInHours * 75;
      
      const updatedProjects = currentCompany.projects.map(p => {
        if (p.id === entryToDelete.projectId) {
          // Update tracked time
          const currentTracked = p.tracked ? parseFloat(p.tracked) : 0;
          const newTracked = Math.max(0, currentTracked - durationInHours).toFixed(1);
          
          // Update billed amount
          const currentBilled = p.billed ? parseFloat(p.billed.replace(/[^0-9.-]+/g, '')) : 0;
          const newBilled = `$${Math.max(0, currentBilled - billableAmount).toFixed(2)}`;
          
          return {
            ...p,
            tracked: newTracked,
            billed: newBilled
          };
        }
        return p;
      });
      
      updateCompany(currentCompany.id, { 
        timeEntries: updatedEntries,
        projects: updatedProjects
      });
    } else {
      updateCompany(currentCompany.id, { timeEntries: updatedEntries });
    }
    
    toast.success("Time entry deleted");
  };
  
  // Toggle billable status for a time entry
  const handleToggleBillable = (entryId: string) => {
    const entry = currentCompany.timeEntries.find(e => e.id === entryId);
    if (!entry) return;
    
    const [hours, minutes] = entry.duration.split(':').map(Number);
    const durationInHours = hours + (minutes / 60);
    const billableAmount = durationInHours * 75;
    
    // Update the time entry
    const updatedEntries = currentCompany.timeEntries.map(e => 
      e.id === entryId ? { ...e, billable: !e.billable } : e
    );
    
    // Update the project if this entry is associated with one
    if (entry.projectId) {
      const updatedProjects = currentCompany.projects.map(p => {
        if (p.id === entry.projectId) {
          const currentBilled = p.billed ? parseFloat(p.billed.replace(/[^0-9.-]+/g, '')) : 0;
          const newBilled = entry.billable
            ? `$${Math.max(0, currentBilled - billableAmount).toFixed(2)}`
            : `$${(currentBilled + billableAmount).toFixed(2)}`;
          
          return {
            ...p,
            billed: newBilled
          };
        }
        return p;
      });
      
      updateCompany(currentCompany.id, {
        timeEntries: updatedEntries,
        projects: updatedProjects
      });
    } else {
      updateCompany(currentCompany.id, { timeEntries: updatedEntries });
    }
    
    toast.success(`Time entry ${entry.billable ? 'unmarked' : 'marked'} as billable`);
  };
  
  // Export time entries
  const handleExportTimeEntries = () => {
    toast.success("Time entries exported successfully");
  };
  
  // Generate weekly report
  const handleGenerateReport = () => {
    toast.success("Time tracking report generated");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Time Tracking</h1>
          <p className="text-muted-foreground">Track time spent on projects and tasks</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleGenerateReport}
          >
            <FileText size={16} />
            <span>Generate Report</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleExportTimeEntries}
          >
            <Download size={16} />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search time entries..."
                className="w-full sm:w-[300px] pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                className="flex h-9 w-full sm:w-[200px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                value={selectedProject || ""}
                onChange={(e) => setSelectedProject(e.target.value || undefined)}
              >
                <option value="">All Projects</option>
                {currentCompany.projects.map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
              
              <Button variant="outline" size="icon">
                <Filter size={16} />
              </Button>
              
              <Input
                type="date"
                className="w-full sm:w-[150px]"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </div>
          
          <Tabs defaultValue="daily" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="daily" className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Time Entries for {new Date(dateFilter).toLocaleDateString()}</CardTitle>
                    <div className="text-sm font-medium">
                      Total: <span className="text-primary">{getTotalHoursForDay(dateFilter)}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Start</TableHead>
                        <TableHead>End</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTimeEntries.length > 0 ? (
                        filteredTimeEntries.map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell className="font-medium">
                              {entry.description || "No description"}
                            </TableCell>
                            <TableCell>{getProjectName(entry.projectId)}</TableCell>
                            <TableCell>{entry.startTime}</TableCell>
                            <TableCell>{entry.endTime}</TableCell>
                            <TableCell>{entry.duration}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={entry.billable ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => handleToggleBillable(entry.id)}
                              >
                                {entry.billable ? "Billable" : "Non-billable"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      // Edit functionality would go here
                                      toast.info("Edit time entry", {
                                        description: "This would open the edit dialog"
                                      });
                                    }}
                                  >
                                    Edit Entry
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleToggleBillable(entry.id)}
                                  >
                                    {entry.billable ? "Mark as Non-billable" : "Mark as Billable"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteTimeEntry(entry.id)}
                                    className="text-red-600"
                                  >
                                    Delete Entry
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                            No time entries found for this day
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="weekly" className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Weekly Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 7 }).map((_, index) => {
                      const day = new Date(dateFilter);
                      day.setDate(day.getDate() - day.getDay() + index);
                      const dayStr = day.toISOString().slice(0, 10);
                      const dayEntries = currentCompany.timeEntries.filter(entry => entry.date === dayStr);
                      
                      let totalSeconds = 0;
                      dayEntries.forEach(entry => {
                        const [hours, minutes] = entry.duration.split(':').map(Number);
                        totalSeconds += (hours * 3600) + (minutes * 60);
                      });
                      
                      const hours = Math.floor(totalSeconds / 3600);
                      const minutes = Math.floor((totalSeconds % 3600) / 60);
                      const formattedDuration = `${hours}h ${minutes}m`;
                      
                      return (
                        <div 
                          key={index} 
                          className={`p-4 rounded-md border text-center ${
                            dayStr === new Date().toISOString().slice(0, 10)
                              ? 'border-primary bg-primary/5'
                              : ''
                          }`}
                          onClick={() => setDateFilter(dayStr)}
                        >
                          <div className="text-sm font-medium">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]}</div>
                          <div className="text-2xl font-bold mt-1">{day.getDate()}</div>
                          <div className="text-sm text-muted-foreground mt-2">{formattedDuration}</div>
                          <div className="text-xs mt-1">{dayEntries.length} entries</div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Weekly Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border rounded-md p-4 text-center">
                        <div className="text-muted-foreground text-sm">Total Hours</div>
                        <div className="text-2xl font-bold mt-1">26h 45m</div>
                      </div>
                      <div className="border rounded-md p-4 text-center">
                        <div className="text-muted-foreground text-sm">Billable Hours</div>
                        <div className="text-2xl font-bold mt-1 text-green-600">18h 30m</div>
                      </div>
                      <div className="border rounded-md p-4 text-center">
                        <div className="text-muted-foreground text-sm">Billable Amount</div>
                        <div className="text-2xl font-bold mt-1">$1,387.50</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reports" className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Time Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      className="h-auto p-4 justify-start items-start text-left"
                      onClick={() => handleGenerateReport()}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Clock size={18} />
                          <span className="font-medium">Time Summary</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Overview of time tracked by employee and project
                        </p>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="h-auto p-4 justify-start items-start text-left"
                      onClick={() => handleGenerateReport()}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar size={18} />
                          <span className="font-medium">Detailed Timesheet</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Complete breakdown of all time entries
                        </p>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="h-auto p-4 justify-start items-start text-left"
                      onClick={() => handleGenerateReport()}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <FileText size={18} />
                          <span className="font-medium">Billable Hours</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Report of all billable hours and amounts
                        </p>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="h-auto p-4 justify-start items-start text-left"
                      onClick={() => handleGenerateReport()}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Clock size={18} />
                          <span className="font-medium">Project Time</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Time tracked per project with details
                        </p>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <TimeTrackingControls 
            projectId={selectedProject} 
            onEntryComplete={handleAddTimeEntry} 
          />
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Projects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentCompany.projects
                .filter(project => project.status === "In Progress")
                .slice(0, 5)
                .map(project => (
                  <div 
                    key={project.id} 
                    className="flex items-start space-x-3 pb-4 border-b last:border-0 last:pb-0"
                    onClick={() => setSelectedProject(project.id)}
                  >
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full bg-primary/10 hover:bg-primary/20 text-primary"
                    >
                      <Play size={14} />
                    </Button>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{project.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{project.client}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {project.tracked || "0h"} tracked
                    </div>
                  </div>
                ))}
              
              {currentCompany.projects.filter(project => project.status === "In Progress").length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No active projects
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
