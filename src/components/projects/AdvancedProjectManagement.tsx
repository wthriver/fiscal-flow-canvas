
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProjectDocuments } from "./ProjectDocuments";
import { 
  FolderOpen, 
  Users, 
  Clock, 
  DollarSign, 
  Calendar, 
  FileText, 
  Target,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";

export const AdvancedProjectManagement: React.FC = () => {
  const { currentCompany } = useCompany();
  const [selectedProject, setSelectedProject] = useState<any>(null);
  
  const projects = currentCompany.projects || [];
  const timeEntries = currentCompany.timeEntries || [];
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'proposal': return 'bg-purple-100 text-purple-800';
      case 'on hold': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTotalBudget = () => {
    return projects.reduce((sum, project) => {
      const budget = typeof project.budget === 'number' ? project.budget : parseFloat(String(project.budget)) || 0;
      return sum + budget;
    }, 0);
  };

  const getTotalBilled = () => {
    return projects.reduce((sum, project) => {
      const billed = typeof project.billed === 'number' ? project.billed : parseFloat(String(project.billed)) || 0;
      return sum + billed;
    }, 0);
  };

  const getTotalTracked = () => {
    return projects.reduce((sum, project) => {
      const tracked = typeof project.tracked === 'number' ? project.tracked : parseFloat(String(project.tracked)) || 0;
      return sum + tracked;
    }, 0);
  };

  const getActiveProjects = () => {
    return projects.filter(p => p.status === 'In Progress' || p.status === 'Planning').length;
  };

  const getProjectBudget = (project: any) => {
    return typeof project.budget === 'number' ? project.budget : parseFloat(String(project.budget)) || 0;
  };

  const getProjectBilled = (project: any) => {
    return typeof project.billed === 'number' ? project.billed : parseFloat(String(project.billed)) || 0;
  };

  const getProjectSpent = (project: any) => {
    return typeof project.spent === 'number' ? project.spent : parseFloat(String(project.spent)) || 0;
  };

  const handleViewDocuments = (document: any) => {
    console.log('Viewing document:', document);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Advanced Project Management</h1>
          <p className="text-muted-foreground">Comprehensive project tracking and management</p>
        </div>
        <Button>
          <FolderOpen className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getActiveProjects()}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${getTotalBudget().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Billed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${getTotalBilled().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Revenue generated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Tracked</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalTracked().toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Total time logged</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="time">Time Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              {projects.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Name</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Billed</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell>{project.client}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(project.priority)}>
                            {project.priority || 'Medium'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={project.progress || 0} className="w-16" />
                            <span className="text-sm">{project.progress || 0}%</span>
                          </div>
                        </TableCell>
                        <TableCell>${getProjectBudget(project).toLocaleString()}</TableCell>
                        <TableCell>${getProjectBilled(project).toLocaleString()}</TableCell>
                        <TableCell>{project.endDate}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedProject(project)}>
                                <FileText className="h-4 w-4 mr-1" />
                                Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>{project.name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">Project Details</h4>
                                    <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                                    <div className="space-y-1 text-sm">
                                      <p><strong>Client:</strong> {project.client}</p>
                                      <p><strong>Start Date:</strong> {project.startDate}</p>
                                      <p><strong>End Date:</strong> {project.endDate}</p>
                                      <p><strong>Project Manager:</strong> {project.projectManager}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-2">Financial Summary</h4>
                                    <div className="space-y-1 text-sm">
                                      <p><strong>Budget:</strong> ${getProjectBudget(project).toLocaleString()}</p>
                                      <p><strong>Billed:</strong> ${getProjectBilled(project).toLocaleString()}</p>
                                      <p><strong>Spent:</strong> ${getProjectSpent(project).toLocaleString()}</p>
                                      <p><strong>Hours Tracked:</strong> {project.tracked || 0} hrs</p>
                                      <p><strong>Billing Rate:</strong> ${project.billingRate || 0}/hr</p>
                                    </div>
                                  </div>
                                </div>
                                
                                {project.documents && project.documents.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold mb-2">Project Documents</h4>
                                    <ProjectDocuments 
                                      documents={project.documents} 
                                      onViewDocument={handleViewDocuments}
                                    />
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">No projects found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              {projects.some(p => p.milestones && p.milestones.length > 0) ? (
                <div className="space-y-6">
                  {projects.map((project) => (
                    project.milestones && project.milestones.length > 0 && (
                      <div key={project.id} className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-4">{project.name}</h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Milestone</TableHead>
                              <TableHead>Due Date</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Budget</TableHead>
                              <TableHead>Description</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {project.milestones.map((milestone: any) => (
                              <TableRow key={milestone.id}>
                                <TableCell className="font-medium">{milestone.name}</TableCell>
                                <TableCell>{milestone.dueDate}</TableCell>
                                <TableCell>
                                  <Badge className={getStatusColor(milestone.status)}>
                                    {milestone.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>${(milestone.budget || 0).toLocaleString()}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {milestone.description}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No milestones found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {projects.some(p => p.tasks && p.tasks.length > 0) ? (
                <div className="space-y-6">
                  {projects.map((project) => (
                    project.tasks && project.tasks.length > 0 && (
                      <div key={project.id} className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-4">{project.name}</h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Task</TableHead>
                              <TableHead>Assignee</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Priority</TableHead>
                              <TableHead>Due Date</TableHead>
                              <TableHead>Hours</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {project.tasks.map((task: any) => (
                              <TableRow key={task.id}>
                                <TableCell className="font-medium">{task.name}</TableCell>
                                <TableCell>{task.assigneeId}</TableCell>
                                <TableCell>
                                  <Badge className={getStatusColor(task.status)}>
                                    {task.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge className={getPriorityColor(task.priority)}>
                                    {task.priority}
                                  </Badge>
                                </TableCell>
                                <TableCell>{task.dueDate}</TableCell>
                                <TableCell>
                                  <span className="text-sm">
                                    {task.actualHours || 0} / {task.estimatedHours || 0}
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No tasks found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="time" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Time Entries</CardTitle>
            </CardHeader>
            <CardContent>
              {timeEntries.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Billable</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {timeEntries.map((entry) => {
                      const project = projects.find(p => p.id === entry.projectId);
                      return (
                        <TableRow key={entry.id}>
                          <TableCell>{entry.date}</TableCell>
                          <TableCell>{entry.employeeId}</TableCell>
                          <TableCell>{project?.name || 'Unknown'}</TableCell>
                          <TableCell>{entry.hours}</TableCell>
                          <TableCell className="text-sm">{entry.description}</TableCell>
                          <TableCell>
                            <Badge variant={entry.billable ? 'default' : 'secondary'}>
                              {entry.billable ? 'Billable' : 'Non-billable'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(entry.status || 'pending')}>
                              {entry.status || 'Pending'}
                            </Badge>
                          </TableCell>
                          <TableCell>${entry.billingRate || 0}/hr</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">No time entries found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
