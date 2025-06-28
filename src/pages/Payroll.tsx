
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Users, DollarSign, Calendar, TrendingUp } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { PayrollDashboard } from "@/components/payroll/PayrollDashboard";
import { PayrollProcessor } from "@/components/payroll/PayrollProcessor";
import { BenefitsManager } from "@/components/payroll/BenefitsManager";
import { TaxComplianceManager } from "@/components/payroll/TaxComplianceManager";
import { PayrollData } from "@/types/company";

const Payroll: React.FC = () => {
  const { currentCompany } = useCompany();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedPayrollId, setSelectedPayrollId] = useState<string>("");

  const employees = currentCompany?.employees || [];
  const payrollData = currentCompany?.payrollData;

  // Calculate payroll statistics
  const activeEmployees = employees.filter(e => e.status === 'Active').length;
  const totalMonthlySalary = employees
    .filter(e => e.status === 'Active')
    .reduce((sum, emp) => sum + (emp.salary || 0), 0);
  const averageSalary = activeEmployees > 0 ? totalMonthlySalary / activeEmployees : 0;

  // Create complete payroll data with required properties
  const completePayrollData: PayrollData = {
    totalPayroll: payrollData?.totalPayroll || totalMonthlySalary,
    employeeCount: payrollData?.employeeCount || activeEmployees,
    averageSalary: payrollData?.averageSalary || averageSalary,
    payPeriods: payrollData?.payPeriods || [],
    taxSettings: payrollData?.taxSettings || {},
    deductionTypes: payrollData?.deductionTypes || {}
  };

  // Get current pay period
  const currentPayPeriod = completePayrollData.payPeriods?.find(p => p.status === 'Current');
  const processingPayPeriods = completePayrollData.payPeriods?.filter(p => p.status === 'Processing').length || 0;

  const handleProcessPayroll = (payrollId: string) => {
    setSelectedPayrollId(payrollId);
    setActiveTab("processor");
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Payroll Management</h1>
          <p className="text-muted-foreground">
            Manage employee payroll, benefits, and tax compliance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Pay Periods
          </Button>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Run Payroll
          </Button>
        </div>
      </div>

      {/* Payroll Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeEmployees}</div>
            <p className="text-xs text-muted-foreground">
              {employees.length} total employees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${completePayrollData.totalPayroll.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total monthly cost
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${completePayrollData.averageSalary.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Per employee
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pay Periods</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processingPayPeriods}</div>
            <p className="text-xs text-muted-foreground">
              Processing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Current Pay Period Status */}
      {currentPayPeriod && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Current Pay Period</CardTitle>
                <CardDescription>
                  {currentPayPeriod.startDate} - {currentPayPeriod.endDate}
                </CardDescription>
              </div>
              <Badge variant="default">
                {currentPayPeriod.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Pay Date</p>
                <p className="font-medium">{currentPayPeriod.payDate}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Gross</p>
                <p className="font-medium">
                  ${typeof currentPayPeriod.totalGross === 'string' 
                    ? currentPayPeriod.totalGross 
                    : (currentPayPeriod.totalGross || 0).toLocaleString()
                  }
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Taxes</p>
                <p className="font-medium">
                  ${typeof currentPayPeriod.totalTaxes === 'string' 
                    ? currentPayPeriod.totalTaxes 
                    : (currentPayPeriod.totalTaxes || 0).toLocaleString()
                  }
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Net</p>
                <p className="font-medium">
                  ${typeof currentPayPeriod.totalNet === 'string' 
                    ? currentPayPeriod.totalNet 
                    : (currentPayPeriod.totalNet || 0).toLocaleString()
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="processor">Process Payroll</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
          <TabsTrigger value="compliance">Tax Compliance</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <PayrollDashboard 
            payrollData={completePayrollData} 
            onProcessPayroll={handleProcessPayroll}
          />
        </TabsContent>

        <TabsContent value="processor">
          <PayrollProcessor 
            payrollData={completePayrollData}
            payrollId={selectedPayrollId || completePayrollData.payPeriods[0]?.id || ""}
          />
        </TabsContent>

        <TabsContent value="benefits">
          <BenefitsManager />
        </TabsContent>

        <TabsContent value="compliance">
          <TaxComplianceManager />
        </TabsContent>

        <TabsContent value="employees">
          <Card>
            <CardHeader>
              <CardTitle>Employee Payroll Information</CardTitle>
              <CardDescription>
                Manage employee compensation and payroll settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employees.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="font-medium">
                          {employee.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{employee.position}</span>
                          <span>•</span>
                          <span>{employee.department}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${employee.salary.toLocaleString()}</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant={employee.status === 'Active' ? 'default' : 'secondary'}>
                          {employee.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {employee.payType || 'Salary'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payroll;
