
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Filter, Download, Search, FileText, CalendarIcon, Calculator, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";

const Taxes: React.FC = () => {
  const { currentCompany } = useCompany();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter tax reports based on search term
  const filteredTaxReports = currentCompany.taxReports?.filter(report => 
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    report.id.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Tax rate data from the current company
  const taxRates = currentCompany.taxRates || [];

  // Calculate totals for the statistics cards
  const totalTaxesPaid = filteredTaxReports
    .filter(report => report.paymentStatus === "Paid")
    .reduce((sum, report) => {
      const amount = parseFloat(report.taxAmount.replace(/[^0-9.-]+/g, ""));
      return sum + amount;
    }, 0);

  const pendingTaxes = filteredTaxReports
    .filter(report => report.paymentStatus === "Pending")
    .reduce((sum, report) => {
      const amount = parseFloat(report.taxAmount.replace(/[^0-9.-]+/g, ""));
      return sum + amount;
    }, 0);

  // Find next tax deadline
  const upcomingDeadlines = filteredTaxReports
    .filter(report => {
      const dueDate = new Date(report.dueDate);
      const today = new Date();
      return dueDate >= today && report.status !== "Filed";
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const nextDeadline = upcomingDeadlines.length > 0 
    ? new Date(upcomingDeadlines[0].dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) 
    : "None";

  // Calculate total forms due this year
  const formsThisYear = filteredTaxReports.filter(report => {
    const dueDate = new Date(report.dueDate);
    const currentYear = new Date().getFullYear();
    return dueDate.getFullYear() === currentYear;
  }).length;

  const handleAddTaxRate = () => {
    toast.info(`Adding new tax rate for ${currentCompany.name}`);
  };

  const handleTaxCalculator = () => {
    toast.info(`Opening tax calculator for ${currentCompany.name}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Taxes</h1>
          <p className="text-muted-foreground">Manage {currentCompany.name}'s tax rates, reports and filings</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleTaxCalculator}
          >
            <Calculator size={16} />
            <span>Tax Calculator</span>
          </Button>
          <Button 
            className="flex items-center gap-2"
            onClick={handleAddTaxRate}
          >
            <PlusCircle size={16} />
            <span>New Tax Rate</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-green-500">${totalTaxesPaid.toLocaleString()}</CardTitle>
            <CardDescription>Year-to-Date Taxes Paid</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-amber-500">${pendingTaxes.toLocaleString()}</CardTitle>
            <CardDescription>Pending Tax Payments</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-red-500">{nextDeadline}</CardTitle>
            <CardDescription>Next Tax Deadline</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{formsThisYear}</CardTitle>
            <CardDescription>Tax Forms Due This Year</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Tax Reports and Filings</CardTitle>
          <CardDescription>Manage {currentCompany.name}'s tax reports and deadlines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-4">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tax reports..."
                className="w-full sm:w-[300px] pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
              {filteredTaxReports.length > 0 ? (
                filteredTaxReports.map((report) => (
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
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toast.info(`Viewing ${report.name} for ${currentCompany.name}`)}
                      >
                        <FileText size={16} />
                        <span className="sr-only">View</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    No tax reports found for {currentCompany.name}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Tax Rates</CardTitle>
          <CardDescription>Manage {currentCompany.name}'s tax rates for different jurisdictions</CardDescription>
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
              {taxRates.length > 0 ? (
                taxRates.map((rate) => (
                  <TableRow key={rate.id}>
                    <TableCell className="font-medium">{rate.name}</TableCell>
                    <TableCell>{rate.jurisdiction}</TableCell>
                    <TableCell>{rate.rate}</TableCell>
                    <TableCell>{rate.type}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toast.info(`Editing ${rate.name} for ${currentCompany.name}`)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    No tax rates found for {currentCompany.name}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Taxes;
