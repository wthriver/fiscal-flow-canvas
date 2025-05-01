
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Clock, PlayCircle, PauseCircle, CheckCircle, FilePlus, Calendar, User } from "lucide-react";
import { toast } from "sonner";

export const TimeTracking: React.FC = () => {
  const [activeTab, setActiveTab] = useState("time-entries");
  const [isTracking, setIsTracking] = useState(false);
  const [trackingProject, setTrackingProject] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  const [selectedDate, setSelectedDate] = useState("2025-05-01");

  const handleStartTracking = (projectId: string) => {
    setIsTracking(true);
    setTrackingProject(projectId);
    setElapsedTime("00:00:00");
    toast.success("Time tracking started", {
      description: `Now tracking time for ${projectId === "proj-001" ? "Website Redesign" : projectId === "proj-002" ? "Mobile App Development" : "E-commerce Integration"}`
    });
  };

  const handleStopTracking = () => {
    setIsTracking(false);
    setTrackingProject(null);
    toast.info("Time tracking stopped", {
      description: "Your time has been recorded. Don't forget to add details."
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-2xl font-bold">Time Tracking</h1>
        <div className="flex gap-2">
          <Button className="flex items-center gap-2">
            <FilePlus className="h-4 w-4" />
            <span>Add Time Entry</span>
          </Button>
        </div>
      </div>

      {isTracking && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600 animate-pulse" />
                <span className="font-medium">Currently tracking:</span>
                <span className="font-bold">{trackingProject === "proj-001" ? "Website Redesign" : trackingProject === "proj-002" ? "Mobile App Development" : "E-commerce Integration"}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xl font-mono font-bold">{elapsedTime}</span>
                <Button 
                  variant="destructive" 
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={handleStopTracking}
                >
                  <PauseCircle className="h-4 w-4" />
                  <span>Stop</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Today's Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2h 45m</p>
            <p className="text-sm text-muted-foreground">Of 8h planned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">12h 15m</p>
            <p className="text-sm text-muted-foreground">Of 40h planned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Billable Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">9h 30m</p>
            <p className="text-sm text-muted-foreground">77% billable rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <div>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-48"
          />
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all-projects">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Project filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-projects">All Projects</SelectItem>
              <SelectItem value="proj-001">Website Redesign</SelectItem>
              <SelectItem value="proj-002">Mobile App Development</SelectItem>
              <SelectItem value="proj-003">E-commerce Integration</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all-tasks">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Task filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-tasks">All Tasks</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="development">Development</SelectItem>
              <SelectItem value="testing">Testing</SelectItem>
              <SelectItem value="meetings">Meetings</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-1 sm:grid-cols-4 mb-4">
          <TabsTrigger value="time-entries">Time Entries</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="time-entries" className="border rounded-md p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Date</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Billable</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{selectedDate}</TableCell>
                <TableCell>Website Redesign</TableCell>
                <TableCell>Frontend Development</TableCell>
                <TableCell>Implementing responsive navigation</TableCell>
                <TableCell>1h 45m</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Yes</span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleStartTracking("proj-001")}
                      disabled={isTracking}
                    >
                      <PlayCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{selectedDate}</TableCell>
                <TableCell>Mobile App Development</TableCell>
                <TableCell>UI Design</TableCell>
                <TableCell>Creating app icons and splash screens</TableCell>
                <TableCell>1h 00m</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Yes</span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleStartTracking("proj-002")}
                      disabled={isTracking}
                    >
                      <PlayCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="projects">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Website Redesign</CardTitle>
                <CardDescription>ABC Corporation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time logged:</span>
                  <span className="font-medium">45h / 120h budgeted</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Billable:</span>
                  <span className="font-medium">40h (89%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">In Progress</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">View Details</Button>
                <Button 
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleStartTracking("proj-001")}
                  disabled={isTracking}
                >
                  <PlayCircle className="h-4 w-4" />
                  <span>Start Timer</span>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mobile App Development</CardTitle>
                <CardDescription>XYZ Limited</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time logged:</span>
                  <span className="font-medium">120h / 240h budgeted</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Billable:</span>
                  <span className="font-medium">100h (83%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">In Progress</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">View Details</Button>
                <Button 
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleStartTracking("proj-002")}
                  disabled={isTracking}
                >
                  <PlayCircle className="h-4 w-4" />
                  <span>Start Timer</span>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="border rounded-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Time Summary</CardTitle>
                <CardDescription>Overview of time logged by projects and users</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline">Generate Report</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billable Hours</CardTitle>
                <CardDescription>Analysis of billable vs. non-billable time</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline">Generate Report</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Time</CardTitle>
                <CardDescription>Detailed time breakdown by project</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline">Generate Report</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Member Productivity</CardTitle>
                <CardDescription>Analysis of time logged by team members</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline">Generate Report</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team" className="border rounded-md p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Current Task</TableHead>
                <TableHead>Today</TableHead>
                <TableHead>This Week</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Jane Smith</TableCell>
                <TableCell>Designer</TableCell>
                <TableCell>Website Redesign - Design Mockups</TableCell>
                <TableCell>3h 15m</TableCell>
                <TableCell>15h 45m</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>John Doe</TableCell>
                <TableCell>Frontend Developer</TableCell>
                <TableCell>Website Redesign - Frontend Development</TableCell>
                <TableCell>4h 30m</TableCell>
                <TableCell>18h 15m</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Bob Johnson</TableCell>
                <TableCell>Backend Developer</TableCell>
                <TableCell>Mobile App Development - API Integration</TableCell>
                <TableCell>2h 45m</TableCell>
                <TableCell>14h 30m</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Offline</span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
};
