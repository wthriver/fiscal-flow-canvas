
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, Calendar, Users, DollarSign, Clock, FileText, Target, Briefcase } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { AdvancedProjectManagement } from "@/components/projects/AdvancedProjectManagement";
import { ProjectDocuments } from "@/components/projects/ProjectDocuments";
import { ProjectDialog } from "@/components/projects/ProjectDialog";
import { TimeClockSystem } from "@/components/timetracking/TimeClockSystem";
import { ProjectDocument } from "@/types/company";

const Projects: React.FC = () => {
  const { currentCompany } = useCompany();
  const [activeTab, setActiveTab] = useState("overview");
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);

  const projects = currentCompany?.projects || [];
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'In Progress').length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const totalRevenue = projects.reduce((sum, p) => sum + (p.revenue || 0), 0);

  // Collect all documents from all projects
  const allDocuments = projects.flatMap(p => p.documents || []);

  const handleViewDocument = (document: ProjectDocument) => {
    console.log('Viewing document:', document);
    // Implementation for viewing documents
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Project Management</h1>
          <p className="text-muted-foreground">Complete project lifecycle management with advanced features</p>
        </div>
        <Button onClick={() => setIsProjectDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground">{activeProjects} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">{completedProjects} completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Allocated funds</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Generated revenue</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="time">Time Tracking</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Projects</CardTitle>
                <CardDescription>Current project status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.slice(0, 5).map(project => (
                    <div key={project.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{project.name}</p>
                        <p className="text-sm text-muted-foreground">{project.client}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={project.status === 'Completed' ? 'default' : 'secondary'}>
                          {project.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          {project.progress}% complete
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Timeline</CardTitle>
                <CardDescription>Upcoming milestones and deadlines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.filter(p => p.status === 'In Progress').slice(0, 4).map(project => (
                    <div key={project.id} className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium">{project.name}</p>
                        <p className="text-sm text-muted-foreground">Due: {project.endDate}</p>
                      </div>
                      <Progress value={project.progress} className="w-20" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="management">
          <AdvancedProjectManagement />
        </TabsContent>

        <TabsContent value="documents">
          <ProjectDocuments 
            documents={allDocuments}
            onViewDocument={handleViewDocument}
          />
        </TabsContent>

        <TabsContent value="time">
          <TimeClockSystem />
        </TabsContent>

        <TabsContent value="budget">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget Overview</CardTitle>
                <CardDescription>Project budget allocation and tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Budget Allocation</h3>
                    {projects.map(project => (
                      <div key={project.id} className="flex justify-between items-center">
                        <span className="text-sm">{project.name}</span>
                        <span className="text-sm font-medium">${project.budget?.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold">Revenue Generated</h3>
                    {projects.map(project => (
                      <div key={project.id} className="flex justify-between items-center">
                        <span className="text-sm">{project.name}</span>
                        <span className="text-sm font-medium">${(project.revenue || 0).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Project Performance</CardTitle>
                <CardDescription>Detailed project analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Generate Report</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Time & Budget Analysis</CardTitle>
                <CardDescription>Resource utilization report</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Generate Report</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Client Profitability</CardTitle>
                <CardDescription>Client revenue analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Generate Report</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <ProjectDialog 
        isOpen={isProjectDialogOpen} 
        onClose={() => setIsProjectDialogOpen(false)}
      />
    </div>
  );
};

export default Projects;
