
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, FileText, PlusCircle, Search } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";

const Taxes: React.FC = () => {
  const { currentCompany } = useCompany();
  const [activeTab, setActiveTab] = useState("tax-reports");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Calculate total taxes due
  const totalTaxesDue = currentCompany.taxReports.reduce((total, report) => {
    if (report.status === "Pending" && (!report.paymentStatus || report.paymentStatus === "Not Paid")) {
      const amount = parseFloat(report.amount.replace(/[^0-9.-]+/g, ""));
      return total + amount;
    }
    return total;
  }, 0);
  
  // Calculate paid taxes
  const totalTaxesPaid = currentCompany.taxReports.reduce((total, report) => {
    if (report.paymentStatus === "Paid") {
      const amount = parseFloat(report.amount.replace(/[^0-9.-]+/g, ""));
      return total + amount;
    }
    return total;
  }, 0);

  // Filter tax reports based on search term
  const filteredTaxReports = currentCompany.taxReports.filter(report => 
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.period.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Filter tax rates based on search term
  const filteredTaxRates = currentCompany.taxRates.filter(rate => 
    rate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (rate.jurisdiction && rate.jurisdiction.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleFileTaxReturn = () => {
    toast.info("File tax return dialog would open here");
  };
  
  const handleAddTaxRate = () => {
    toast.info("Add tax rate dialog would open here");
  };
  
  const handlePayTax = (id: string) => {
    toast.success(`Payment process initiated for tax report ${id}`);
  };
  
  const handleDownloadReport = (id: string) => {
    toast.success(`Downloading tax report ${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Taxes</h1>
          <p className="text-muted-foreground">Manage your tax obligations and settings</p>
        </div>
        <Button className="flex items-center gap-2" onClick={handleFileTaxReturn}>
          <FileText size={16} />
          <span>File Tax Return</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">${totalTaxesDue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</CardTitle>
            <CardDescription>Taxes Due</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-green-500">${totalTaxesPaid.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</CardTitle>
            <CardDescription>Taxes Paid YTD</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-amber-500">{filteredTaxReports.filter(r => new Date(r.dueDate) <= new Date(new Date().setDate(new Date().getDate() + 30))).length}</CardTitle>
            <CardDescription>Returns Due Soon</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search taxes..."
            className="w-full sm:w-[300px] pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select defaultValue="current-year">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-year">Current Year</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <CalendarIcon size={16} />
            <span>Date Range</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tax-reports">Tax Reports</TabsTrigger>
          <TabsTrigger value="tax-rates">Tax Rates</TabsTrigger>
        </TabsList>
        <TabsContent value="tax-reports">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Tax Reports</CardTitle>
              <CardDescription>View and manage your tax filings and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTaxReports.length > 0 ? (
                    filteredTaxReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.name}</TableCell>
                        <TableCell>{report.period}</TableCell>
                        <TableCell>{report.dueDate}</TableCell>
                        <TableCell>{report.amount}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            report.status === "Filed" 
                              ? "bg-green-100 text-green-800" 
                              : report.status === "Pending" 
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                          }`}>
                            {report.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            report.paymentStatus === "Paid" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {report.paymentStatus || "Not Paid"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDownloadReport(report.id)}
                            >
                              View
                            </Button>
                            {(!report.paymentStatus || report.paymentStatus !== "Paid") && (
                              <Button 
                                size="sm" 
                                onClick={() => handlePayTax(report.id)}
                              >
                                Pay
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                        No tax reports found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tax-rates">
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle>Tax Rates</CardTitle>
                <CardDescription>Configure tax rates for different jurisdictions</CardDescription>
              </div>
              <Button size="sm" onClick={handleAddTaxRate}>
                <PlusCircle size={16} className="mr-2" />
                Add Tax Rate
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Jurisdiction</TableHead>
                    <TableHead>Effective Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTaxRates.length > 0 ? (
                    filteredTaxRates.map((rate) => (
                      <TableRow key={rate.id}>
                        <TableCell className="font-medium">{rate.name}</TableCell>
                        <TableCell>{rate.rate.toFixed(2)}%</TableCell>
                        <TableCell>{rate.type}</TableCell>
                        <TableCell>{rate.jurisdiction || "All"}</TableCell>
                        <TableCell>{rate.effectiveDate}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No tax rates found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Taxes;
