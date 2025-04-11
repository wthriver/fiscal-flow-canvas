
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Filter, Download, Search, Clock, Calendar, FileText, CheckCircle2, Activity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Projects: React.FC = () => {
  // Sample projects data
  const projects = [
    { 
      id: "PROJ-001", 
      name: "Website Redesign", 
      client: "ABC Corporation", 
      startDate: "2025-03-15",
      dueDate: "2025-05-30",
      budget: "$12,500.00",
      tracked: "45h 30m",
      billed: "$6,825.00",
      status: "In Progress" 
    },
    { 
      id: "PROJ-002", 
      name: "Mobile App Development", 
      client: "XYZ Limited", 
      startDate: "2025-04-01",
      dueDate: "2025-07-15",
      budget: "$25,000.00",
      tracked: "12h 45m",
      billed: "$1,912.50",
      status: "In Progress" 
    },
    { 
      id: "PROJ-003", 
      name: "Annual Audit", 
      client: "123 Industries", 
      startDate: "2025-02-10",
      dueDate: "2025-03-10",
      budget: "$5,000.00",
      tracked: "32h 15m",
      billed: "$4,837.50",
      status: "Completed" 
    },
    { 
      id: "PROJ-004", 
      name: "Marketing Campaign", 
      client: "Global Tech", 
      startDate: "2025-04-15",
      dueDate: "2025-05-15",
      budget: "$8,750.00",
      tracked: "0h 0m",
      billed: "$0.00",
      status: "Not Started" 
    },
    { 
      id: "PROJ-005", 
      name: "Product Launch", 
      client: "Acme Inc", 
      startDate: "2025-05-01",
      dueDate: "2025-06-15",
      budget: "$15,000.00",
      tracked: "0h 0m",
      billed: "$0.00",
      status: "Not Started" 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your client projects and track time</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Clock size={16} />
            <span>Track Time</span>
          </Button>
          <Button className="flex items-center gap-2">
            <PlusCircle size={16} />
            <span>New Project</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">15</CardTitle>
            <CardDescription>Total Projects</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-primary">8</CardTitle>
            <CardDescription>Active Projects</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-green-500">4</CardTitle>
            <CardDescription>Completed Projects</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-amber-500">3</CardTitle>
            <CardDescription>Overdue Projects</CardDescription>
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
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Calendar size={16} />
            <span>Date Range</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter size={16} />
            <span>Filter</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download size={16} />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Projects</CardTitle>
          <CardDescription>View and manage your client projects</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Tracked Time</TableHead>
                <TableHead>Billed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.client}</TableCell>
                  <TableCell>{project.dueDate}</TableCell>
                  <TableCell>{project.budget}</TableCell>
                  <TableCell>{project.tracked}</TableCell>
                  <TableCell>{project.billed}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === "Completed" 
                        ? "bg-green-100 text-green-800" 
                        : project.status === "In Progress" 
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-gray-100 text-gray-800"
                    }`}>
                      {project.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Clock size={16} />
                        <span className="sr-only">Track Time</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Activity size={16} />
                        <span className="sr-only">Activity</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <FileText size={16} />
                        <span className="sr-only">Invoice</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Projects;
