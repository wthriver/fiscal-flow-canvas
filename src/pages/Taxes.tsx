
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Filter, Download, Search, FileText, CalendarIcon, Calculator, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Taxes: React.FC = () => {
  // Sample tax data
  const taxReports = [
    { 
      id: "TAX-001", 
      name: "Sales Tax Summary - Q1", 
      period: "Jan 1, 2025 - Mar 31, 2025",
      dueDate: "Apr 15, 2025",
      taxAmount: "$3,245.67",
      status: "Filed",
      paymentStatus: "Paid" 
    },
    { 
      id: "TAX-002", 
      name: "Payroll Tax - Q1", 
      period: "Jan 1, 2025 - Mar 31, 2025",
      dueDate: "Apr 30, 2025",
      taxAmount: "$12,876.45",
      status: "Prepared",
      paymentStatus: "Pending" 
    },
    { 
      id: "TAX-003", 
      name: "Income Tax Estimate - Q1", 
      period: "Jan 1, 2025 - Mar 31, 2025",
      dueDate: "Apr 15, 2025",
      taxAmount: "$5,670.00",
      status: "Filed",
      paymentStatus: "Paid" 
    },
    { 
      id: "TAX-004", 
      name: "Sales Tax Summary - Q2", 
      period: "Apr 1, 2025 - Jun 30, 2025",
      dueDate: "Jul 15, 2025",
      taxAmount: "$0.00",
      status: "Not Started",
      paymentStatus: "N/A" 
    },
    { 
      id: "TAX-005", 
      name: "Annual Property Tax", 
      period: "Jan 1, 2025 - Dec 31, 2025",
      dueDate: "Nov 30, 2025",
      taxAmount: "$4,500.00",
      status: "Not Started",
      paymentStatus: "N/A" 
    },
  ];

  // Sample tax rates
  const taxRates = [
    { id: 1, name: "Standard Sales Tax", jurisdiction: "State", rate: "6.25%", type: "Sales" },
    { id: 2, name: "City Sales Tax", jurisdiction: "City", rate: "1.5%", type: "Sales" },
    { id: 3, name: "County Sales Tax", jurisdiction: "County", rate: "0.5%", type: "Sales" },
    { id: 4, name: "Medicare", jurisdiction: "Federal", rate: "1.45%", type: "Payroll" },
    { id: 5, name: "Social Security", jurisdiction: "Federal", rate: "6.2%", type: "Payroll" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Taxes</h1>
          <p className="text-muted-foreground">Manage your tax rates, reports and filings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Calculator size={16} />
            <span>Tax Calculator</span>
          </Button>
          <Button className="flex items-center gap-2">
            <PlusCircle size={16} />
            <span>New Tax Rate</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-green-500">$15,715.67</CardTitle>
            <CardDescription>Year-to-Date Taxes Paid</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-amber-500">$12,876.45</CardTitle>
            <CardDescription>Pending Tax Payments</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-red-500">Apr 15</CardTitle>
            <CardDescription>Next Tax Deadline</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">8</CardTitle>
            <CardDescription>Tax Forms Due This Year</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Tax Reports and Filings</CardTitle>
          <CardDescription>Manage your tax reports and deadlines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-4">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tax reports..."
                className="w-full sm:w-[300px] pl-8"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <CalendarIcon size={16} />
                <span>Filter by Period</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download size={16} />
                <span>Export</span>
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Tax Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taxReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell>{report.period}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {report.dueDate}
                      {new Date(report.dueDate) <= new Date() && report.status !== "Filed" && (
                        <AlertCircle size={16} className="text-red-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{report.taxAmount}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      report.status === "Filed" 
                        ? "bg-green-100 text-green-800" 
                        : report.status === "Prepared" 
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-gray-100 text-gray-800"
                    }`}>
                      {report.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      report.paymentStatus === "Paid" 
                        ? "bg-green-100 text-green-800" 
                        : report.paymentStatus === "Pending" 
                          ? "bg-yellow-100 text-yellow-800" 
                          : "bg-gray-100 text-gray-800"
                    }`}>
                      {report.paymentStatus}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <FileText size={16} />
                      <span className="sr-only">View</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Tax Rates</CardTitle>
          <CardDescription>Manage your tax rates for different jurisdictions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Jurisdiction</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taxRates.map((rate) => (
                <TableRow key={rate.id}>
                  <TableCell className="font-medium">{rate.name}</TableCell>
                  <TableCell>{rate.jurisdiction}</TableCell>
                  <TableCell>{rate.rate}</TableCell>
                  <TableCell>{rate.type}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
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

export default Taxes;
