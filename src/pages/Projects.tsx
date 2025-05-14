
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectDocuments } from "@/components/projects/ProjectDocuments";
import { useCompany } from "@/contexts/CompanyContext";
import { Check, Clock, Calendar, DollarSign, Users, FileText, Search } from "lucide-react";

interface Project {
  id: string;
  name: string;
  client: string;
  startDate: string;
  dueDate: string;
  status: string;
  description?: string;
  budget: string; 
  spent: string; // Changed from number to string to match CompanyContext
  progress: number;
  manager: string;
  team: string[];
  documents: any[];
  tasks: any[];
}

const Projects: React.FC = () => {
  const { currentCompany } = useCompany();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Make sure projects have the correct typing
  const projects = (currentCompany.projects || []).map(project => ({
    ...project,
    // Ensure consistent types
    budget: typeof project.budget === 'number' ? `$${project.budget.toFixed(2)}` : project.budget,
    spent: typeof project.spent === 'number' ? `$${project.spent.toFixed(2)}` : project.spent,
    progress: typeof project.progress === 'number' ? project.progress : 0
  }));
  
  // Calculate project statistics
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === "Completed").length;
  const ongoingProjects = projects.filter(p => p.status === "In Progress").length;
  const delayedProjects = projects.filter(p => p.status === "Delayed").length;
  
  // Filter projects based on search term and active tab
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    return project.status.toLowerCase() === activeTab.toLowerCase() && matchesSearch;
  });
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold">Project Management</h1>
        <Button>New Project</Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold">{totalProjects}</p>
              </div>
              <div className="bg-primary/10 p-2 rounded-full text-primary">
                <FileText size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedProjects}</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full text-green-600">
                <Check size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{ongoingProjects}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                <Clock size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Delayed</p>
                <p className="text-2xl font-bold">{delayedProjects}</p>
              </div>
              <div className="bg-red-100 p-2 rounded-full text-red-600">
                <Calendar size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
            <TabsList>
              <TabsTrigger value="all">All Projects</TabsTrigger>
              <TabsTrigger value="In Progress">In Progress</TabsTrigger>
              <TabsTrigger value="Completed">Completed</TabsTrigger>
              <TabsTrigger value="Delayed">Delayed</TabsTrigger>
            </TabsList>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="pl-8 md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <TabsContent value={activeTab} className="mt-0 p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map(project => (
                <Card 
                  key={project.id} 
                  className={`cursor-pointer hover:border-primary transition-all ${
                    selectedProject?.id === project.id ? "border-primary" : ""
                  }`}
                  onClick={() => setSelectedProject(project)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        project.status === "Completed" ? "bg-green-100 text-green-700" :
                        project.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{project.client}</p>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>Start: {project.startDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>Due: {project.dueDate}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-1">
                          <DollarSign size={14} />
                          <span>Budget: {project.budget}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          <span>{project.team?.length || 0} members</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {selectedProject && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{selectedProject.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{selectedProject.client}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedProject.status === "Completed" ? "bg-green-100 text-green-700" :
                  selectedProject.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                  "bg-yellow-100 text-yellow-700"
                }`}>
                  {selectedProject.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-md font-medium mb-2">Project Details</h3>
                    <p className="text-sm">{selectedProject.description || "No description provided."}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Start Date</p>
                      <p className="font-medium">{selectedProject.startDate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Due Date</p>
                      <p className="font-medium">{selectedProject.dueDate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Budget</p>
                      <p className="font-medium">{selectedProject.budget}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Spent</p>
                      <p className="font-medium">{selectedProject.spent}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span>{selectedProject.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${selectedProject.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-md font-medium mb-2">Project Team</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <p className="text-sm text-muted-foreground">Manager:</p>
                      <p className="text-sm font-medium">{selectedProject.manager}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedProject.team && selectedProject.team.map((member, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="h-6 w-6 rounded-full bg-gray-300"></div>
                          <p className="text-sm">{typeof member === 'string' ? member : 'Team Member'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <h3 className="text-md font-medium">Project Documents</h3>
                  <Button size="sm" variant="outline" className="mt-2 sm:mt-0">Upload Document</Button>
                </div>
                
                <ProjectDocuments 
                  projectDocuments={selectedProject.documents || []} 
                  onViewDocument={() => {}}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Projects;
