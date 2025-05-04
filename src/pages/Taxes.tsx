
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCompany } from "@/contexts/CompanyContext";
import { Calculator, CalendarIcon, Download, FileText, PlusCircle, Search } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// New interfaces for tax management
interface TaxFormData {
  id?: string;
  name: string;
  period: string;
  dueDate: string;
  amount: string;
  status: string;
}

interface TaxRateFormData {
  id?: string;
  name: string;
  rate: number;
  type: string;
  effectiveDate: string;
}

const Taxes: React.FC = () => {
  const { currentCompany, updateCompany } = useCompany();
  const [activeTab, setActiveTab] = useState('reports');
  const [searchTerm, setSearchTerm] = useState("");
  const [newTaxDialogOpen, setNewTaxDialogOpen] = useState(false);
  const [newTaxRateDialogOpen, setNewTaxRateDialogOpen] = useState(false);
  const [editTaxDialogOpen, setEditTaxDialogOpen] = useState(false);
  const [editTaxRateDialogOpen, setEditTaxRateDialogOpen] = useState(false);
  const [selectedTax, setSelectedTax] = useState<any>(null);
  const [selectedTaxRate, setSelectedTaxRate] = useState<any>(null);
  const [newTax, setNewTax] = useState<TaxFormData>({
    name: "",
    period: "",
    dueDate: "",
    amount: "$0.00",
    status: "Not Started"
  });
  const [newTaxRate, setNewTaxRate] = useState<TaxRateFormData>({
    name: "",
    rate: 0,
    type: "Sales",
    effectiveDate: new Date().toISOString().split('T')[0]
  });
  
  // Filter tax reports and rates based on search term
  const filteredTaxReports = useMemo(() => (currentCompany.taxReports || []).filter(tax => 
    tax.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tax.period.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tax.status.toLowerCase().includes(searchTerm.toLowerCase())
  ), [currentCompany.taxReports, searchTerm]);

  const filteredTaxRates = useMemo(() => (currentCompany.taxRates || []).filter(rate => 
    rate.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    rate.type.toLowerCase().includes(searchTerm.toLowerCase())
  ), [currentCompany.taxRates, searchTerm]);

  // Upcoming tax deadlines
  const upcomingTaxes = useMemo(() => {
    const today = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(today.getMonth() + 1);
    
    return (currentCompany.taxReports || []).filter(tax => {
      const dueDate = new Date(tax.dueDate);
      return dueDate > today && dueDate <= oneMonthFromNow && tax.status !== "Completed";
    });
  }, [currentCompany.taxReports]);
  
  // Overdue taxes
  const overdueTaxes = useMemo(() => {
    const today = new Date();
    
    return (currentCompany.taxReports || []).filter(tax => {
      const dueDate = new Date(tax.dueDate);
      return dueDate < today && tax.status !== "Completed";
    });
  }, [currentCompany.taxReports]);

  // Handle Tax Report Creation
  const handleCreateTax = () => {
    setNewTaxDialogOpen(true);
  };

  const handleSaveNewTax = () => {
    if (!newTax.name || !newTax.period || !newTax.dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const taxToAdd = {
      id: `tax-${Date.now()}`,
      ...newTax
    };
    
    const updatedTaxReports = [...(currentCompany.taxReports || []), taxToAdd];
    updateCompany(currentCompany.id, { taxReports: updatedTaxReports });
    
    toast.success("Tax report created successfully!");
    setNewTaxDialogOpen(false);
    setNewTax({
      name: "",
      period: "",
      dueDate: "",
      amount: "$0.00",
      status: "Not Started"
    });
  };

  // Handle Tax Rate Creation
  const handleCreateTaxRate = () => {
    setNewTaxRateDialogOpen(true);
  };

  const handleSaveNewTaxRate = () => {
    if (!newTaxRate.name || newTaxRate.rate <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const taxRateToAdd = {
      id: `tr-${Date.now()}`,
      ...newTaxRate
    };
    
    const updatedTaxRates = [...(currentCompany.taxRates || []), taxRateToAdd];
    updateCompany(currentCompany.id, { taxRates: updatedTaxRates });
    
    toast.success("Tax rate created successfully!");
    setNewTaxRateDialogOpen(false);
    setNewTaxRate({
      name: "",
      rate: 0,
      type: "Sales",
      effectiveDate: new Date().toISOString().split('T')[0]
    });
  };

  // Handle Tax Report Edit
  const handleEditTax = (id: string) => {
    const tax = currentCompany.taxReports?.find(t => t.id === id);
    if (tax) {
      setSelectedTax(tax);
      setEditTaxDialogOpen(true);
    }
  };

  const handleUpdateTax = () => {
    if (!selectedTax) return;
    
    const updatedTaxReports = (currentCompany.taxReports || []).map(tax => 
      tax.id === selectedTax.id ? selectedTax : tax
    );
    
    updateCompany(currentCompany.id, { taxReports: updatedTaxReports });
    
    toast.success("Tax report updated successfully");
    setEditTaxDialogOpen(false);
    setSelectedTax(null);
  };

  // Handle Tax Rate Edit
  const handleEditTaxRate = (id: string) => {
    const taxRate = currentCompany.taxRates?.find(tr => tr.id === id);
    if (taxRate) {
      setSelectedTaxRate(taxRate);
      setEditTaxRateDialogOpen(true);
    }
  };

  const handleUpdateTaxRate = () => {
    if (!selectedTaxRate) return;
    
    const updatedTaxRates = (currentCompany.taxRates || []).map(rate => 
      rate.id === selectedTaxRate.id ? selectedTaxRate : rate
    );
    
    updateCompany(currentCompany.id, { taxRates: updatedTaxRates });
    
    toast.success("Tax rate updated successfully");
    setEditTaxRateDialogOpen(false);
    setSelectedTaxRate(null);
  };

  // Handle Delete Tax Report
  const handleDeleteTax = (id: string) => {
    const updatedTaxReports = (currentCompany.taxReports || []).filter(tax => tax.id !== id);
    updateCompany(currentCompany.id, { taxReports: updatedTaxReports });
    toast.success("Tax report deleted successfully");
  };

  // Handle Delete Tax Rate
  const handleDeleteTaxRate = (id: string) => {
    const updatedTaxRates = (currentCompany.taxRates || []).filter(rate => rate.id !== id);
    updateCompany(currentCompany.id, { taxRates: updatedTaxRates });
    toast.success("Tax rate deleted successfully");
  };

  // Mark tax report as complete
  const handleMarkAsComplete = (id: string) => {
    const updatedTaxReports = (currentCompany.taxReports || []).map(tax => 
      tax.id === id ? { ...tax, status: "Completed" } : tax
    );
    
    updateCompany(currentCompany.id, { taxReports: updatedTaxReports });
    toast.success("Tax report marked as complete");
  };

  // Calculate tax summary
  const calculateTaxSummary = () => {
    const totalOutstanding = filteredTaxReports.reduce((total, tax) => {
      if (tax.status !== "Completed") {
        const amount = parseFloat(tax.amount.replace(/[^0-9.-]+/g, "") || "0");
        return total + amount;
      }
      return total;
    }, 0);
    
    const totalPaid = filteredTaxReports.reduce((total, tax) => {
      if (tax.status === "Completed") {
        const amount = parseFloat(tax.amount.replace(/[^0-9.-]+/g, "") || "0");
        return total + amount;
      }
      return total;
    }, 0);
    
    return { totalOutstanding, totalPaid };
  };

  const taxSummary = calculateTaxSummary();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tax Management</h1>
          <p className="text-muted-foreground">Manage {currentCompany.name}'s taxes and compliance requirements</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setActiveTab('calculator')}
          >
            <Calculator size={16} />
            <span>Tax Calculator</span>
          </Button>
          <Button 
            className="flex items-center gap-2"
            onClick={handleCreateTax}
          >
            <PlusCircle size={16} />
            <span>New Tax Report</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">${taxSummary.totalOutstanding.toFixed(2)}</CardTitle>
            <CardDescription>Outstanding Tax Liability</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">${taxSummary.totalPaid.toFixed(2)}</CardTitle>
            <CardDescription>Taxes Paid Year-to-date</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-amber-500">{overdueTaxes.length}</CardTitle>
            <CardDescription>Overdue Tax Reports</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-blue-500">{upcomingTaxes.length}</CardTitle>
            <CardDescription>Upcoming Deadlines</CardDescription>
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
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
          >
            <CalendarIcon size={16} />
            <span>Filter by Period</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => {
              toast.info("Generating tax report...");
              setTimeout(() => {
                toast.success("Tax report generated successfully!");
              }, 1500);
            }}
          >
            <Download size={16} />
            <span>Export Tax Report</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="reports">Tax Reports</TabsTrigger>
          <TabsTrigger value="rates">Tax Rates</TabsTrigger>
          <TabsTrigger value="calculator">Tax Calculator</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reports" className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTaxReports.length > 0 ? (
                filteredTaxReports.map((tax) => {
                  const isOverdue = new Date(tax.dueDate) < new Date() && tax.status !== "Completed";
                  return (
                    <TableRow key={tax.id}>
                      <TableCell>{tax.name}</TableCell>
                      <TableCell>{tax.period}</TableCell>
                      <TableCell className={isOverdue ? "text-red-600 font-medium" : ""}>
                        {tax.dueDate}
                        {isOverdue && " (Overdue)"}
                      </TableCell>
                      <TableCell>{tax.amount}</TableCell>
                      <TableCell>
                        <Badge className={
                          tax.status === "Completed" 
                            ? "bg-green-100 text-green-800" 
                            : tax.status === "In Progress" 
                              ? "bg-blue-100 text-blue-800" 
                              : "bg-yellow-100 text-yellow-800"
                        }>
                          {tax.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditTax(tax.id)}>
                              Edit
                            </DropdownMenuItem>
                            {tax.status !== "Completed" && (
                              <DropdownMenuItem onClick={() => handleMarkAsComplete(tax.id)}>
                                Mark as Complete
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => {
                                toast.info("Downloading tax form...");
                                setTimeout(() => {
                                  toast.success("Tax form downloaded!");
                                }, 1500);
                              }}
                            >
                              Download Form
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteTax(tax.id)}
                              className="text-red-600"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    No tax reports found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="rates" className="border rounded-md">
          <div className="p-4 flex justify-between items-center">
            <h2 className="text-xl font-medium">Tax Rates</h2>
            <Button 
              size="sm"
              onClick={handleCreateTaxRate}
            >
              <PlusCircle size={16} className="mr-2" />
              New Tax Rate
            </Button>
          </div>
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
              {filteredTaxRates.length > 0 ? (
                filteredTaxRates.map((rate) => (
                  <TableRow key={rate.id}>
                    <TableCell>{rate.name}</TableCell>
                    <TableCell>{rate.rate}%</TableCell>
                    <TableCell>{rate.type}</TableCell>
                    <TableCell>{rate.effectiveDate}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditTaxRate(rate.id)}
                        className="mr-2"
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteTaxRate(rate.id)}
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
                    No tax rates found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="calculator" className="border rounded-md p-6">
          <h2 className="text-2xl font-medium mb-6">Tax Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Sales Tax Calculator</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Sale Amount (before tax)</label>
                  <Input type="text" placeholder="$0.00" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Tax Rate</label>
                  <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                    <option value="">Select a tax rate</option>
                    {currentCompany.taxRates?.map(rate => (
                      <option key={rate.id} value={rate.rate}>
                        {rate.name} ({rate.rate}%)
                      </option>
                    ))}
                  </select>
                </div>
                <Button>Calculate</Button>
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between mb-2">
                    <span>Sub-total:</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Tax amount:</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>$0.00</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Income Tax Estimator</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Annual Income</label>
                  <Input type="text" placeholder="$0.00" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Filing Status</label>
                  <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                    <option>Single</option>
                    <option>Married Filing Jointly</option>
                    <option>Married Filing Separately</option>
                    <option>Head of Household</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Tax Year</label>
                  <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                    <option>2025</option>
                    <option>2024</option>
                  </select>
                </div>
                <Button>Calculate</Button>
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between mb-2">
                    <span>Estimated Federal Tax:</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Estimated State Tax:</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Estimated Tax:</span>
                    <span>$0.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => {
                toast.info("Contacting tax professional...");
                setTimeout(() => {
                  toast.success("Request sent to tax professional!");
                }, 1500);
              }}
            >
              <FileText size={16} />
              <span>Contact Tax Professional</span>
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* New Tax Report Dialog */}
      <Dialog open={newTaxDialogOpen} onOpenChange={setNewTaxDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Tax Report</DialogTitle>
            <DialogDescription>
              Add a new tax report or liability to track
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name*
              </label>
              <Input 
                id="name" 
                className="col-span-3"
                value={newTax.name}
                onChange={(e) => setNewTax({...newTax, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="period" className="text-right">
                Period*
              </label>
              <Input 
                id="period" 
                className="col-span-3"
                placeholder="Q2 2025, Annual 2025, etc."
                value={newTax.period}
                onChange={(e) => setNewTax({...newTax, period: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="due-date" className="text-right">
                Due Date*
              </label>
              <Input 
                id="due-date" 
                className="col-span-3" 
                type="date"
                value={newTax.dueDate}
                onChange={(e) => setNewTax({...newTax, dueDate: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="amount" className="text-right">
                Amount
              </label>
              <Input 
                id="amount" 
                className="col-span-3"
                value={newTax.amount}
                onChange={(e) => setNewTax({...newTax, amount: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="status" className="text-right">
                Status
              </label>
              <select
                id="status"
                className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={newTax.status}
                onChange={(e) => setNewTax({...newTax, status: e.target.value})}
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewTaxDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveNewTax}>Create Tax Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Tax Report Dialog */}
      <Dialog open={editTaxDialogOpen} onOpenChange={setEditTaxDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Tax Report</DialogTitle>
            <DialogDescription>
              Update tax report details
            </DialogDescription>
          </DialogHeader>
          {selectedTax && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-name" className="text-right">
                  Name
                </label>
                <Input 
                  id="edit-name" 
                  className="col-span-3"
                  value={selectedTax.name}
                  onChange={(e) => setSelectedTax({...selectedTax, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-period" className="text-right">
                  Period
                </label>
                <Input 
                  id="edit-period" 
                  className="col-span-3"
                  value={selectedTax.period}
                  onChange={(e) => setSelectedTax({...selectedTax, period: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-due-date" className="text-right">
                  Due Date
                </label>
                <Input 
                  id="edit-due-date" 
                  className="col-span-3" 
                  type="date"
                  value={selectedTax.dueDate}
                  onChange={(e) => setSelectedTax({...selectedTax, dueDate: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-amount" className="text-right">
                  Amount
                </label>
                <Input 
                  id="edit-amount" 
                  className="col-span-3"
                  value={selectedTax.amount}
                  onChange={(e) => setSelectedTax({...selectedTax, amount: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-status" className="text-right">
                  Status
                </label>
                <select
                  id="edit-status"
                  className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  value={selectedTax.status}
                  onChange={(e) => setSelectedTax({...selectedTax, status: e.target.value})}
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTaxDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateTax}>Update Tax Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Tax Rate Dialog */}
      <Dialog open={newTaxRateDialogOpen} onOpenChange={setNewTaxRateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Tax Rate</DialogTitle>
            <DialogDescription>
              Add a new tax rate to your system
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="rate-name" className="text-right">
                Name*
              </label>
              <Input 
                id="rate-name" 
                className="col-span-3"
                placeholder="e.g., Standard Sales Tax"
                value={newTaxRate.name}
                onChange={(e) => setNewTaxRate({...newTaxRate, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="rate-value" className="text-right">
                Rate (%)*
              </label>
              <Input 
                id="rate-value" 
                className="col-span-3"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={newTaxRate.rate}
                onChange={(e) => setNewTaxRate({...newTaxRate, rate: parseFloat(e.target.value)})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="rate-type" className="text-right">
                Type
              </label>
              <select
                id="rate-type"
                className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={newTaxRate.type}
                onChange={(e) => setNewTaxRate({...newTaxRate, type: e.target.value})}
              >
                <option value="Sales">Sales</option>
                <option value="Income">Income</option>
                <option value="Property">Property</option>
                <option value="VAT">VAT</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="effective-date" className="text-right">
                Effective Date
              </label>
              <Input 
                id="effective-date" 
                className="col-span-3" 
                type="date"
                value={newTaxRate.effectiveDate}
                onChange={(e) => setNewTaxRate({...newTaxRate, effectiveDate: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewTaxRateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveNewTaxRate}>Create Tax Rate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Tax Rate Dialog */}
      <Dialog open={editTaxRateDialogOpen} onOpenChange={setEditTaxRateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Tax Rate</DialogTitle>
            <DialogDescription>
              Update tax rate information
            </DialogDescription>
          </DialogHeader>
          {selectedTaxRate && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-rate-name" className="text-right">
                  Name
                </label>
                <Input 
                  id="edit-rate-name" 
                  className="col-span-3"
                  value={selectedTaxRate.name}
                  onChange={(e) => setSelectedTaxRate({...selectedTaxRate, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-rate-value" className="text-right">
                  Rate (%)
                </label>
                <Input 
                  id="edit-rate-value" 
                  className="col-span-3"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={selectedTaxRate.rate}
                  onChange={(e) => setSelectedTaxRate({...selectedTaxRate, rate: parseFloat(e.target.value)})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-rate-type" className="text-right">
                  Type
                </label>
                <select
                  id="edit-rate-type"
                  className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  value={selectedTaxRate.type}
                  onChange={(e) => setSelectedTaxRate({...selectedTaxRate, type: e.target.value})}
                >
                  <option value="Sales">Sales</option>
                  <option value="Income">Income</option>
                  <option value="Property">Property</option>
                  <option value="VAT">VAT</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-effective-date" className="text-right">
                  Effective Date
                </label>
                <Input 
                  id="edit-effective-date" 
                  className="col-span-3" 
                  type="date"
                  value={selectedTaxRate.effectiveDate}
                  onChange={(e) => setSelectedTaxRate({...selectedTaxRate, effectiveDate: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTaxRateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateTaxRate}>Update Tax Rate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Taxes;
