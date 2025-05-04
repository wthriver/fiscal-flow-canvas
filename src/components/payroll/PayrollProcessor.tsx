
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useCompany } from "@/contexts/CompanyContext";

interface PayrollProcessorProps {
  payrollId: string;
}

export const PayrollProcessor: React.FC<PayrollProcessorProps> = ({ payrollId }) => {
  const { currentCompany, processPayroll } = useCompany();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);
  
  const payPeriod = currentCompany.payrollData.payPeriods.find(period => period.id === payrollId);
  
  if (!payPeriod) {
    return <div>Payroll period not found</div>;
  }
  
  const handleProcess = () => {
    setConfirmDialogOpen(true);
  };
  
  const handleConfirmProcess = () => {
    // Start the simulated processing
    toast.info("Processing payroll...");
    
    setTimeout(() => {
      processPayroll(payrollId);
      setProcessingComplete(true);
      toast.success("Payroll processed successfully!");
    }, 2000); // Simulate processing delay
    
    setConfirmDialogOpen(false);
  };
  
  const handleViewPaystubs = () => {
    toast.info("Viewing paystubs", {
      description: "This would open the paystubs viewer"
    });
  };
  
  const handleSendPaystubs = () => {
    toast.success("Paystubs sent to employees");
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Process Payroll</CardTitle>
        <CardDescription>
          {payPeriod.status === "Completed" 
            ? "This payroll has been processed and paid."
            : `Process payroll for period: ${payPeriod.startDate} to ${payPeriod.endDate}`
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-md p-4">
            <div className="text-sm text-muted-foreground">Pay Period</div>
            <div className="font-medium mt-1">{payPeriod.startDate} to {payPeriod.endDate}</div>
          </div>
          <div className="border rounded-md p-4">
            <div className="text-sm text-muted-foreground">Pay Date</div>
            <div className="font-medium mt-1">{payPeriod.payDate}</div>
          </div>
          <div className="border rounded-md p-4">
            <div className="text-sm text-muted-foreground">Total Employees</div>
            <div className="font-medium mt-1">{payPeriod.employees.length}</div>
          </div>
          <div className="border rounded-md p-4">
            <div className="text-sm text-muted-foreground">Total Gross</div>
            <div className="font-medium mt-1">{payPeriod.totalGross}</div>
          </div>
          <div className="border rounded-md p-4">
            <div className="text-sm text-muted-foreground">Total Net</div>
            <div className="font-medium mt-1">{payPeriod.totalNet}</div>
          </div>
          <div className="border rounded-md p-4">
            <div className="text-sm text-muted-foreground">Status</div>
            <div className={`font-medium mt-1 ${
              payPeriod.status === "Completed" ? "text-green-600" : "text-amber-600"
            }`}>
              {payPeriod.status}
            </div>
          </div>
        </div>
        
        <div className="border rounded-md p-4">
          <h3 className="font-medium mb-2">Employees Summary</h3>
          <div className="space-y-2">
            {payPeriod.employees.map((employee, index) => {
              const employeeData = currentCompany.employees.find(e => e.id === employee.employeeId);
              
              return (
                <div key={employee.employeeId} className="flex justify-between pb-2 border-b last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium">{employeeData?.name || `Employee ${index + 1}`}</div>
                    <div className="text-xs text-muted-foreground">{employeeData?.position}</div>
                  </div>
                  <div className="text-right">
                    <div>{employee.grossPay}</div>
                    <div className="text-xs text-muted-foreground">Net: {employee.netPay}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {payPeriod.status === "Completed" ? (
          <>
            <Button variant="outline" onClick={handleViewPaystubs}>View Paystubs</Button>
            <Button onClick={handleSendPaystubs}>Send Paystubs</Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={() => toast.info("Editing payroll data...")}>Edit Data</Button>
            <Button onClick={handleProcess}>Process Payroll</Button>
          </>
        )}
      </CardFooter>
      
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Payroll Processing</DialogTitle>
            <DialogDescription>
              Are you sure you want to process payroll for the period {payPeriod.startDate} to {payPeriod.endDate}?
              This will finalize all calculations and prepare payments.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="font-medium">Summary:</div>
            <div className="mt-2">
              <div className="flex justify-between py-1 border-b">
                <span>Total Employees:</span>
                <span>{payPeriod.employees.length}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span>Total Gross Pay:</span>
                <span>{payPeriod.totalGross}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span>Total Taxes:</span>
                <span>{payPeriod.totalTaxes}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span>Total Deductions:</span>
                <span>{payPeriod.totalDeductions}</span>
              </div>
              <div className="flex justify-between py-1 font-medium">
                <span>Total Net Pay:</span>
                <span>{payPeriod.totalNet}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmProcess}>Process Payroll</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
