
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Users, DollarSign, Calendar, Clock } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { PayrollDashboard } from "@/components/payroll/PayrollDashboard";
import { PayrollProcessor } from "@/components/payroll/PayrollProcessor";
import { TaxComplianceManager } from "@/components/payroll/TaxComplianceManager";
import { BenefitsManager } from "@/components/payroll/BenefitsManager";
import { TimeClockSystem } from "@/components/timetracking/TimeClockSystem";

const Payroll: React.FC = () => {
  const { currentCompany } = useCompany();
  const [activeTab, setActiveTab] = useState("dashboard");

  const payrollData = currentCompany?.payrollData || {
    totalPayroll: 0,
    employeeCount: 0,
    averageSalary: 0,
    payPeriods: [],
    taxSettings: {},
    deductionTypes: {}
  };

  const employees = currentCompany?.employees || [];
  const totalMonthlyPayroll = employees.reduce((sum, emp) => {
    const salary = typeof emp.salary === 'string' 
      ? parseFloat(emp.salary.replace(/[$,]/g, '')) || 0 
      : emp.salary || 0;
    return sum + salary;
  }, 0);

  const upcomingPayroll = payrollData.payPeriods.find(period => period.status === 'Pending');

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Payroll & HR Management</h1>
          <p className="text-muted-foreground">Complete payroll processing with tax compliance and benefits</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Process Payroll
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground">Active employees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalMonthlyPayroll.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total monthly cost</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payroll</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {upcomingPayroll ? upcomingPayroll.payDate : 'Not scheduled'}
            </div>
            <p className="text-xs text-muted-foreground">Due date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Salary</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${employees.length > 0 ? (totalMonthlyPayroll / employees.length).toLocaleString() : '0'}
            </div>
            <p className="text-xs text-muted-foreground">Per employee</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="tax">Tax Compliance</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
          <TabsTrigger value="timeclock">Time Clock</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <PayrollDashboard payrollData={payrollData} />
        </TabsContent>

        <TabsContent value="processing">
          <div className="space-y-6">
            {payrollData.payPeriods.length > 0 ? (
              payrollData.payPeriods.map((period) => (
                <PayrollProcessor
                  key={period.id}
                  payrollData={payrollData}
                  payrollId={period.id}
                />
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">No payroll periods configured</p>
                  <Button>Create First Payroll Period</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="tax">
          <TaxComplianceManager />
        </TabsContent>

        <TabsContent value="benefits">
          <BenefitsManager />
        </TabsContent>

        <TabsContent value="timeclock">
          <TimeClockSystem />
        </TabsContent>

        <TabsContent value="reports">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Payroll Register</CardTitle>
                <CardDescription>Detailed payroll breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Generate Report</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Tax Summary</CardTitle>
                <CardDescription>Tax withholdings & liabilities</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Generate Report</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Benefits Report</CardTitle>
                <CardDescription>Employee benefits overview</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Generate Report</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payroll;
