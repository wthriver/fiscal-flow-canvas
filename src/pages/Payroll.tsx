

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, DollarSign, FileText, Settings } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PayrollData, PayPeriod, TaxSettings, DeductionType } from "@/types/company";

const PayrollPage: React.FC = () => {
  const { currentCompany, updateCompany } = useCompany();
  const [activeTab, setActiveTab] = useState("overview");

  const calculatePayrollSummary = () => {
    const payPeriods = currentCompany.payrollData?.payPeriods || [];
    const currentPeriod = payPeriods.find(p => p.status === 'Current');
    
    const totalEmployees = currentCompany.employees?.length || 0;
    const totalPayroll = payPeriods.reduce((sum, period) => {
      // Fix: Handle the type properly with explicit type checking
      let periodTotal: number;
      if (typeof period.totalPaid === 'number') {
        periodTotal = period.totalPaid;
      } else if (typeof period.totalPaid === 'string') {
        periodTotal = parseFloat(period.totalPaid.replace(/[^0-9.-]+/g, "") || "0");
      } else {
        periodTotal = 0;
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Payroll Management</h1>

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
                  <p className="text-sm text-muted-foreground">Total Employees</p>
                  <p className="text-2xl font-bold">{employeeStats.totalEmployees}</p>
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
                  <span className="font-medium">Total Paid:</span> ${payrollSummary.currentPeriod.totalPaid}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">No current pay period found.</p>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Employees Section */}
      <section id="employees" className="space-y-4">
        <h2 className="text-2xl font-bold mb-2">Employees</h2>
        <Card>
          <CardHeader>
            <CardTitle>Employee List</CardTitle>
            <CardDescription>Manage and view employee details</CardDescription>
          </CardHeader>
          <CardContent>
            {currentCompany.employees ? (
              <div className="space-y-4">
                {currentCompany.employees?.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-sm text-muted-foreground">{employee.position}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${typeof employee.salary === 'number' ? employee.salary.toLocaleString() : employee.salary || 'N/A'}</div>
                      <div className="text-sm text-muted-foreground">
                        {employee.hireDate ? `Since ${new Date(employee.hireDate).getFullYear()}` : 'Date not set'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No employees found.</p>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Sample Data Creation */}
      <section id="sample-data">
        <Button onClick={createSamplePayPeriod}>Create Sample Pay Period Data</Button>
      </section>
    </div>
  );
};

export default PayrollPage;
