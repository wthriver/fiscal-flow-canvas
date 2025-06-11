import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, DollarSign, Plus, Edit, Trash2 } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PayrollData, PayPeriod, Employee } from "@/types/company";
import { EmployeeDialog } from "@/components/payroll/EmployeeDialog";
import { toast } from "sonner";

const PayrollPage: React.FC = () => {
  const { currentCompany, updateCompany } = useCompany();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const calculatePayrollSummary = () => {
    const payPeriods = currentCompany.payrollData?.payPeriods || [];
    const currentPeriod = payPeriods.find(p => p.status === 'Current');
    
    const totalEmployees = currentCompany.employees?.length || 0;
    const totalPayroll = payPeriods.reduce((sum, period) => {
      // Safe type handling for totalPaid
      let periodTotal = 0;
      const totalPaid = period.totalPaid;
      
      if (typeof totalPaid === 'number') {
        periodTotal = totalPaid;
      } else if (totalPaid && typeof totalPaid === 'string') {
        const cleanedValue = totalPaid.replace(/[^0-9.-]+/g, "");
        periodTotal = parseFloat(cleanedValue) || 0;
      }
      return sum + periodTotal;
    }, 0);
    
    const avgSalary = totalEmployees > 0 ? totalPayroll / totalEmployees : 0;
    
    return {
      totalEmployees,
      totalPayroll,
      avgSalary: avgSalary.toFixed(0),
      currentPeriod
    };
  };

  const payrollSummary = calculatePayrollSummary();

  const calculateEmployeeStats = () => {
    const employees = currentCompany.employees || [];
    const activeEmployees = employees.filter(e => e.status === 'Active').length;
    const newHires = employees.filter(e => {
      const hireDate = new Date(e.hireDate || '');
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return hireDate > thirtyDaysAgo;
    }).length;

    return {
      totalEmployees: employees.length,
      activeEmployees,
      newHires
    };
  };

  const employeeStats = calculateEmployeeStats();

  const createSamplePayPeriod = () => {
    const samplePeriods: PayPeriod[] = [
      {
        id: `payroll-${Date.now()}`,
        startDate: '2024-01-01',
        endDate: '2024-01-15',
        payDate: '2024-01-20',
        status: 'Completed',
        totalPaid: 45000
      },
      {
        id: `payroll-${Date.now() + 1}`,
        startDate: '2024-01-16',
        endDate: '2024-01-31',
        payDate: '2024-02-05',
        status: 'Processing',
        totalPaid: 47500
      }
    ];

    const updatedPayrollData: PayrollData = {
      payPeriods: [...(currentCompany.payrollData?.payPeriods || []), ...samplePeriods],
      taxSettings: currentCompany.payrollData?.taxSettings,
      deductionTypes: currentCompany.payrollData?.deductionTypes
    };

    updateCompany({
      ...currentCompany,
      payrollData: updatedPayrollData
    });
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEmployeeDialogOpen(true);
  };

  const handleDeleteEmployee = (employeeId: string) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      const updatedEmployees = currentCompany.employees?.filter(emp => emp.id !== employeeId) || [];
      updateCompany({
        ...currentCompany,
        employees: updatedEmployees
      });
      toast.success("Employee deleted successfully");
    }
  };

  const runPayroll = () => {
    if (!currentCompany.employees || currentCompany.employees.length === 0) {
      toast.error("No employees found. Please add employees first.");
      return;
    }

    const newPayPeriod: PayPeriod = {
      id: `payroll-${Date.now()}`,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      payDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Processing',
      totalPaid: currentCompany.employees.reduce((sum, emp) => {
        const salary = typeof emp.salary === 'number' ? emp.salary : parseFloat(emp.salary?.toString() || '0');
        return sum + (salary / 26); // Bi-weekly pay
      }, 0)
    };

    const updatedPayrollData: PayrollData = {
      payPeriods: [...(currentCompany.payrollData?.payPeriods || []), newPayPeriod],
      taxSettings: currentCompany.payrollData?.taxSettings,
      deductionTypes: currentCompany.payrollData?.deductionTypes
    };

    updateCompany({
      ...currentCompany,
      payrollData: updatedPayrollData
    });

    toast.success("Payroll processed successfully!");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Payroll Management</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsEmployeeDialogOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Employee
          </Button>
          <Button onClick={runPayroll} variant="default">
            Run Payroll
          </Button>
        </div>
      </div>

      {/* Overview Section */}
      <section id="overview" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Payroll</p>
                  <p className="text-2xl font-bold">${payrollSummary.totalPayroll.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Employees</p>
                  <p className="text-2xl font-bold">{employeeStats.activeEmployees}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Avg Salary</p>
                  <p className="text-2xl font-bold">${payrollSummary.avgSalary}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pay Period Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Current Pay Period</CardTitle>
            <CardDescription>Summary of the current pay period</CardDescription>
          </CardHeader>
          <CardContent>
            {payrollSummary.currentPeriod ? (
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Start Date:</span> {payrollSummary.currentPeriod.startDate}
                </p>
                <p>
                  <span className="font-medium">End Date:</span> {payrollSummary.currentPeriod.endDate}
                </p>
                <p>
                  <span className="font-medium">Pay Date:</span> {payrollSummary.currentPeriod.payDate}
                </p>
                <p>
                  <span className="font-medium">Status:</span> <Badge variant="secondary">{payrollSummary.currentPeriod.status}</Badge>
                </p>
                <p>
                  <span className="font-medium">Total Paid:</span> ${
                    (() => {
                      const totalPaid = payrollSummary.currentPeriod.totalPaid;
                      if (typeof totalPaid === 'number') {
                        return totalPaid.toLocaleString();
                      } else if (totalPaid) {
                        return String(totalPaid);
                      }
                      return '0';
                    })()
                  }
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">No current pay period found.</p>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Employees Section */}
      <section id="employees" className="space-y-4 mt-8">
        <h2 className="text-2xl font-bold mb-4">Employee Management</h2>
        <Card>
          <CardHeader>
            <CardTitle>Employee List</CardTitle>
            <CardDescription>Manage employee information and payroll details</CardDescription>
          </CardHeader>
          <CardContent>
            {currentCompany.employees && currentCompany.employees.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Pay Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Hire Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentCompany.employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>{employee.department || 'N/A'}</TableCell>
                      <TableCell>
                        {typeof employee.payRate === 'string' ? employee.payRate : `$${employee.payRate || 0}`}
                        {employee.payType && ` (${employee.payType})`}
                      </TableCell>
                      <TableCell>
                        <Badge variant={employee.status === 'Active' ? 'default' : 'secondary'}>
                          {employee.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {employee.hireDate ? new Date(employee.hireDate).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditEmployee(employee)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteEmployee(employee.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No employees found. Add your first employee to get started with payroll.
                </p>
                <Button onClick={() => setIsEmployeeDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Sample Data Creation */}
      <section id="sample-data" className="mt-8">
        <Button onClick={createSamplePayPeriod} variant="outline">
          Create Sample Pay Period Data
        </Button>
      </section>

      <EmployeeDialog
        isOpen={isEmployeeDialogOpen}
        onClose={() => {
          setIsEmployeeDialogOpen(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
      />
    </div>
  );
};

export default PayrollPage;
