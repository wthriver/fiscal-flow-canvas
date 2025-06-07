
import React, { useState } from "react";
import { PayrollDashboard } from "@/components/payroll/PayrollDashboard";
import { PayrollProcessor } from "@/components/payroll/PayrollProcessor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilePlus, Users, Calculator, DollarSign, Clock, AlertCircle } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";

const Payroll: React.FC = () => {
  const { currentCompany, updateCompany } = useCompany();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedPayrollId, setSelectedPayrollId] = useState<string | null>(null);
  const [isNewPayrollDialogOpen, setIsNewPayrollDialogOpen] = useState(false);
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  
  const [newPayrollData, setNewPayrollData] = useState({
    payPeriod: "bi-weekly",
    startDate: "",
    endDate: "",
    payDate: ""
  });

  const [newEmployeeData, setNewEmployeeData] = useState({
    name: "",
    position: "",
    salary: "",
    payType: "salary",
    department: "",
    startDate: new Date().toISOString().split('T')[0],
    status: "active"
  });
  
  // Ensure payrollData exists before accessing payPeriods
  const payrollData = currentCompany.payrollData || { payPeriods: [] };
  
  // Calculate payroll statistics
  const calculatePayrollStats = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const currentMonthPayrolls = payrollData.payPeriods.filter(period => {
      const payDate = new Date(period.payDate);
      return payDate.getMonth() === currentMonth && payDate.getFullYear() === currentYear;
    });

    const totalPaidThisMonth = currentMonthPayrolls.reduce((sum, period) => {
      const amount = parseFloat(period.totalPaid?.replace(/[^0-9.-]+/g, "") || "0");
      return sum + amount;
    }, 0);

    const activeEmployees = currentCompany.employees?.filter(emp => emp.status === 'active').length || 0;
    const pendingPayrolls = payrollData.payPeriods.filter(period => period.status === "Processing").length;
    
    return {
      totalPaidThisMonth,
      activeEmployees,
      pendingPayrolls,
      upcomingPayDate: payrollData.payPeriods.find(p => p.status === "Processing")?.payDate || "N/A"
    };
  };

  const stats = calculatePayrollStats();

  // Find the next pending payroll period
  const pendingPayroll = payrollData.payPeriods.find(
    period => period.status === "Processing"
  );
  
  const handleProcessPayroll = (payrollId: string) => {
    setSelectedPayrollId(payrollId);
    setActiveTab("process");
  };
  
  const handleCreatePayrollRun = () => {
    if (!newPayrollData.startDate || !newPayrollData.endDate || !newPayrollData.payDate) {
      toast.error("Please fill in all required dates");
      return;
    }

    const payrollRun = {
      id: `payroll-${Date.now()}`,
      payPeriod: newPayrollData.payPeriod,
      startDate: newPayrollData.startDate,
      endDate: newPayrollData.endDate,
      payDate: newPayrollData.payDate,
      status: "Processing",
      totalPaid: "$0.00",
      employeeCount: currentCompany.employees?.length || 0,
      createdDate: new Date().toISOString().split('T')[0]
    };

    const updatedPayrollData = {
      ...payrollData,
      payPeriods: [...payrollData.payPeriods, payrollRun]
    };

    updateCompany({
      ...currentCompany,
      payrollData: updatedPayrollData
    });

    setIsNewPayrollDialogOpen(false);
    setNewPayrollData({
      payPeriod: "bi-weekly",
      startDate: "",
      endDate: "",
      payDate: ""
    });

    toast.success("Payroll run created successfully!");
    setSelectedPayrollId(payrollRun.id);
    setActiveTab("process");
  };

  const handleAddEmployee = () => {
    if (!newEmployeeData.name || !newEmployeeData.position || !newEmployeeData.salary) {
      toast.error("Please fill in all required fields");
      return;
    }

    const employee = {
      id: `emp-${Date.now()}`,
      name: newEmployeeData.name,
      position: newEmployeeData.position,
      salary: parseFloat(newEmployeeData.salary),
      payType: newEmployeeData.payType,
      department: newEmployeeData.department,
      startDate: newEmployeeData.startDate,
      status: newEmployeeData.status,
      taxWithholdings: {
        federal: 0.22,
        state: 0.05,
        fica: 0.0765
      }
    };

    const updatedEmployees = [...(currentCompany.employees || []), employee];
    
    updateCompany({
      ...currentCompany,
      employees: updatedEmployees
    });

    setIsEmployeeDialogOpen(false);
    setNewEmployeeData({
      name: "",
      position: "",
      salary: "",
      payType: "salary",
      department: "",
      startDate: new Date().toISOString().split('T')[0],
      status: "active"
    });

    toast.success("Employee added successfully!");
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Payroll Management</h1>
          <p className="text-muted-foreground">Manage employee payroll, process payments, and track compliance</p>
        </div>
        <div className="flex gap-2">
          <Button className="flex items-center gap-2" onClick={() => setIsNewPayrollDialogOpen(true)}>
            <FilePlus className="h-4 w-4" />
            <span>New Payroll Run</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2" onClick={() => setIsEmployeeDialogOpen(true)}>
            <Users className="h-4 w-4" />
            <span>Add Employee</span>
          </Button>
        </div>
      </div>

      {/* Payroll Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Paid This Month</p>
                <p className="text-xl font-semibold">${stats.totalPaidThisMonth.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active Employees</p>
                <p className="text-xl font-semibold">{stats.activeEmployees}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pending Payrolls</p>
                <p className="text-xl font-semibold">{stats.pendingPayrolls}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Next Pay Date</p>
                <p className="text-xl font-semibold">{stats.upcomingPayDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="process" disabled={!selectedPayrollId && !pendingPayroll}>
            Process Payroll
          </TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-6">
          <PayrollDashboard onProcessPayroll={handleProcessPayroll} />
        </TabsContent>

        <TabsContent value="employees" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Employee Management</CardTitle>
              <CardDescription>Manage employee information and payroll settings</CardDescription>
            </CardHeader>
            <CardContent>
              {currentCompany.employees && currentCompany.employees.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Pay Type</TableHead>
                      <TableHead>Salary</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Start Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentCompany.employees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>{employee.department || 'N/A'}</TableCell>
                        <TableCell>{employee.payType || 'salary'}</TableCell>
                        <TableCell>${employee.salary?.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                            {employee.status || 'active'}
                          </Badge>
                        </TableCell>
                        <TableCell>{employee.startDate || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No employees found. Add your first employee to get started.</p>
                  <Button onClick={() => setIsEmployeeDialogOpen(true)}>
                    <Users className="h-4 w-4 mr-2" />
                    Add Employee
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="process" className="mt-6">
          {selectedPayrollId ? (
            <PayrollProcessor payrollId={selectedPayrollId} />
          ) : pendingPayroll ? (
            <PayrollProcessor payrollId={pendingPayroll.id} />
          ) : (
            <div className="flex flex-col items-center justify-center p-12 bg-muted/30 rounded-lg border">
              <h2 className="text-xl font-medium mb-2">No Active Payroll Run</h2>
              <p className="text-muted-foreground mb-6">
                There are no pending payroll runs to process at this time.
              </p>
              <Button onClick={() => setIsNewPayrollDialogOpen(true)}>Create New Payroll Run</Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <div className="grid gap-6">
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-xl font-bold mb-4">Payroll History</h2>
              <div className="divide-y">
                {payrollData.payPeriods
                  .filter(period => period.status === "Completed")
                  .map(period => (
                    <div key={period.id} className="py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Period</div>
                        <div>{period.startDate} - {period.endDate}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Pay Date</div>
                        <div>{period.payDate}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Total Paid</div>
                        <div>{period.totalPaid}</div>
                      </div>
                      <div className="flex items-end justify-end">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedPayrollId(period.id);
                            setActiveTab("process");
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                
                {payrollData.payPeriods.filter(period => period.status === "Completed").length === 0 && (
                  <div className="py-8 text-center text-muted-foreground">
                    No payroll history available
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-xl font-bold mb-4">Tax Remittance History</h2>
              <div className="divide-y">
                <div className="py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Type</div>
                    <div>Federal Withholding</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Period</div>
                    <div>Q1 2025</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Amount Paid</div>
                    <div>$4,526.89</div>
                  </div>
                  <div className="flex items-end justify-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        toast.info("Viewing tax remittance details");
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
                <div className="py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Type</div>
                    <div>State Withholding</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Period</div>
                    <div>Q1 2025</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Amount Paid</div>
                    <div>$1,245.67</div>
                  </div>
                  <div className="flex items-end justify-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        toast.info("Viewing tax remittance details");
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* New Payroll Run Dialog */}
      <Dialog open={isNewPayrollDialogOpen} onOpenChange={setIsNewPayrollDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Payroll Run</DialogTitle>
            <DialogDescription>Set up a new payroll processing period</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label className="text-sm font-medium">Pay Period</label>
              <Select value={newPayrollData.payPeriod} onValueChange={(value) => setNewPayrollData({...newPayrollData, payPeriod: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="semi-monthly">Semi-monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Start Date</label>
                <Input
                  type="date"
                  value={newPayrollData.startDate}
                  onChange={(e) => setNewPayrollData({...newPayrollData, startDate: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">End Date</label>
                <Input
                  type="date"
                  value={newPayrollData.endDate}
                  onChange={(e) => setNewPayrollData({...newPayrollData, endDate: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Pay Date</label>
              <Input
                type="date"
                value={newPayrollData.payDate}
                onChange={(e) => setNewPayrollData({...newPayrollData, payDate: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewPayrollDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreatePayrollRun}>Create Payroll Run</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Employee Dialog */}
      <Dialog open={isEmployeeDialogOpen} onOpenChange={setIsEmployeeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>Add a new employee to your payroll system</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Name*</label>
                <Input
                  value={newEmployeeData.name}
                  onChange={(e) => setNewEmployeeData({...newEmployeeData, name: e.target.value})}
                  placeholder="Employee name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Position*</label>
                <Input
                  value={newEmployeeData.position}
                  onChange={(e) => setNewEmployeeData({...newEmployeeData, position: e.target.value})}
                  placeholder="Job title"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Department</label>
                <Input
                  value={newEmployeeData.department}
                  onChange={(e) => setNewEmployeeData({...newEmployeeData, department: e.target.value})}
                  placeholder="Department"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Pay Type</label>
                <Select value={newEmployeeData.payType} onValueChange={(value) => setNewEmployeeData({...newEmployeeData, payType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Salary/Rate*</label>
                <Input
                  type="number"
                  step="0.01"
                  value={newEmployeeData.salary}
                  onChange={(e) => setNewEmployeeData({...newEmployeeData, salary: e.target.value})}
                  placeholder="Annual salary or hourly rate"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Start Date</label>
                <Input
                  type="date"
                  value={newEmployeeData.startDate}
                  onChange={(e) => setNewEmployeeData({...newEmployeeData, startDate: e.target.value})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEmployeeDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddEmployee}>Add Employee</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payroll;
