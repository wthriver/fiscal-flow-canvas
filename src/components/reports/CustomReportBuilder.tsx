
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, LineChart, BarChart, PieChart, SaveIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { exportToCSV, exportToExcel } from "@/utils/exportUtils";

export const CustomReportBuilder = () => {
  const [reportName, setReportName] = useState<string>("");
  const [reportType, setReportType] = useState<string>("financial");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [chartType, setChartType] = useState<string>("bar");
  const [columns, setColumns] = useState<{ id: string; name: string; selected: boolean }[]>([
    { id: "account", name: "Account", selected: true },
    { id: "debit", name: "Debit", selected: true },
    { id: "credit", name: "Credit", selected: true },
    { id: "balance", name: "Balance", selected: true },
    { id: "date", name: "Date", selected: true },
    { id: "description", name: "Description", selected: true }
  ]);
  const [filters, setFilters] = useState<{ id: string; field: string; operator: string; value: string }[]>([
    { id: "filter-1", field: "", operator: "equals", value: "" }
  ]);

  const reportTypes = [
    { id: "financial", name: "Financial" },
    { id: "customer", name: "Customer" },
    { id: "vendor", name: "Vendor" },
    { id: "inventory", name: "Inventory" },
    { id: "tax", name: "Tax" }
  ];

  const accounts = [
    "Cash", "Accounts Receivable", "Inventory", "Equipment", 
    "Accounts Payable", "Revenue", "Cost of Goods Sold", 
    "Rent Expense", "Utilities Expense", "Salaries Expense"
  ];

  const filterOperators = [
    { id: "equals", name: "Equals" },
    { id: "contains", name: "Contains" },
    { id: "greater", name: "Greater Than" },
    { id: "less", name: "Less Than" },
    { id: "between", name: "Between" }
  ];

  const addFilter = () => {
    setFilters([
      ...filters, 
      { id: `filter-${filters.length + 1}`, field: "", operator: "equals", value: "" }
    ]);
  };

  const removeFilter = (id: string) => {
    setFilters(filters.filter(filter => filter.id !== id));
  };

  const updateFilter = (id: string, key: string, value: string) => {
    setFilters(filters.map(filter => 
      filter.id === id ? { ...filter, [key]: value } : filter
    ));
  };

  const toggleColumn = (id: string) => {
    setColumns(columns.map(column => 
      column.id === id ? { ...column, selected: !column.selected } : column
    ));
  };

  const handleGenerateReport = () => {
    if (!reportName) {
      toast.error("Please enter a report name");
      return;
    }

    if (!startDate || !endDate) {
      toast.error("Please select start and end dates");
      return;
    }

    if (selectedAccounts.length === 0) {
      toast.error("Please select at least one account");
      return;
    }

    // Generate mock data
    const mockData = [];
    for (let i = 0; i < 10; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      const account = selectedAccounts[Math.floor(Math.random() * selectedAccounts.length)];
      const debit = Math.random() > 0.5 ? Math.floor(Math.random() * 10000) : 0;
      const credit = debit === 0 ? Math.floor(Math.random() * 10000) : 0;
      
      mockData.push({
        date: format(date, "yyyy-MM-dd"),
        account,
        description: `Transaction for ${account}`,
        debit,
        credit,
        balance: debit - credit
      });
    }

    toast.success("Report generated successfully");
    
    // In a real app, we would display the report here
    setPreviewData(mockData);
  };

  const [previewData, setPreviewData] = useState<any[]>([]);

  const handleExport = (format: string) => {
    if (previewData.length === 0) {
      toast.error("No data to export");
      return;
    }

    const selectedColumnIds = columns
      .filter(col => col.selected)
      .map(col => col.id);

    const exportData = previewData.map(row => {
      const exportRow: Record<string, any> = {};
      selectedColumnIds.forEach(colId => {
        if (row[colId] !== undefined) {
          exportRow[colId] = row[colId];
        }
      });
      return exportRow;
    });

    if (format === 'csv') {
      exportToCSV(exportData, `${reportName}_${format(new Date(), "yyyy-MM-dd")}`);
    } else if (format === 'excel') {
      exportToExcel(exportData, `${reportName}_${format(new Date(), "yyyy-MM-dd")}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Custom Report Builder</h2>
          <p className="text-muted-foreground">Build tailored reports for your specific needs</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('csv')}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport('excel')}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Button onClick={handleGenerateReport}>
            <LineChart className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="reportName">Report Name</Label>
                <Input 
                  id="reportName" 
                  value={reportName} 
                  onChange={(e) => setReportName(e.target.value)} 
                  placeholder="Enter report name"
                />
              </div>
              <div>
                <Label htmlFor="reportType">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map(type => (
                      <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Date Range</Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "End date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div>
                <Label>Accounts</Label>
                <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
                  {accounts.map(account => (
                    <div key={account} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`account-${account}`}
                        checked={selectedAccounts.includes(account)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedAccounts([...selectedAccounts, account]);
                          } else {
                            setSelectedAccounts(selectedAccounts.filter(a => a !== account));
                          }
                        }}
                      />
                      <Label htmlFor={`account-${account}`}>{account}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Display Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Chart Type</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <Button 
                    variant={chartType === "bar" ? "default" : "outline"} 
                    className="flex flex-col items-center py-3"
                    onClick={() => setChartType("bar")}
                  >
                    <BarChart className="h-5 w-5 mb-1" />
                    Bar
                  </Button>
                  <Button 
                    variant={chartType === "line" ? "default" : "outline"} 
                    className="flex flex-col items-center py-3"
                    onClick={() => setChartType("line")}
                  >
                    <LineChart className="h-5 w-5 mb-1" />
                    Line
                  </Button>
                  <Button 
                    variant={chartType === "pie" ? "default" : "outline"} 
                    className="flex flex-col items-center py-3"
                    onClick={() => setChartType("pie")}
                  >
                    <PieChart className="h-5 w-5 mb-1" />
                    Pie
                  </Button>
                </div>
              </div>
              <Separator />
              <div>
                <Label>Columns</Label>
                <div className="mt-2 space-y-2">
                  {columns.map(column => (
                    <div key={column.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`column-${column.id}`}
                        checked={column.selected}
                        onCheckedChange={() => toggleColumn(column.id)}
                      />
                      <Label htmlFor={`column-${column.id}`}>{column.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Filters</CardTitle>
              <Button size="sm" variant="outline" onClick={addFilter}>
                <Plus className="h-4 w-4 mr-1" /> Add Filter
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filters.map(filter => (
                  <div key={filter.id} className="flex items-center gap-2">
                    <Select 
                      value={filter.field} 
                      onValueChange={(value) => updateFilter(filter.id, "field", value)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        {columns.map(column => (
                          <SelectItem key={column.id} value={column.id}>{column.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select 
                      value={filter.operator} 
                      onValueChange={(value) => updateFilter(filter.id, "operator", value)}
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {filterOperators.map(op => (
                          <SelectItem key={op.id} value={op.id}>{op.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input 
                      value={filter.value}
                      onChange={(e) => updateFilter(filter.id, "value", e.target.value)}
                      placeholder="Value"
                      className="flex-1"
                    />
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeFilter(filter.id)}
                      disabled={filters.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {previewData.length > 0 ? (
                <div className="border rounded-md overflow-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {columns.filter(col => col.selected).map(column => (
                          <th 
                            key={column.id}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {column.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {previewData.map((row, index) => (
                        <tr key={index}>
                          {columns.filter(col => col.selected).map(column => (
                            <td 
                              key={column.id}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                            >
                              {column.id === 'debit' || column.id === 'credit' || column.id === 'balance' 
                                ? `$${Number(row[column.id]).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                                : row[column.id]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <LineChart className="h-12 w-12 mb-4 opacity-20" />
                  <p>Click "Generate Report" to see a preview of your report</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
