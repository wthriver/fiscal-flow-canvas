import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  BarChart3, 
  PieChart, 
  LineChart, 
  Table, 
  Download, 
  Save, 
  Play, 
  Calendar,
  Filter,
  Layout,
  Database,
  Settings,
  Eye,
  Share,
  Copy,
  Trash2
} from "lucide-react";

export const AdvancedReportBuilder = () => {
  const [selectedDataSource, setSelectedDataSource] = useState("transactions");
  const [reportType, setReportType] = useState("table");
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  const dataSources = [
    { id: "transactions", name: "Transactions", description: "Bank and cash transactions" },
    { id: "invoices", name: "Invoices", description: "Customer invoices and billing" },
    { id: "expenses", name: "Expenses", description: "Business expenses and bills" },
    { id: "customers", name: "Customers", description: "Customer information and activity" },
    { id: "vendors", name: "Vendors", description: "Vendor information and payments" },
    { id: "inventory", name: "Inventory", description: "Stock and inventory data" },
    { id: "payroll", name: "Payroll", description: "Employee payroll information" },
    { id: "accounts", name: "Chart of Accounts", description: "General ledger accounts" }
  ];

  const availableFields = {
    transactions: [
      { id: "date", name: "Date", type: "date" },
      { id: "description", name: "Description", type: "text" },
      { id: "amount", name: "Amount", type: "currency" },
      { id: "account", name: "Account", type: "text" },
      { id: "category", name: "Category", type: "text" },
      { id: "reference", name: "Reference", type: "text" }
    ],
    invoices: [
      { id: "invoice_number", name: "Invoice Number", type: "text" },
      { id: "customer", name: "Customer", type: "text" },
      { id: "date", name: "Invoice Date", type: "date" },
      { id: "due_date", name: "Due Date", type: "date" },
      { id: "amount", name: "Amount", type: "currency" },
      { id: "status", name: "Status", type: "text" }
    ],
    expenses: [
      { id: "date", name: "Date", type: "date" },
      { id: "vendor", name: "Vendor", type: "text" },
      { id: "amount", name: "Amount", type: "currency" },
      { id: "category", name: "Category", type: "text" },
      { id: "description", name: "Description", type: "text" }
    ]
  };

  const reportTemplates = [
    {
      id: "profit-loss",
      name: "Profit & Loss",
      description: "Revenue and expenses breakdown",
      icon: BarChart3,
      category: "Financial"
    },
    {
      id: "cash-flow",
      name: "Cash Flow Statement",
      description: "Cash inflows and outflows",
      icon: LineChart,
      category: "Financial"
    },
    {
      id: "customer-aging", 
      name: "Customer Aging",
      description: "Outstanding receivables by age",
      icon: Table,
      category: "AR/AP"
    },
    {
      id: "vendor-spending",
      name: "Vendor Spending",
      description: "Top vendors by spending",
      icon: PieChart,
      category: "Expenses"
    },
    {
      id: "sales-analysis",
      name: "Sales Analysis",
      description: "Sales trends and performance",
      icon: LineChart,
      category: "Sales"
    },
    {
      id: "expense-categories",
      name: "Expense Categories",
      description: "Expenses breakdown by category",
      icon: PieChart,
      category: "Expenses"
    }
  ];

  const savedReports = [
    {
      id: 1,
      name: "Monthly Revenue Report",
      description: "Monthly revenue breakdown by customer",
      lastRun: "2 hours ago",
      schedule: "Monthly",
      owner: "Admin"
    },
    {
      id: 2,
      name: "Top 10 Customers",
      description: "Highest value customers analysis",
      lastRun: "1 day ago", 
      schedule: "Weekly",
      owner: "Sales Manager"
    },
    {
      id: 3,
      name: "Expense Trend Analysis",
      description: "Quarterly expense trends",
      lastRun: "3 days ago",
      schedule: "Quarterly",
      owner: "CFO"
    }
  ];

  const kpiMetrics = [
    { name: "Total Revenue", value: "$245,670", change: "+12.5%", trend: "up" },
    { name: "Net Profit Margin", value: "18.3%", change: "+2.1%", trend: "up" },
    { name: "Operating Expenses", value: "$89,420", change: "-5.2%", trend: "down" },
    { name: "Customer Count", value: "156", change: "+8.7%", trend: "up" },
    { name: "Average Invoice", value: "$1,247", change: "+3.4%", trend: "up" },
    { name: "Days Sales Outstanding", value: "28 days", change: "-2 days", trend: "down" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Advanced Report Builder</h2>
          <p className="text-muted-foreground">Create custom reports and dashboards</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save Report
          </Button>
          <Button>
            <Play className="h-4 w-4 mr-2" />
            Run Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="builder" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="builder">Report Builder</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="saved">Saved Reports</TabsTrigger>
          <TabsTrigger value="dashboard">KPI Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Data Source</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={selectedDataSource} onValueChange={setSelectedDataSource}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dataSources.map((source) => (
                        <SelectItem key={source.id} value={source.id}>
                          {source.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    {dataSources.find(s => s.id === selectedDataSource)?.description}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Report Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant={reportType === "table" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setReportType("table")}
                    >
                      <Table className="h-4 w-4 mr-2" />
                      Table
                    </Button>
                    <Button 
                      variant={reportType === "chart" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setReportType("chart")}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Chart
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Fields</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {(availableFields[selectedDataSource as keyof typeof availableFields] || []).map((field) => (
                      <div key={field.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={field.id}
                          checked={selectedFields.includes(field.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedFields([...selectedFields, field.id]);
                            } else {
                              setSelectedFields(selectedFields.filter(f => f !== field.id));
                            }
                          }}
                        />
                        <Label htmlFor={field.id} className="text-sm">
                          {field.name}
                        </Label>
                        <Badge variant="outline" className="text-xs">
                          {field.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Report Preview</CardTitle>
                  <CardDescription>Live preview of your report</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/30 border-2 border-dashed border-muted rounded-lg p-8 text-center">
                    <Layout className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {selectedFields.length > 0 
                        ? `Preview will show ${selectedFields.length} selected fields from ${selectedDataSource}`
                        : "Select fields from the left panel to build your report"
                      }
                    </p>
                    {selectedFields.length > 0 && (
                      <div className="mt-4">
                        <Button variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          Generate Preview
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Filters & Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Date Range</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="quarter">This Quarter</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Group By</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Group results" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Grouping</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="category">Category</SelectItem>
                      <SelectItem value="account">Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Sort By</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort results" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date-desc">Date (Newest)</SelectItem>
                      <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                      <SelectItem value="amount-desc">Amount (High to Low)</SelectItem>
                      <SelectItem value="amount-asc">Amount (Low to High)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTemplates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <template.icon className="h-8 w-8 text-primary" />
                    <Badge variant="outline">{template.category}</Badge>
                  </div>
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button size="sm" className="flex-1">
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Saved Reports</CardTitle>
              <CardDescription>Manage your saved and scheduled reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {savedReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{report.name}</h4>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Last run: {report.lastRun}</span>
                        <span>Schedule: {report.schedule}</span>
                        <span>Owner: {report.owner}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Run
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4 mr-2" />
                        Clone
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Executive KPI Dashboard</CardTitle>
              <CardDescription>Key performance indicators and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {kpiMetrics.map((metric, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">{metric.name}</p>
                          <p className="text-2xl font-bold">{metric.value}</p>
                        </div>
                        <div className={`text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {metric.change}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 border border-dashed border-muted rounded p-8 text-center">
                  <LineChart className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Revenue trend chart would appear here</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 border border-dashed border-muted rounded p-8 text-center">
                  <PieChart className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Expense breakdown chart would appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};