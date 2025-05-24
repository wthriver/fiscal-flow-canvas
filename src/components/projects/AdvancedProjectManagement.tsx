
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  DollarSign, 
  Users, 
  BarChart3, 
  Target,
  Clock,
  AlertTriangle
} from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";

export const AdvancedProjectManagement = () => {
  const { currentCompany } = useCompany();
  const projects = currentCompany.projects || [];

  const calculateProfitability = (project: any) => {
    const budget = typeof project.budget === 'number' ? project.budget : 0;
    const spent = typeof project.spent === 'string' 
      ? parseFloat(project.spent.replace(/[^0-9.-]+/g, "") || "0")
      : typeof project.spent === 'number' ? project.spent : 0;
    return budget - spent;
  };

  const getProjectHealth = (project: any) => {
    const progress = project.progress || 0;
    const endDate = new Date(project.endDate || Date.now());
    const today = new Date();
    const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (progress >= 90) return { status: "Excellent", color: "text-green-600", icon: Target };
    if (progress >= 70 && daysRemaining > 7) return { status: "Good", color: "text-blue-600", icon: Target };
    if (progress >= 50 && daysRemaining > 3) return { status: "Warning", color: "text-yellow-600", icon: Clock };
    return { status: "At Risk", color: "text-red-600", icon: AlertTriangle };
  };

  const totalBudget = projects.reduce((sum, project) => 
    sum + (typeof project.budget === 'number' ? project.budget : 0), 0);
  const totalSpent = projects.reduce((sum, project) => {
    const spent = typeof project.spent === 'string' 
      ? parseFloat(project.spent.replace(/[^0-9.-]+/g, "") || "0")
      : typeof project.spent === 'number' ? project.spent : 0;
    return sum + spent;
  }, 0);
  const totalProfit = totalBudget - totalSpent;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Advanced Project Management</h2>
        <p className="text-muted-foreground">Comprehensive project analytics and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active Projects</p>
                <p className="text-xl font-semibold">{projects.filter(p => p.status === "In Progress").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-xl font-semibold">${totalBudget.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-xl font-semibold">${totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className={`text-xl font-semibold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${totalProfit.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="profitability">Profitability</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6">
            {projects.map((project) => {
              const health = getProjectHealth(project);
              const HealthIcon = health.icon;
              return (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        {project.name}
                        <Badge variant={project.status === "Completed" ? "default" : "secondary"}>
                          {project.status}
                        </Badge>
                      </CardTitle>
                      <div className={`flex items-center gap-1 ${health.color}`}>
                        <HealthIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">{health.status}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Progress</p>
                        <Progress value={project.progress || 0} className="mt-2" />
                        <p className="text-sm mt-1">{project.progress || 0}% Complete</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Budget vs Spent</p>
                        <p className="text-lg font-semibold">
                          ${typeof project.budget === 'number' ? project.budget.toLocaleString() : '0'} / 
                          ${typeof project.spent === 'string' 
                            ? parseFloat(project.spent.replace(/[^0-9.-]+/g, "") || "0").toLocaleString()
                            : (project.spent || 0).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Timeline</p>
                        <p className="text-lg font-semibold">
                          {project.startDate} - {project.endDate}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="profitability">
          <Card>
            <CardHeader>
              <CardTitle>Project Profitability Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((project) => {
                  const profitability = calculateProfitability(project);
                  return (
                    <div key={project.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{project.name}</h3>
                        <Badge variant={profitability >= 0 ? "default" : "destructive"}>
                          {profitability >= 0 ? 'Profitable' : 'Over Budget'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Budget</p>
                          <p className="font-semibold">${(project.budget || 0).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Spent</p>
                          <p className="font-semibold">
                            ${typeof project.spent === 'string' 
                              ? parseFloat(project.spent.replace(/[^0-9.-]+/g, "") || "0").toLocaleString()
                              : (project.spent || 0).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Profit/Loss</p>
                          <p className={`font-semibold ${profitability >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${profitability.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Resource Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">{project.name}</h3>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">
                        Team: {project.team?.length || 0} members
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{project.name}</h3>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">{project.startDate} - {project.endDate}</span>
                      </div>
                    </div>
                    <Progress value={project.progress || 0} className="mt-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
