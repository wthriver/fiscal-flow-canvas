
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Users, Calendar, DollarSign, Clock } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { AdvancedProjectManagement } from "@/components/projects/AdvancedProjectManagement";
import { safeNumberParse } from "@/utils/typeHelpers";

const AdvancedProjects: React.FC = () => {
  const { currentCompany } = useCompany();
  const [activeTab, setActiveTab] = useState("overview");

  const projects = currentCompany?.projects || [];
  const timeEntries = currentCompany?.timeEntries || [];
  const employees = currentCompany?.employees || [];

  // Calculate total billable hours and amount
  const totalBillableHours = timeEntries
    .filter(entry => entry.billable)
    .reduce((total, entry) => total + entry.hours, 0);

  const totalBillableAmount = timeEntries
    .filter(entry => entry.billable)
    .reduce((total, entry) => {
      const rate = entry.billingRate || entry.hourlyRate || 0;
      return total + (entry.hours * rate);
    }, 0);

  const activeProjects = projects.filter(p => p.status === 'Active' || p.status === 'In Progress');
  const completedProjects = projects.filter(p => p.status === 'Completed');

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Advanced Project Management</h1>
          <p className="text-muted-foreground">
            Comprehensive project tracking and management
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Project Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              {projects.length} total projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              Projects delivered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Billable Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBillableHours.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              This period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBillableAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From billable hours
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Active', 'In Progress', 'Completed', 'On Hold'].map(status => {
                    const count = projects.filter(p => p.status === status).length;
                    const percentage = projects.length > 0 ? (count / projects.length) * 100 : 0;
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant={status === 'Active' || status === 'In Progress' ? 'default' : 'secondary'}>
                            {status}
                          </Badge>
                          <span className="text-sm">{count} projects</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress value={percentage} className="w-20" />
                          <span className="text-sm text-muted-foreground">{percentage.toFixed(0)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {timeEntries.slice(0, 5).map(entry => (
                    <div key={entry.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{entry.description}</p>
                        <p className="text-xs text-muted-foreground">{entry.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{entry.hours}h</p>
                        {entry.billable && <Badge variant="outline" className="text-xs">Billable</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects">
          <AdvancedProjectManagement />
        </TabsContent>

        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Resource Allocation</CardTitle>
              <CardDescription>Team member assignments and utilization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employees.map(employee => {
                  const employeeProjects = projects.filter(p => 
                    p.teamMembers?.includes(employee.id) || p.team?.includes(employee.name)
                  );
                  return (
                    <div key={employee.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-sm text-muted-foreground">{employee.position}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{employeeProjects.length} projects</p>
                        <p className="text-xs text-muted-foreground">Active assignments</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.map(project => (
                    <div key={project.id} className="border rounded p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{project.name}</h3>
                          <p className="text-sm text-muted-foreground">{project.client}</p>
                        </div>
                        <Badge variant={project.status === 'Completed' ? 'default' : 'secondary'}>
                          {project.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Budget</p>
                          <p className="font-medium">${safeNumberParse(project.budget).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Billed</p>
                          <p className="font-medium">${safeNumberParse(project.billed || 0).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Progress</p>
                          <div className="flex items-center space-x-2">
                            <Progress value={project.progress || 0} className="flex-1" />
                            <span className="text-xs">{project.progress || 0}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedProjects;
