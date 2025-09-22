import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Calendar, Mail, Download, Play, Pause, Settings, Clock } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";

interface ScheduledReport {
  id: string;
  name: string;
  reportType: string;
  frequency: "daily" | "weekly" | "monthly" | "quarterly" | "annually";
  schedule: {
    dayOfWeek?: number; // 0-6 for weekly
    dayOfMonth?: number; // 1-31 for monthly
    time: string; // HH:MM format
  };
  recipients: string[];
  format: "pdf" | "csv" | "excel";
  active: boolean;
  filters: {
    dateRange?: string;
    customers?: string[];
    categories?: string[];
  };
  lastRun?: string;
  nextRun: string;
  createdDate: string;
  description: string;
}

interface ReportTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  parameters: string[];
}

export const ScheduledReports: React.FC = () => {
  const { currentCompany, updateCompany } = useCompany();
  const [activeTab, setActiveTab] = useState("scheduled");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<ScheduledReport | null>(null);

  // Sample scheduled reports data
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([
    {
      id: "sched-1",
      name: "Monthly Financial Summary",
      reportType: "financial-summary",
      frequency: "monthly",
      schedule: { dayOfMonth: 1, time: "09:00" },
      recipients: ["cfo@company.com", "accountant@company.com"],
      format: "pdf",
      active: true,
      filters: { dateRange: "last-month" },
      lastRun: "2024-01-01",
      nextRun: "2024-02-01",
      createdDate: "2023-12-15",
      description: "Comprehensive monthly financial report"
    },
    {
      id: "sched-2",
      name: "Weekly Sales Report",
      reportType: "sales-summary",
      frequency: "weekly",
      schedule: { dayOfWeek: 1, time: "08:00" }, // Monday
      recipients: ["sales@company.com", "manager@company.com"],
      format: "excel",
      active: true,
      filters: { dateRange: "last-week" },
      lastRun: "2024-01-15",
      nextRun: "2024-01-22",
      createdDate: "2024-01-01",
      description: "Weekly sales performance and customer activity"
    },
    {
      id: "sched-3",
      name: "Quarterly P&L Statement",
      reportType: "profit-loss",
      frequency: "quarterly",
      schedule: { dayOfMonth: 5, time: "10:00" },
      recipients: ["board@company.com"],
      format: "pdf",
      active: false,
      filters: { dateRange: "last-quarter" },
      nextRun: "2024-04-05",
      createdDate: "2023-10-01",
      description: "Quarterly profit and loss analysis"
    }
  ]);

  // Available report templates
  const reportTemplates: ReportTemplate[] = [
    {
      id: "financial-summary",
      name: "Financial Summary",
      category: "Financial",
      description: "Complete overview of financial performance",
      parameters: ["dateRange", "includeComparisons", "breakdown"]
    },
    {
      id: "sales-summary",
      name: "Sales Summary",
      category: "Sales",
      description: "Sales performance and customer metrics",
      parameters: ["dateRange", "customerGroups", "productCategories"]
    },
    {
      id: "profit-loss",
      name: "Profit & Loss Statement",
      category: "Financial",
      description: "Detailed P&L statement with comparisons",
      parameters: ["dateRange", "departmentBreakdown", "previousPeriodComparison"]
    },
    {
      id: "cash-flow",
      name: "Cash Flow Statement",
      category: "Financial",
      description: "Cash flow analysis and projections",
      parameters: ["dateRange", "includeProjections", "categoryBreakdown"]
    },
    {
      id: "customer-aging",
      name: "Customer Aging Report",
      category: "Receivables",
      description: "Outstanding customer balances by age",
      parameters: ["asOfDate", "customerGroups", "includePastDue"]
    },
    {
      id: "inventory-valuation",
      name: "Inventory Valuation",
      category: "Inventory",
      description: "Current inventory values and quantities",
      parameters: ["asOfDate", "locations", "costingMethod"]
    },
    {
      id: "expense-analysis",
      name: "Expense Analysis",
      category: "Expenses",
      description: "Expense breakdown and trend analysis",
      parameters: ["dateRange", "categories", "departments"]
    }
  ];

  const [newReport, setNewReport] = useState<Partial<ScheduledReport>>({
    name: "",
    reportType: "",
    frequency: "monthly",
    schedule: { time: "09:00" },
    recipients: [],
    format: "pdf",
    active: true,
    filters: {},
    description: ""
  });

  const [recipientEmail, setRecipientEmail] = useState("");

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case "daily": return "bg-red-100 text-red-800";
      case "weekly": return "bg-blue-100 text-blue-800";
      case "monthly": return "bg-green-100 text-green-800";
      case "quarterly": return "bg-purple-100 text-purple-800";
      case "annually": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDayName = (dayOfWeek: number) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[dayOfWeek];
  };

  const formatSchedule = (report: ScheduledReport) => {
    const time = report.schedule.time;
    switch (report.frequency) {
      case "daily":
        return `Daily at ${time}`;
      case "weekly":
        return `${getDayName(report.schedule.dayOfWeek!)} at ${time}`;
      case "monthly":
        return `Day ${report.schedule.dayOfMonth} of each month at ${time}`;
      case "quarterly":
        return `Day ${report.schedule.dayOfMonth} of each quarter at ${time}`;
      case "annually":
        return `Day ${report.schedule.dayOfMonth} annually at ${time}`;
      default:
        return "Not scheduled";
    }
  };

  const handleSaveReport = () => {
    if (!newReport.name || !newReport.reportType) {
      toast.error("Please fill in required fields");
      return;
    }

    // Calculate next run date based on frequency and schedule
    const nextRun = calculateNextRun(newReport.frequency!, newReport.schedule!);

    const report: ScheduledReport = {
      id: editingReport ? editingReport.id : `sched-${Date.now()}`,
      name: newReport.name!,
      reportType: newReport.reportType!,
      frequency: newReport.frequency!,
      schedule: newReport.schedule!,
      recipients: newReport.recipients!,
      format: newReport.format!,
      active: newReport.active!,
      filters: newReport.filters!,
      nextRun,
      createdDate: editingReport ? editingReport.createdDate : new Date().toISOString().split('T')[0],
      description: newReport.description!
    };

    if (editingReport) {
      setScheduledReports(prev => prev.map(r => r.id === report.id ? report : r));
      toast.success("Scheduled report updated successfully");
    } else {
      setScheduledReports(prev => [...prev, report]);
      toast.success("Scheduled report created successfully");
    }

    setIsDialogOpen(false);
    setEditingReport(null);
    resetForm();
  };

  const calculateNextRun = (frequency: string, schedule: any): string => {
    const now = new Date();
    const nextRun = new Date();

    switch (frequency) {
      case "daily":
        nextRun.setDate(now.getDate() + 1);
        break;
      case "weekly":
        const daysUntilTarget = (schedule.dayOfWeek + 7 - now.getDay()) % 7;
        nextRun.setDate(now.getDate() + (daysUntilTarget || 7));
        break;
      case "monthly":
        nextRun.setMonth(now.getMonth() + 1);
        nextRun.setDate(schedule.dayOfMonth);
        break;
      case "quarterly":
        nextRun.setMonth(now.getMonth() + 3);
        nextRun.setDate(schedule.dayOfMonth);
        break;
      case "annually":
        nextRun.setFullYear(now.getFullYear() + 1);
        nextRun.setDate(schedule.dayOfMonth);
        break;
    }

    const [hours, minutes] = schedule.time.split(':');
    nextRun.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    return nextRun.toISOString().split('T')[0];
  };

  const resetForm = () => {
    setNewReport({
      name: "",
      reportType: "",
      frequency: "monthly",
      schedule: { time: "09:00" },
      recipients: [],
      format: "pdf",
      active: true,
      filters: {},
      description: ""
    });
    setRecipientEmail("");
  };

  const handleEditReport = (report: ScheduledReport) => {
    setEditingReport(report);
    setNewReport(report);
    setIsDialogOpen(true);
  };

  const handleDeleteReport = (reportId: string) => {
    setScheduledReports(prev => prev.filter(r => r.id !== reportId));
    toast.success("Scheduled report deleted successfully");
  };

  const toggleReportStatus = (reportId: string) => {
    setScheduledReports(prev => prev.map(report => 
      report.id === reportId ? { ...report, active: !report.active } : report
    ));
    toast.success("Report status updated");
  };

  const handleRunNow = (reportId: string) => {
    const report = scheduledReports.find(r => r.id === reportId);
    if (report) {
      // Simulate running the report
      setScheduledReports(prev => prev.map(r => 
        r.id === reportId ? { ...r, lastRun: new Date().toISOString().split('T')[0] } : r
      ));
      toast.success(`Running ${report.name} report now...`);
    }
  };

  const addRecipient = () => {
    if (recipientEmail && !newReport.recipients?.includes(recipientEmail)) {
      setNewReport(prev => ({
        ...prev,
        recipients: [...(prev.recipients || []), recipientEmail]
      }));
      setRecipientEmail("");
    }
  };

  const removeRecipient = (email: string) => {
    setNewReport(prev => ({
      ...prev,
      recipients: (prev.recipients || []).filter(r => r !== email)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Scheduled Reports</h1>
          <p className="text-muted-foreground">
            Automate report generation and delivery
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Scheduled Report
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Reports</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledReports.filter(r => r.active).length}</div>
            <p className="text-xs text-muted-foreground">Currently scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports Delivered</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Report</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Tomorrow</div>
            <p className="text-xs text-muted-foreground">Weekly Sales Report</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recipients</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Unique email addresses</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="history">Delivery History</TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Manage automated report generation and delivery</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Last Run</TableHead>
                    <TableHead>Next Run</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduledReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.name}</TableCell>
                      <TableCell>
                        {reportTemplates.find(t => t.id === report.reportType)?.name || report.reportType}
                      </TableCell>
                      <TableCell>
                        <Badge className={getFrequencyColor(report.frequency)}>
                          {report.frequency}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{formatSchedule(report)}</TableCell>
                      <TableCell>{report.recipients.length} recipients</TableCell>
                      <TableCell>{report.lastRun || "Never"}</TableCell>
                      <TableCell>{report.nextRun}</TableCell>
                      <TableCell>
                        <Switch
                          checked={report.active}
                          onCheckedChange={() => toggleReportStatus(report.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRunNow(report.id)}
                            title="Run now"
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditReport(report)}
                            title="Edit"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteReport(report.id)}
                            title="Delete"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Available Report Templates</CardTitle>
              <CardDescription>Standard report formats available for scheduling</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportTemplates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.category}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                      <div className="space-y-1">
                        <p className="text-xs font-medium">Parameters:</p>
                        {template.parameters.map((param) => (
                          <Badge key={param} variant="outline" className="text-xs mr-1">
                            {param}
                          </Badge>
                        ))}
                      </div>
                      <Button 
                        className="w-full mt-3" 
                        variant="outline"
                        onClick={() => {
                          setNewReport(prev => ({ ...prev, reportType: template.id }));
                          setIsDialogOpen(true);
                        }}
                      >
                        Schedule This Report
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Delivery History</CardTitle>
              <CardDescription>Recent report deliveries and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Monthly Financial Summary</p>
                    <p className="text-sm text-muted-foreground">Delivered to 2 recipients • Jan 1, 2024 at 9:00 AM</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Delivered</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Weekly Sales Report</p>
                    <p className="text-sm text-muted-foreground">Delivered to 2 recipients • Jan 15, 2024 at 8:00 AM</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Delivered</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Customer Aging Report</p>
                    <p className="text-sm text-muted-foreground">Failed delivery • Jan 10, 2024 at 10:00 AM</p>
                  </div>
                  <Badge className="bg-red-100 text-red-800">Failed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New/Edit Scheduled Report Dialog */}
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {editingReport ? "Edit Scheduled Report" : "Create New Scheduled Report"}
          </DialogTitle>
          <DialogDescription>
            Set up automated report generation and delivery
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="report-name">Report Name</Label>
              <Input
                id="report-name"
                value={newReport.name || ""}
                onChange={(e) => setNewReport(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter report name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="report-type">Report Type</Label>
              <Select 
                value={newReport.reportType} 
                onValueChange={(value) => setNewReport(prev => ({ ...prev, reportType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTemplates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name} - {template.category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={newReport.description || ""}
              onChange={(e) => setNewReport(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the report"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select 
                value={newReport.frequency} 
                onValueChange={(value) => setNewReport(prev => ({ 
                  ...prev, 
                  frequency: value as any,
                  schedule: { ...prev.schedule, dayOfWeek: undefined, dayOfMonth: undefined }
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {newReport.frequency === "weekly" && (
              <div className="space-y-2">
                <Label htmlFor="day-of-week">Day of Week</Label>
                <Select 
                  value={newReport.schedule?.dayOfWeek?.toString()} 
                  onValueChange={(value) => setNewReport(prev => ({ 
                    ...prev, 
                    schedule: { ...prev.schedule!, dayOfWeek: parseInt(value) }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Sunday</SelectItem>
                    <SelectItem value="1">Monday</SelectItem>
                    <SelectItem value="2">Tuesday</SelectItem>
                    <SelectItem value="3">Wednesday</SelectItem>
                    <SelectItem value="4">Thursday</SelectItem>
                    <SelectItem value="5">Friday</SelectItem>
                    <SelectItem value="6">Saturday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {(newReport.frequency === "monthly" || newReport.frequency === "quarterly" || newReport.frequency === "annually") && (
              <div className="space-y-2">
                <Label htmlFor="day-of-month">Day of Month</Label>
                <Input
                  id="day-of-month"
                  type="number"
                  min="1"
                  max="31"
                  value={newReport.schedule?.dayOfMonth || ""}
                  onChange={(e) => setNewReport(prev => ({ 
                    ...prev, 
                    schedule: { ...prev.schedule!, dayOfMonth: parseInt(e.target.value) }
                  }))}
                  placeholder="Day"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={newReport.schedule?.time || "09:00"}
                onChange={(e) => setNewReport(prev => ({ 
                  ...prev, 
                  schedule: { ...prev.schedule!, time: e.target.value }
                }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="format">Format</Label>
              <Select 
                value={newReport.format} 
                onValueChange={(value) => setNewReport(prev => ({ ...prev, format: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 mt-8">
              <Switch
                id="active"
                checked={newReport.active}
                onCheckedChange={(checked) => setNewReport(prev => ({ ...prev, active: checked }))}
              />
              <Label htmlFor="active">Active</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Recipients</Label>
            <div className="flex gap-2">
              <Input
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="Enter email address"
                onKeyPress={(e) => e.key === 'Enter' && addRecipient()}
              />
              <Button type="button" onClick={addRecipient}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {(newReport.recipients || []).map((email) => (
                <Badge key={email} variant="secondary" className="flex items-center gap-1">
                  {email}
                  <button 
                    onClick={() => removeRecipient(email)}
                    className="ml-1 text-xs hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveReport}>
            {editingReport ? "Update Report" : "Create Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </div>
  );
};