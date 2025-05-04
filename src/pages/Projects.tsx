
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, MoreHorizontal, Check, X, Clock, CalendarIcon, FileText, AlertCircle, Timer } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";

// New Project Interface for cleaner typing
interface ProjectFormData {
  id?: string;
  name: string;
  client: string;
  startDate: string;
  dueDate: string;
  description?: string;
  budget: number;
}

const Projects: React.FC = () => {
  const { currentCompany, updateCompany } = useCompany();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);
  const [editProjectDialogOpen, setEditProjectDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [newProject, setNewProject] = useState<ProjectFormData>({
    name: "",
    client: "",
    startDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    budget: 0,
  });
  
  // Filter projects based on search term
  const filteredProjects = (currentCompany.projects || []).filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate the number of active projects
  const activeProjects = filteredProjects.filter(project => project.status === "In Progress").length;

  // Calculate the number of completed projects
  const completedProjects = filteredProjects.filter(project => project.status === "Completed").length;

  // Find upcoming due projects
  const upcomingDueProjects = filteredProjects
    .filter(project => {
      const dueDate = new Date(project.dueDate);
      const today = new Date();
      const twoWeeksFromNow = new Date();
      twoWeeksFromNow.setDate(today.getDate() + 14);
      
      return dueDate <= twoWeeksFromNow && 
             dueDate >= today && 
             project.status !== "Completed";
    })
    .length;

  const handleCreateProject = () => {
    setNewProjectDialogOpen(true);
  };

  const handleSaveNewProject = () => {
    if (!newProject.name || !newProject.client) {
      toast.error("Please fill in all required fields");
      return;
    }

    const projectToAdd = {
      id: `proj-${Date.now()}`,
      ...newProject,
      status: "In Progress",
      spent: 0,
      progress: 0
    };

    const updatedProjects = [...(currentCompany.projects || []), projectToAdd];
    
    updateCompany(currentCompany.id, { projects: updatedProjects });
    
    toast.success("Project created successfully!");
    setNewProjectDialogOpen(false);
    setNewProject({
      name: "",
      client: "",
      startDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      budget: 0,
    });
  };

  const handleEditProject = (projectId: string) => {
    const project = currentCompany.projects?.find(p => p.id === projectId);
    if (project) {
      setSelectedProject(project);
      setEditProjectDialogOpen(true);
    }
  };

  const handleUpdateProject = () => {
    if (!selectedProject) return;

    const updatedProjects = (currentCompany.projects || []).map(project => 
      project.id === selectedProject.id ? selectedProject : project
    );
    
    updateCompany(currentCompany.id, { projects: updatedProjects });
    
    toast.success(`Project "${selectedProject.name}" updated successfully!`);
    setEditProjectDialogOpen(false);
    setSelectedProject(null);
  };

  const handleDeleteProject = (projectId: string) => {
    const updatedProjects = (currentCompany.projects || []).filter(
      project => project.id !== projectId
    );
    
    updateCompany(currentCompany.id, { projects: updatedProjects });
    
    toast.success("Project deleted successfully");
  };

  const handleArchiveProject = (projectId: string) => {
    const updatedProjects = (currentCompany.projects || []).map(project => 
      project.id === projectId ? { ...project, status: "Archived" } : project
    );
    
    updateCompany(currentCompany.id, { projects: updatedProjects });
    
    toast.success("Project archived successfully");
  };

  const handleMarkComplete = (projectId: string) => {
    const updatedProjects = (currentCompany.projects || []).map(project => 
      project.id === projectId ? { ...project, status: "Completed", progress: 100 } : project
    );
    
    updateCompany(currentCompany.id, { projects: updatedProjects });
    
    toast.success("Project marked as complete");
  };

  const handleTrackTime = (projectId: string) => {
    navigate(`/time-tracking?projectId=${projectId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage {currentCompany.name}'s projects and client work</p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={handleCreateProject}
        >
          <PlusCircle size={16} />
          <span>New Project</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{filteredProjects.length}</CardTitle>
            <CardDescription>Total Projects</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-blue-500">{activeProjects}</CardTitle>
            <CardDescription>Active Projects</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-green-500">{completedProjects}</CardTitle>
            <CardDescription>Completed Projects</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-amber-500">{upcomingDueProjects}</CardTitle>
            <CardDescription>Due Soon</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="w-full sm:w-[300px] pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <CalendarIcon size={16} />
            <span>Filter by Date</span>
          </Button>
          <Link to="/time-tracking">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Timer size={16} />
              <span>Time Tracking</span>
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>All Projects</CardTitle>
          <CardDescription>View and manage {currentCompany.name}'s project portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      <div>
                        {project.name}
                        {new Date(project.dueDate) <= new Date() && project.status !== "Completed" && (
                          <Badge variant="destructive" className="ml-2">Overdue</Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {project.description && project.description.length > 50 
                          ? `${project.description.substring(0, 50)}...` 
                          : project.description || "No description available"}
                      </div>
                    </TableCell>
                    <TableCell>{project.client}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === "Completed" 
                          ? "bg-green-100 text-green-800" 
                          : project.status === "In Progress" 
                            ? "bg-blue-100 text-blue-800" 
                            : project.status === "On Hold" 
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                      }`}>
                        {project.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {project.dueDate}
                        {new Date(project.dueDate) <= new Date() && project.status !== "Completed" && (
                          <AlertCircle size={16} className="ml-1 text-red-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        ${project.budget.toLocaleString()}
                        <div className="text-xs text-muted-foreground mt-1">
                          <span className={project.remaining && project.remaining.includes("-") ? "text-red-500" : ""}>
                            ${(project.budget - project.spent).toLocaleString()} remaining
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-full">
                        <div className="flex justify-between text-xs mb-1">
                          <span>{project.progress}% complete</span>
                          <span>
                            {project.tracked || "0"} tracked / {project.billed || "0"} billed
                          </span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
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
                          <DropdownMenuItem onClick={() => handleTrackTime(project.id)}>
                            Track Time
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditProject(project.id)}>
                            Edit Project
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleMarkComplete(project.id)}>
                            Mark as Complete
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleArchiveProject(project.id)}>
                            Archive Project
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-red-600"
                          >
                            Delete Project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    No projects found for {currentCompany.name}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create New Project Dialog */}
      <Dialog open={newProjectDialogOpen} onOpenChange={setNewProjectDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Add a new project to your portfolio.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Project Name*
              </label>
              <Input 
                id="name" 
                className="col-span-3" 
                value={newProject.name}
                onChange={(e) => setNewProject({...newProject, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="client" className="text-right">
                Client*
              </label>
              <Input 
                id="client" 
                className="col-span-3"
                value={newProject.client}
                onChange={(e) => setNewProject({...newProject, client: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="start-date" className="text-right">
                Start Date
              </label>
              <Input 
                id="start-date" 
                className="col-span-3" 
                type="date"
                value={newProject.startDate}
                onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="due-date" className="text-right">
                Due Date
              </label>
              <Input 
                id="due-date" 
                className="col-span-3" 
                type="date"
                value={newProject.dueDate}
                onChange={(e) => setNewProject({...newProject, dueDate: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="budget" className="text-right">
                Budget ($)
              </label>
              <Input 
                id="budget" 
                className="col-span-3" 
                type="number"
                value={newProject.budget}
                onChange={(e) => setNewProject({...newProject, budget: Number(e.target.value)})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right">
                Description
              </label>
              <Input 
                id="description" 
                className="col-span-3"
                value={newProject.description || ''}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewProjectDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveNewProject}>Create Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={editProjectDialogOpen} onOpenChange={setEditProjectDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update project details.
            </DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-name" className="text-right">
                  Project Name
                </label>
                <Input 
                  id="edit-name" 
                  className="col-span-3" 
                  value={selectedProject.name}
                  onChange={(e) => setSelectedProject({...selectedProject, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-client" className="text-right">
                  Client
                </label>
                <Input 
                  id="edit-client" 
                  className="col-span-3"
                  value={selectedProject.client}
                  onChange={(e) => setSelectedProject({...selectedProject, client: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-start-date" className="text-right">
                  Start Date
                </label>
                <Input 
                  id="edit-start-date" 
                  className="col-span-3" 
                  type="date"
                  value={selectedProject.startDate}
                  onChange={(e) => setSelectedProject({...selectedProject, startDate: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-due-date" className="text-right">
                  Due Date
                </label>
                <Input 
                  id="edit-due-date" 
                  className="col-span-3" 
                  type="date"
                  value={selectedProject.dueDate}
                  onChange={(e) => setSelectedProject({...selectedProject, dueDate: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-budget" className="text-right">
                  Budget ($)
                </label>
                <Input 
                  id="edit-budget" 
                  className="col-span-3" 
                  type="number"
                  value={selectedProject.budget}
                  onChange={(e) => setSelectedProject({...selectedProject, budget: Number(e.target.value)})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-progress" className="text-right">
                  Progress (%)
                </label>
                <Input 
                  id="edit-progress" 
                  className="col-span-3" 
                  type="number"
                  min="0"
                  max="100"
                  value={selectedProject.progress}
                  onChange={(e) => setSelectedProject({...selectedProject, progress: Math.min(100, Math.max(0, Number(e.target.value)))})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-status" className="text-right">
                  Status
                </label>
                <select 
                  id="edit-status"
                  className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                  value={selectedProject.status}
                  onChange={(e) => setSelectedProject({...selectedProject, status: e.target.value})}
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProjectDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateProject}>Update Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {filteredProjects.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Recent Project Activity</CardTitle>
              <CardDescription>Latest updates and milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredProjects.slice(0, 5).map((project) => (
                  <div key={`activity-${project.id}`} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    {project.progress >= 100 ? (
                      <div className="bg-green-100 text-green-600 p-2 rounded-full">
                        <Check size={16} />
                      </div>
                    ) : new Date(project.dueDate) < new Date() && project.status !== "Completed" ? (
                      <div className="bg-red-100 text-red-600 p-2 rounded-full">
                        <X size={16} />
                      </div>
                    ) : (
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                        <Clock size={16} />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{project.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {project.progress >= 100 
                          ? "Project completed" 
                          : new Date(project.dueDate) < new Date() && project.status !== "Completed"
                            ? `Overdue by ${Math.floor((new Date().getTime() - new Date(project.dueDate).getTime()) / (1000 * 60 * 60 * 24))} days`
                            : `${project.progress}% completed`
                        }
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(project.status === "Completed" && project.endDate ? project.endDate : project.dueDate)
                        .toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Project Documents</CardTitle>
              <CardDescription>Recent contracts and files</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredProjects.slice(0, 5).map((project) => (
                  <div key={`doc-${project.id}`} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-100 p-2 rounded-full">
                        <FileText size={16} />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">{project.name} - Contract</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">PDF • Updated 3 days ago</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Projects;
