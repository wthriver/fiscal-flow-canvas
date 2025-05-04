import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, FileText, Download, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCompany } from "@/contexts/CompanyContext";
import { TaxCalculator } from "@/components/taxes/TaxCalculator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const Taxes: React.FC = () => {
  const { currentCompany, updateCompany } = useCompany();
  const [activeTab, setActiveTab] = useState("reports");

  const handleDownloadReport = (reportId: string) => {
    toast.success("Tax report downloaded successfully");
  };

  const handleViewReport = (reportId: string) => {
    toast.info("Viewing tax report", {
      description: "Report viewer would open here"
    });
  };

  const handleAddTaxRate = () => {
    const newTaxRate = {
      id: `tr-${Date.now()}`,
      name: `New Tax Rate ${currentCompany.taxRates.length + 1}`,
      rate: 7.0,
      type: "Sales",
      effectiveDate: new Date().toISOString().split('T')[0]
    };
    
    updateCompany(currentCompany.id, {
      taxRates: [...currentCompany.taxRates, newTaxRate]
    });
    
    toast.success("New tax rate added");
  };

  const handleEditTaxRate = (id: string, newRate: number) => {
    const updatedRates = currentCompany.taxRates.map(rate => 
      rate.id === id ? { ...rate, rate: newRate } : rate
    );
    
    updateCompany(currentCompany.id, { taxRates: updatedRates });
    toast.success("Tax rate updated");
  };

  const handleDeleteTaxRate = (id: string) => {
    const updatedRates = currentCompany.taxRates.filter(rate => rate.id !== id);
    updateCompany(currentCompany.id, { taxRates: updatedRates });
    toast.success("Tax rate deleted");
  };

  // Filter upcoming tax reports
  const upcomingReports = currentCompany.taxReports.filter(report => {
    const dueDate = new Date(report.dueDate);
    const today = new Date();
    return dueDate > today && report.status !== "Completed";
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Taxes</h1>
          <p className="text-muted-foreground">Manage {currentCompany.name}'s tax reports and rates</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="reports">Tax Reports</TabsTrigger>
              <TabsTrigger value="rates">Tax Rates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="reports" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>Upcoming Tax Reports</CardTitle>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>Schedule Report</span>
                    </Button>
                  </div>
                  <CardDescription>Tax reports due soon</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Report Name</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingReports.length > 0 ? (
                        upcomingReports.map((report) => {
                          const dueDate = new Date(report.dueDate);
                          const today = new Date();
                          const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                          const isUrgent = daysUntilDue <= 7;
                          
                          return (
                            <TableRow key={report.id}>
                              <TableCell className="font-medium">{report.name}</TableCell>
                              <TableCell>{report.period}</TableCell>
                              <TableCell className="flex items-center gap-1">
                                {report.dueDate}
                                {isUrgent && <AlertCircle size={16} className="text-red-500" />}
                              </TableCell>
                              <TableCell>{report.amount}</TableCell>
                              <TableCell>
                                <Badge className={
                                  report.status === "Completed" ? "bg-green-100 text-green-800" : 
                                  report.status === "In Progress" ? "bg-blue-100 text-blue-800" : 
                                  "bg-yellow-100 text-yellow-800"
                                }>
                                  {report.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8"
                                    onClick={() => handleViewReport(report.id)}
                                  >
                                    <FileText size={16} />
                                    <span className="sr-only">View</span>
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8"
                                    onClick={() => handleDownloadReport(report.id)}
                                  >
                                    <Download size={16} />
                                    <span className="sr-only">Download</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                            No upcoming tax reports
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Filing History</CardTitle>
                  <CardDescription>Previous tax filings</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Report Name</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Filed Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentCompany.taxReports.filter(report => report.status === "Completed").length > 0 ? (
                        currentCompany.taxReports
                          .filter(report => report.status === "Completed")
                          .map((report) => (
                            <TableRow key={report.id}>
                              <TableCell className="font-medium">{report.name}</TableCell>
                              <TableCell>{report.period}</TableCell>
                              <TableCell>{report.dueDate}</TableCell>
                              <TableCell>{report.amount}</TableCell>
                              <TableCell>
                                <Badge className="bg-green-100 text-green-800">
                                  {report.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8"
                                    onClick={() => handleViewReport(report.id)}
                                  >
                                    <FileText size={16} />
                                    <span className="sr-only">View</span>
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8"
                                    onClick={() => handleDownloadReport(report.id)}
                                  >
                                    <Download size={16} />
                                    <span className="sr-only">Download</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                            No completed tax reports
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="rates" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>Tax Rates</CardTitle>
                    <Button onClick={handleAddTaxRate}>Add Tax Rate</Button>
                  </div>
                  <CardDescription>Configure tax rates for various transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Rate</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Effective Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentCompany.taxRates.length > 0 ? (
                        currentCompany.taxRates.map((taxRate) => (
                          <TableRow key={taxRate.id}>
                            <TableCell className="font-medium">{taxRate.name}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Input 
                                  type="number" 
                                  className="w-20" 
                                  value={taxRate.rate} 
                                  onChange={(e) => {
                                    const newRate = parseFloat(e.target.value);
                                    if (!isNaN(newRate)) {
                                      handleEditTaxRate(taxRate.id, newRate);
                                    }
                                  }}
                                />
                                <span>%</span>
                              </div>
                            </TableCell>
                            <TableCell>{taxRate.type}</TableCell>
                            <TableCell>{taxRate.effectiveDate}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteTaxRate(taxRate.id)}
                                className="text-red-500"
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                            No tax rates configured
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
        
        <div>
          <TaxCalculator />
          
          <Card className="mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Clock size={18} />
                <span>Tax Calendar</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingReports.length > 0 ? (
                  upcomingReports.slice(0, 3).map((report) => {
                    const dueDate = new Date(report.dueDate);
                    const today = new Date();
                    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    
                    return (
                      <div key={report.id} className="flex items-start space-x-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          daysUntilDue <= 7 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          <Calendar size={16} />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">{report.name}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Due {daysUntilDue <= 0 
                              ? "today" 
                              : daysUntilDue === 1 
                                ? "tomorrow" 
                                : `in ${daysUntilDue} days`
                            }
                          </p>
                          <p className="text-xs font-medium mt-0.5">{report.amount}</p>
                        </div>
                        <div className="ml-auto">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              const updatedReports = currentCompany.taxReports.map(r => 
                                r.id === report.id ? { ...r, status: "In Progress" } : r
                              );
                              
                              updateCompany(currentCompany.id, { taxReports: updatedReports });
                              toast.success(`Started working on ${report.name}`);
                            }}
                          >
                            Start
                          </Button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No upcoming tax deadlines
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Taxes;
