
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaxComplianceManager } from "@/components/payroll/TaxComplianceManager";
import { BenefitsManager } from "@/components/payroll/BenefitsManager";
import { TimeClockSystem } from "@/components/timetracking/TimeClockSystem";

const AdvancedPayroll: React.FC = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Advanced Payroll & HR</h1>
        <p className="text-muted-foreground">Comprehensive payroll management with tax compliance and benefits</p>
      </div>

      <Tabs defaultValue="tax" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tax">Tax Compliance</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
          <TabsTrigger value="timeclock">Time Clock</TabsTrigger>
        </TabsList>

        <TabsContent value="tax">
          <TaxComplianceManager />
        </TabsContent>

        <TabsContent value="benefits">
          <BenefitsManager />
        </TabsContent>

        <TabsContent value="timeclock">
          <TimeClockSystem />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedPayroll;
