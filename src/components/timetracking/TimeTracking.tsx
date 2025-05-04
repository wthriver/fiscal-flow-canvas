
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useCompany } from "@/contexts/CompanyContext";
import { Play, Pause, PlusCircle, Clock, Calendar, MoreHorizontal, Check, FileText, Search } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';

// New interface for time entries
interface TimeEntryForm {
  id?: string;
  employeeId: string;
  projectId?: string;
  date: string;
  startTime: string;
  endTime?: string;
  duration?: string;
  description?: string;
  billable: boolean;
}

export const TimeTracking: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentCompany, updateCompany } = useCompany();
  const [activeTab, setActiveTab] = useState('entries');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerStartTime, setTimerStartTime] = useState<Date | null>(null);
  const [currentTimerDescription, setCurrentTimerDescription] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined);
  const [newEntryDialogOpen, setNewEntryDialogOpen] = useState(false);
  const [editEntryDialogOpen, setEditEntryDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [newEntry, setNewEntry] = useState<TimeEntryForm>({
    employeeId: currentCompany.employees?.[0]?.id || '',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: format(new Date(), 'HH:mm'),
    billable: true
  });

  // Extract projectId from query params if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const projectId = params.get('projectId');
    if (projectId) {
      setSelectedProjectId(projectId);
      // Set project for new entry form too
      setNewEntry(prev => ({ ...prev, projectId }));
    }
  }, [location]);

  // Filter time entries based on search term and selected project
  const filteredTimeEntries = (currentCompany.timeEntries || []).filter(entry => {
    const matchesSearch = searchTerm 
      ? (entry.description?.toLowerCase().includes(searchTerm.toLowerCase()) || 
         entry.employeeId.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;
    
    const matchesProject = selectedProjectId
      ? entry.projectId === selectedProjectId
      : true;
      
    return matchesSearch && matchesProject;
  });

  // Get employee name by ID
  const getEmployeeName = (employeeId: string) => {
    const employee = currentCompany.employees?.find(e => e.id === employeeId);
    return employee?.name || "Unknown Employee";
  };

  // Get project name by ID
  const getProjectName = (projectId?: string) => {
    if (!projectId) return "No Project";
    const project = currentCompany.projects?.find(p => p.id === projectId);
    return project?.name || "Unknown Project";
  };

  // Current timer display
  const getCurrentTimerDuration = () => {
    if (!timerStartTime) return '00:00:00';
    const diff = new Date().getTime() - timerStartTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    const seconds = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  // Start/Stop timer
  const toggleTimer = () => {
    if (isTimerRunning) {
      // Stop timer and record time entry
      if (timerStartTime) {
        const now = new Date();
        const durationInMinutes = Math.round((now.getTime() - timerStartTime.getTime()) / (1000 * 60));
        const hours = Math.floor(durationInMinutes / 60);
        const minutes = durationInMinutes % 60;
        const durationStr = `${hours}:${minutes.toString().padStart(2, '0')}`;
        
        // Create new time entry from timer
        const newTimeEntry = {
          id: `time-${Date.now()}`,
          employeeId: currentCompany.employees?.[0]?.id || '',
          projectId: selectedProjectId,
          date: format(timerStartTime, 'yyyy-MM-dd'),
          startTime: format(timerStartTime, 'HH:mm'),
          endTime: format(now, 'HH:mm'),
          duration: durationStr,
          description: currentTimerDescription,
          billable: true
        };
        
        const updatedTimeEntries = [...(currentCompany.timeEntries || []), newTimeEntry];
        updateCompany(currentCompany.id, { timeEntries: updatedTimeEntries });
        
        // Reset timer state
        setIsTimerRunning(false);
        setTimerStartTime(null);
        setCurrentTimerDescription('');
        
        toast({
          title: "Time entry recorded",
          description: `Recorded ${durationStr} for ${currentTimerDescription || 'Unknown task'}`
        });
      }
    } else {
      // Start new timer
      setIsTimerRunning(true);
      setTimerStartTime(new Date());
    }
  };

  // Calculate time summary
  const calculateTimeSummary = () => {
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    
    const todayEntries = filteredTimeEntries.filter(entry => entry.date === todayStr);
    const todayMinutes = todayEntries.reduce((total, entry) => {
      if (entry.duration) {
        const [hours, minutes] = entry.duration.split(':').map(Number);
        return total + (hours * 60 + minutes);
      }
      return total;
    }, 0);
    
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    
    const weekEntries = filteredTimeEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= weekStart && entryDate <= today;
    });
    
    const weekMinutes = weekEntries.reduce((total, entry) => {
      if (entry.duration) {
        const [hours, minutes] = entry.duration.split(':').map(Number);
        return total + (hours * 60 + minutes);
      }
      return total;
    }, 0);
    
    return {
      todayHours: Math.floor(todayMinutes / 60),
      todayMinutes: todayMinutes % 60,
      weekHours: Math.floor(weekMinutes / 60),
      weekMinutes: weekMinutes % 60,
      billableMinutes: weekEntries.filter(e => e.billable).reduce((total, entry) => {
        if (entry.duration) {
          const [hours, minutes] = entry.duration.split(':').map(Number);
          return total + (hours * 60 + minutes);
        }
        return total;
      }, 0)
    };
  };

  const timeSummary = calculateTimeSummary();

  // Add new time entry
  const handleAddTimeEntry = () => {
    setNewEntryDialogOpen(true);
  };

  const handleSaveNewEntry = () => {
    if (!newEntry.employeeId || !newEntry.date || !newEntry.startTime) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Calculate duration if start and end time are provided
    let duration;
    if (newEntry.startTime && newEntry.endTime) {
      const startParts = newEntry.startTime.split(':').map(Number);
      const endParts = newEntry.endTime.split(':').map(Number);
      
      const startMinutes = startParts[0] * 60 + startParts[1];
      const endMinutes = endParts[0] * 60 + endParts[1];
      
      const durationMinutes = endMinutes - startMinutes;
      
      if (durationMinutes > 0) {
        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;
        duration = `${hours}:${minutes.toString().padStart(2, '0')}`;
      }
    }

    const timeEntryToAdd = {
      id: `time-${Date.now()}`,
      ...newEntry,
      duration: duration || "0:00"
    };

    const updatedTimeEntries = [...(currentCompany.timeEntries || []), timeEntryToAdd];
    
    updateCompany(currentCompany.id, { timeEntries: updatedTimeEntries });
    
    toast({
      title: "Time entry added",
      description: "Your time entry has been saved"
    });
    
    setNewEntryDialogOpen(false);
    setNewEntry({
      employeeId: currentCompany.employees?.[0]?.id || '',
      date: format(new Date(), 'yyyy-MM-dd'),
      startTime: format(new Date(), 'HH:mm'),
      billable: true
    });
  };

  // Edit time entry
  const handleEditTimeEntry = (entryId: string) => {
    const entry = currentCompany.timeEntries?.find(e => e.id === entryId);
    if (entry) {
      setSelectedEntry(entry);
      setEditEntryDialogOpen(true);
    }
  };

  const handleUpdateTimeEntry = () => {
    if (!selectedEntry) return;

    const updatedTimeEntries = (currentCompany.timeEntries || []).map(entry => 
      entry.id === selectedEntry.id ? selectedEntry : entry
    );
    
    updateCompany(currentCompany.id, { timeEntries: updatedTimeEntries });
    
    toast({
      title: "Time entry updated",
      description: "Your changes have been saved"
    });
    
    setEditEntryDialogOpen(false);
    setSelectedEntry(null);
  };

  // Delete time entry
  const handleDeleteTimeEntry = (entryId: string) => {
    const updatedTimeEntries = (currentCompany.timeEntries || []).filter(
      entry => entry.id !== entryId
    );
    
    updateCompany(currentCompany.id, { timeEntries: updatedTimeEntries });
    
    toast({
      title: "Time entry deleted",
      description: "The time entry has been removed"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Time Tracking</h1>
          <p className="text-muted-foreground">Track and manage time spent on projects</p>
        </div>
        <div className="flex gap-2">
          <Button 
            className="flex items-center gap-2" 
            onClick={handleAddTimeEntry}
          >
            <PlusCircle size={16} />
            <span>Add Time Entry</span>
          </Button>
          <Button 
            className={`flex items-center gap-2 ${isTimerRunning ? 'bg-red-500 hover:bg-red-600' : ''}`}
            onClick={toggleTimer}
          >
            {isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
            <span>{isTimerRunning ? 'Stop Timer' : 'Start Timer'}</span>
          </Button>
        </div>
      </div>

      {/* Timer Display */}
      {isTimerRunning && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-blue-800">Timer Running</h3>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="What are you working on?"
                    value={currentTimerDescription}
                    onChange={(e) => setCurrentTimerDescription(e.target.value)}
                    className="border-blue-300 bg-white"
                  />
                  <select
                    value={selectedProjectId || ''}
                    onChange={(e) => setSelectedProjectId(e.target.value || undefined)}
                    className="flex h-9 w-64 rounded-md border border-blue-300 bg-white px-3 py-1 text-sm shadow-sm"
                  >
                    <option value="">No Project</option>
                    {currentCompany.projects?.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="text-3xl font-mono text-blue-800">
                {getCurrentTimerDuration()}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{`${timeSummary.todayHours}h ${timeSummary.todayMinutes}m`}</CardTitle>
            <CardDescription>Today's Hours</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{`${timeSummary.weekHours}h ${timeSummary.weekMinutes}m`}</CardTitle>
            <CardDescription>This Week</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{Math.round(timeSummary.billableMinutes / 60 * 100) / 100}h</CardTitle>
            <CardDescription>Billable Hours</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{filteredTimeEntries.length}</CardTitle>
            <CardDescription>Tracked Activities</CardDescription>
          </CardHeader>
        </Card>
      </div>

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
            value={selectedProjectId || ''}
            onChange={(e) => setSelectedProjectId(e.target.value || undefined)}
            className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          >
            <option value="">All Projects</option>
            {currentCompany.projects?.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Calendar size={16} />
            <span>Filter by Date</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="entries">Time Entries</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="approval">Approval</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="entries" className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Billable</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTimeEntries.length > 0 ? (
                filteredTimeEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>{getProjectName(entry.projectId)}</TableCell>
                    <TableCell>{getEmployeeName(entry.employeeId)}</TableCell>
                    <TableCell>{entry.description || "No description"}</TableCell>
                    <TableCell>{entry.startTime}</TableCell>
                    <TableCell>{entry.endTime || "-"}</TableCell>
                    <TableCell>{entry.duration}</TableCell>
                    <TableCell>
                      {entry.billable ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
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
                          <DropdownMenuItem onClick={() => handleEditTimeEntry(entry.id)}>
                            Edit Entry
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
                  <TableCell colSpan={9} className="text-center py-4 text-muted-foreground">
                    No time entries found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="reports" className="border rounded-md p-4">
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Time Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Employee Summary</CardTitle>
                  <CardDescription>Hours by employee</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <FileText size={16} />
                    <span>Generate Report</span>
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Project Summary</CardTitle>
                  <CardDescription>Hours by project</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <FileText size={16} />
                    <span>Generate Report</span>
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Billable Hours</CardTitle>
                  <CardDescription>Client billing report</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <FileText size={16} />
                    <span>Generate Report</span>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="approval" className="border rounded-md p-4">
          <div className="text-center py-8">
            <h2 className="text-xl font-medium">No entries pending approval</h2>
            <p className="text-muted-foreground">All tracked time has been approved</p>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="border rounded-md p-4">
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Time Tracking Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Tracking Preferences</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="track-billable" defaultChecked />
                    <label htmlFor="track-billable">Track billable hours by default</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="remind-tracking" defaultChecked />
                    <label htmlFor="remind-tracking">Send reminders for time tracking</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="enforce-projects" />
                    <label htmlFor="enforce-projects">Require project for all time entries</label>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Approval Workflow</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="require-approval" />
                    <label htmlFor="require-approval">Require manager approval for time entries</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="auto-approve" defaultChecked />
                    <label htmlFor="auto-approve">Auto-approve entries under 8 hours</label>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button>Save Settings</Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Time Entry Dialog */}
      <Dialog open={newEntryDialogOpen} onOpenChange={setNewEntryDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Time Entry</DialogTitle>
            <DialogDescription>
              Record time spent on tasks and projects
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {currentCompany.employees?.length > 0 && (
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="employee" className="text-right">
                  Employee
                </label>
                <select
                  id="employee"
                  className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  value={newEntry.employeeId}
                  onChange={(e) => setNewEntry({...newEntry, employeeId: e.target.value})}
                >
                  {currentCompany.employees.map(employee => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="project" className="text-right">
                Project
              </label>
              <select
                id="project"
                className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={newEntry.projectId || ''}
                onChange={(e) => setNewEntry({...newEntry, projectId: e.target.value || undefined})}
              >
                <option value="">No Project</option>
                {currentCompany.projects?.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="date" className="text-right">
                Date
              </label>
              <Input 
                id="date" 
                className="col-span-3" 
                type="date"
                value={newEntry.date}
                onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="start-time" className="text-right">
                Start Time
              </label>
              <Input 
                id="start-time" 
                className="col-span-3" 
                type="time"
                value={newEntry.startTime}
                onChange={(e) => setNewEntry({...newEntry, startTime: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="end-time" className="text-right">
                End Time
              </label>
              <Input 
                id="end-time" 
                className="col-span-3" 
                type="time"
                value={newEntry.endTime || ''}
                onChange={(e) => setNewEntry({...newEntry, endTime: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right">
                Description
              </label>
              <Input 
                id="description" 
                className="col-span-3"
                value={newEntry.description || ''}
                onChange={(e) => setNewEntry({...newEntry, description: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">
                Billable
              </div>
              <div className="col-span-3">
                <input 
                  type="checkbox" 
                  id="billable" 
                  checked={newEntry.billable} 
                  onChange={(e) => setNewEntry({...newEntry, billable: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="billable">Mark as billable time</label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewEntryDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveNewEntry}>Add Entry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Time Entry Dialog */}
      <Dialog open={editEntryDialogOpen} onOpenChange={setEditEntryDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Time Entry</DialogTitle>
            <DialogDescription>
              Modify the existing time entry
            </DialogDescription>
          </DialogHeader>
          {selectedEntry && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-project" className="text-right">
                  Project
                </label>
                <select
                  id="edit-project"
                  className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  value={selectedEntry.projectId || ''}
                  onChange={(e) => setSelectedEntry({...selectedEntry, projectId: e.target.value || undefined})}
                >
                  <option value="">No Project</option>
                  {currentCompany.projects?.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-date" className="text-right">
                  Date
                </label>
                <Input 
                  id="edit-date" 
                  className="col-span-3" 
                  type="date"
                  value={selectedEntry.date}
                  onChange={(e) => setSelectedEntry({...selectedEntry, date: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-start-time" className="text-right">
                  Start Time
                </label>
                <Input 
                  id="edit-start-time" 
                  className="col-span-3" 
                  type="time"
                  value={selectedEntry.startTime}
                  onChange={(e) => setSelectedEntry({...selectedEntry, startTime: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-end-time" className="text-right">
                  End Time
                </label>
                <Input 
                  id="edit-end-time" 
                  className="col-span-3" 
                  type="time"
                  value={selectedEntry.endTime || ''}
                  onChange={(e) => setSelectedEntry({...selectedEntry, endTime: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-duration" className="text-right">
                  Duration (h:mm)
                </label>
                <Input 
                  id="edit-duration" 
                  className="col-span-3"
                  value={selectedEntry.duration}
                  onChange={(e) => setSelectedEntry({...selectedEntry, duration: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-description" className="text-right">
                  Description
                </label>
                <Input 
                  id="edit-description" 
                  className="col-span-3"
                  value={selectedEntry.description || ''}
                  onChange={(e) => setSelectedEntry({...selectedEntry, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right">
                  Billable
                </div>
                <div className="col-span-3">
                  <input 
                    type="checkbox" 
                    id="edit-billable" 
                    checked={selectedEntry.billable} 
                    onChange={(e) => setSelectedEntry({...selectedEntry, billable: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="edit-billable">Mark as billable time</label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditEntryDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateTimeEntry}>Update Entry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
