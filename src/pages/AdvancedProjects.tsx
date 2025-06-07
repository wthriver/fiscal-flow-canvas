import React, { useState } from "react";
import { AdvancedProjectManagement } from "@/components/projects/AdvancedProjectManagement";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useCompany } from "@/contexts/CompanyContext";
import { ProjectDialog } from "@/components/projects/ProjectDialog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Calendar, Clock, DollarSign, TrendingUp, Users, AlertTriangle, CheckCircle } from "lucide-react";

const AdvancedProjects: React.FC = () => {
  const { currentCompany } = useCompany();
  const [activeTab, setActiveTab] = useState("overview");
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);

  const projects = currentCompany.projects || [];

  // Calculate project analytics
  const calculateProjectAnalytics = () => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === "In Progress").length;
    const completedProjects = projects.filter(p => p.status === "Completed").length;
    const onHoldProjects = projects.filter(p => p.status === "On Hold").length;
    const overbudgetProjects = projects.filter(p => {
      const timeEntries = currentCompany.timeEntries?.filter(te => te.projectId === p.id) || [];
      const totalCost = timeEntries.reduce((sum, te) => sum + ((te.amount || te.hours * (te.hourlyRate || te.billingRate || 0)) || 0), 0);
      return totalCost > (p.budget || 0);
    }).length;

    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const totalSpent = projects.reduce((sum, p) => {
      const timeEntries = currentCompany.timeEntries?.filter(te => te.projectId === p.id) || [];
      return sum + timeEntries.reduce((entrySum, te) => entrySum + ((te.amount || te.hours * (te.hourlyRate || te.billingRate || 0)) || 0), 0);
    }, 0);

    const averageProgress = projects.length > 0 
      ? projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length 
      : 0;

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      onHoldProjects,
      overbudgetProjects,
      totalBudget,
      totalSpent,
      averageProgress: Math.round(averageProgress),
      budgetUtilization: totalBudget > 0 ? (totalSpent / totalBudget * 100) : 0
    };
  };

  const analytics = calculateProjectAnalytics();

  // Project status distribution for charts
  const statusData = [
    { name: 'In Progress', value: analytics.activeProjects, color: '#3b82f6' },
    { name: 'Completed', value: analytics.completedProjects, color: '#10b981' },
    { name: 'On Hold', value: analytics.onHoldProjects, color: '#f59e0b' },
    { name: 'Planning', value: projects.filter(p => p.status === "Planning").length, color: '#8b5cf6' }
  ];

  // Monthly project data
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    
    const projectsStarted = projects.filter(p => {
      const startDate = new Date(p.startDate);
      return startDate.getMonth() === date.getMonth() && startDate.getFullYear() === date.getFullYear();
    }).length;

    const projectsCompleted = projects.filter(p => {
      const endDate = p.endDate ? new Date(p.endDate) : null;
      return endDate && endDate.getMonth() === date.getMonth() && endDate.getFullYear() === date.getFullYear() && p.status === 'Completed';
    }).length;

    return {
      month: monthName,
      started: projectsStarted,
      completed: projectsCompleted
    };
  });

  // Get projects by priority
  const highPriorityProjects = projects.filter(p => p.priority === 'High');
  const upcomingDeadlines = projects.filter(p => {
    if (!p.endDate) return false;
    const endDate = new Date(p.endDate);
    const today = new Date();
    const daysUntilDeadline = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDeadline > 0 && daysUntilDeadline <= 30;
  }).sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Advanced Project Management</h1>
          <p className="text-muted-foreground">Comprehensive project analytics, resource management, and performance tracking</p>
        </div>
        <Button onClick={() => setIsProjectDialogOpen(true)}>
          Create Advanced Project
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Projects</p>
                    <p className="text-2xl font-bold">{analytics.totalProjects}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Active Projects</p>
                    <p className="text-2xl font-bold">{analytics.activeProjects}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Budget Utilization</p>
                    <p className="text-2xl font-bold">{analytics.budgetUtilization.toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Progress</p>
                    <p className="text-2xl font-bold">{analytics.averageProgress}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project Status Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>High Priority Projects</CardTitle>
                <CardDescription>Projects requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {highPriorityProjects.length > 0 ? (
                    highPriorityProjects.slice(0, 5).map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{project.name}</div>
                          <div className="text-sm text-muted-foreground">{project.client}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive">High</Badge>
                          <Progress value={project.progress || 0} className="w-20" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No high priority projects</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Upcoming Deadlines (Next 30 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingDeadlines.length > 0 ? (
                <div className="space-y-3">
                  {upcomingDeadlines.map((project) => {
                    const daysLeft = Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    return (
                      <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{project.name}</div>
                          <div className="text-sm text-muted-foreground">{project.client}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-medium">{project.endDate}</div>
                            <div className={`text-xs ${daysLeft <= 7 ? 'text-red-500' : daysLeft <= 14 ? 'text-yellow-500' : 'text-green-500'}`}>
                              {daysLeft} days left
                            </div>
                          </div>
                          <Progress value={project.progress || 0} className="w-20" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No upcoming deadlines</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Trends</CardTitle>
              <CardDescription>Projects started vs completed over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="started" fill="#3b82f6" name="Started" />
                  <Bar dataKey="completed" fill="#10b981" name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Budget</span>
                    <span className="font-bold">${analytics.totalBudget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Spent</span>
                    <span className="font-bold">${analytics.totalSpent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remaining Budget</span>
                    <span className="font-bold text-green-600">
                      ${(analytics.totalBudget - analytics.totalSpent).toLocaleString()}
                    </span>
                  </div>
                  <Progress value={analytics.budgetUtilization} className="w-full" />
                  <p className="text-sm text-muted-foreground">
                    {analytics.budgetUtilization.toFixed(1)}% budget utilized
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Completion Rate</span>
                    </div>
                    <span className="font-bold">
                      {analytics.totalProjects > 0 ? (analytics.completedProjects / analytics.totalProjects * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span>Over Budget</span>
                    </div>
                    <span className="font-bold">{analytics.overbudgetProjects}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span>Avg Team Size</span>
                    </div>
                    <span className="font-bold">
                      {projects.length > 0 ? (projects.reduce((sum, p) => sum + ((p.teamMembers || p.team)?.length || 0), 0) / projects.length).toFixed(1) : 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Resource Management</CardTitle>
              <CardDescription>Team allocation and resource utilization</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Resource management features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
              <CardDescription>Gantt chart and milestone tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Timeline view features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="management">
          <AdvancedProjectManagement />
        </TabsContent>
      </Tabs>

      <ProjectDialog
        isOpen={isProjectDialogOpen}
        onClose={() => setIsProjectDialogOpen(false)}
      />
    </div>
  );
};

export default AdvancedProjects;
