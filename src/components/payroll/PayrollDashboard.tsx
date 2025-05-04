
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarCheck, UserCheck, Wallet, FileText, Download, Share2, FilePlus, Users } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface PayrollDashboardProps {
  onProcessPayroll: (payrollId: string) => void;
}

export const PayrollDashboard: React.FC<PayrollDashboardProps> = ({ onProcessPayroll }) => {
  const { currentCompany, updateCompany } = useCompany();
  const [editEmployeeDialogOpen, setEditEmployeeDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);

  // Find the next payroll date
  const nextPayrollPeriod = currentCompany.payrollData.payPeriods.find(
    period => new Date(period.payDate) > new Date() && period.status !== "Completed"
  );

  // Find the last completed payroll
  const lastPayroll = [...currentCompany.payrollData.payPeriods]
    .filter(period => period.status === "Completed")
    .sort((a, b) => new Date(b.payDate).getTime() - new Date(a.payDate).getTime())[0];

  // Count active employees
  const activeEmployees = currentCompany.employees.filter(emp => emp.status === "Active");
  const pendingEmployees = currentCompany.employees.filter(emp => emp.status === "Pending");

  const handleEditEmployee = (employeeId: string) => {
    const employee = currentCompany.employees.find(emp => emp.id === employeeId);
    if (employee) {
      setSelectedEmployee(employee);
      setEditEmployeeDialogOpen(true);
    }
  };

  const handleUpdateEmployee = () => {
    if (!selectedEmployee) return;

    const updatedEmployees = currentCompany.employees.map(emp => 
      emp.id === selectedEmployee.id ? selectedEmployee : emp
    );
    
    updateCompany(currentCompany.id, { employees: updatedEmployees });
    toast.success("Employee updated successfully");
    setEditEmployeeDialogOpen(false);
  };

  const handleMarkAsPaid = (payrollId: string) => {
    const updatedPayPeriods = currentCompany.payrollData.payPeriods.map(period => 
      period.id === payrollId ? { ...period, status: "Completed" } : period
    );
    
    const updatedPayrollData = {
      ...currentCompany.payrollData,
      payPeriods: updatedPayPeriods
    };
    
    updateCompany(currentCompany.id, { payrollData: updatedPayrollData });
    toast.success("Payroll marked as completed");
  };

  const handleProcessEarly = () => {
    if (nextPayrollPeriod) {
      onProcessPayroll(nextPayrollPeriod.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-primary" />
              Next Payroll
            </CardTitle>
          </CardHeader>
          <CardContent>
            {nextPayrollPeriod ? (
              <>
                <p className="text-2xl font-bold">{nextPayrollPeriod.payDate}</p>
                <p className="text-sm text-muted-foreground">{nextPayrollPeriod.employees.length} employees</p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold">No Scheduled Payroll</p>
                <p className="text-sm text-muted-foreground">Create a new payroll run</p>
              </>
            )}
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={handleProcessEarly}
              disabled={!nextPayrollPeriod}
            >
              Process Early
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wallet className="h-4 w-4 text-primary" />
              Last Payroll
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lastPayroll ? (
              <>
                <p className="text-2xl font-bold">{lastPayroll.totalGross}</p>
                <p className="text-sm text-muted-foreground">{lastPayroll.payDate}</p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold">$0.00</p>
                <p className="text-sm text-muted-foreground">No payroll processed yet</p>
              </>
            )}
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => lastPayroll && onProcessPayroll(lastPayroll.id)}
              disabled={!lastPayroll}
            >
              View Details
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-primary" />
              Employee Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{activeEmployees.length} Active</p>
            <p className="text-sm text-muted-foreground">{pendingEmployees.length} Pending</p>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("Opening employee management")}
            >
              Manage
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Tabs defaultValue="employees" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="payroll-history">Payroll History</TabsTrigger>
          <TabsTrigger value="tax-filings">Tax Filings</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="employees" className="border rounded-md p-4 mt-2">
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="py-3 px-4 text-left">Employee</th>
                    <th className="py-3 px-4 text-left">Position</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Pay Rate</th>
                    <th className="py-3 px-4 text-left">Pay Type</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCompany.employees.map((employee) => (
                    <tr key={employee.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">{employee.name}</td>
                      <td className="py-3 px-4">{employee.position}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          employee.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {employee.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">{employee.payRate}</td>
                      <td className="py-3 px-4">{employee.payType}</td>
                      <td className="py-3 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditEmployee(employee.id)}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="payroll-history" className="border rounded-md p-4 mt-2">
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Description</th>
                    <th className="py-3 px-4 text-left">Employees</th>
                    <th className="py-3 px-4 text-left">Total</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCompany.payrollData.payPeriods.map((period) => (
                    <tr key={period.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">{period.payDate}</td>
                      <td className="py-3 px-4">
                        Payroll {period.startDate} - {period.endDate}
                      </td>
                      <td className="py-3 px-4">{period.employees.length}</td>
                      <td className="py-3 px-4">{period.totalGross}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          period.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {period.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onProcessPayroll(period.id)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => toast.info("Downloading payroll details...")}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => toast.info("Share options would appear here")}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="tax-filings" className="border rounded-md p-4 mt-2">
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="py-3 px-4 text-left">Form</th>
                    <th className="py-3 px-4 text-left">Period</th>
                    <th className="py-3 px-4 text-left">Due Date</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">941 (Federal Tax)</td>
                    <td className="py-3 px-4">Q2 2025</td>
                    <td className="py-3 px-4">Jul 31, 2025</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Upcoming</span>
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast.info("Starting tax form preparation...")}
                      >
                        Prepare
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">State Withholding</td>
                    <td className="py-3 px-4">Q2 2025</td>
                    <td className="py-3 px-4">Jul 31, 2025</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Upcoming</span>
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast.info("Starting tax form preparation...")}
                      >
                        Prepare
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="reports" className="border rounded-md p-4 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Payroll Summary</CardTitle>
                <CardDescription>Summary of all payrolls by period</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => toast.info("Viewing payroll summary...")}
                >
                  View
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast.info("Exporting payroll summary...")}
                >
                  Export
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tax Liability</CardTitle>
                <CardDescription>Summary of tax liabilities</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => toast.info("Viewing tax liability report...")}
                >
                  View
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast.info("Exporting tax liability report...")}
                >
                  Export
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Employee Earnings</CardTitle>
                <CardDescription>Breakdown of earnings by employee</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => toast.info("Viewing employee earnings report...")}
                >
                  View
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast.info("Exporting employee earnings report...")}
                >
                  Export
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Deductions Report</CardTitle>
                <CardDescription>Summary of all deductions</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => toast.info("Viewing deductions report...")}
                >
                  View
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast.info("Exporting deductions report...")}
                >
                  Export
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Employee Dialog */}
      <Dialog open={editEmployeeDialogOpen} onOpenChange={setEditEmployeeDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>
              Update employee information and payroll settings.
            </DialogDescription>
          </DialogHeader>
          
          {selectedEmployee && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right">
                  Name
                </label>
                <Input
                  id="name"
                  value={selectedEmployee.name}
                  onChange={(e) => setSelectedEmployee({...selectedEmployee, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="position" className="text-right">
                  Position
                </label>
                <Input
                  id="position"
                  value={selectedEmployee.position}
                  onChange={(e) => setSelectedEmployee({...selectedEmployee, position: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="pay-rate" className="text-right">
                  Pay Rate
                </label>
                <Input
                  id="pay-rate"
                  value={selectedEmployee.payRate}
                  onChange={(e) => setSelectedEmployee({...selectedEmployee, payRate: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="pay-type" className="text-right">
                  Pay Type
                </label>
                <select
                  id="pay-type"
                  value={selectedEmployee.payType}
                  onChange={(e) => setSelectedEmployee({...selectedEmployee, payType: e.target.value})}
                  className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                >
                  <option value="Hourly">Hourly</option>
                  <option value="Salary">Salary</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="status" className="text-right">
                  Status
                </label>
                <select
                  id="status"
                  value={selectedEmployee.status}
                  onChange={(e) => setSelectedEmployee({...selectedEmployee, status: e.target.value})}
                  className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditEmployeeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateEmployee}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
