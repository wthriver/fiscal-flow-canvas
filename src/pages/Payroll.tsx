
import React, { useState } from "react";
import { PayrollDashboard } from "@/components/payroll/PayrollDashboard";
import { PayrollProcessor } from "@/components/payroll/PayrollProcessor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FilePlus, Users } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";

const Payroll: React.FC = () => {
  const { currentCompany } = useCompany();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedPayrollId, setSelectedPayrollId] = useState<string | null>(null);
  
  // Find the next pending payroll period
  const pendingPayroll = currentCompany.payrollData.payPeriods.find(
    period => period.status === "Processing"
  );
  
  const handleProcessPayroll = (payrollId: string) => {
    setSelectedPayrollId(payrollId);
    setActiveTab("process");
  };
  
  const handleAddEmployee = () => {
    toast.info("Add Employee functionality", {
      description: "This would open the employee addition form"
    });
  };
  
  const handleNewPayrollRun = () => {
    toast.info("Create New Payroll Run", {
      description: "This would open the new payroll run creation form"
    });
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0 mb-6">
        <h1 className="text-3xl font-bold">Payroll Management</h1>
        <div className="flex gap-2">
          <Button className="flex items-center gap-2" onClick={handleNewPayrollRun}>
            <FilePlus className="h-4 w-4" />
            <span>New Payroll Run</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2" onClick={handleAddEmployee}>
            <Users className="h-4 w-4" />
            <span>Manage Employees</span>
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="process" disabled={!selectedPayrollId && !pendingPayroll}>
            Process Payroll
          </TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-6">
          <PayrollDashboard onProcessPayroll={handleProcessPayroll} />
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
              <Button onClick={handleNewPayrollRun}>Create New Payroll Run</Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <div className="grid gap-6">
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-xl font-bold mb-4">Payroll History</h2>
              <div className="divide-y">
                {currentCompany.payrollData.payPeriods
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
                        <div>{period.totalNet}</div>
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
                
                {currentCompany.payrollData.payPeriods.filter(period => period.status === "Completed").length === 0 && (
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
    </div>
  );
};

export default Payroll;
