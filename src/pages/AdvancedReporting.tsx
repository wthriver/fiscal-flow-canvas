
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomReportBuilder } from "@/components/reports/CustomReportBuilder";
import { ForecastingDashboard } from "@/components/budgeting/ForecastingDashboard";
import { FinancialReports } from "@/components/reports/FinancialReports";

const AdvancedReporting: React.FC = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Advanced Reporting & Analytics</h1>
        <p className="text-muted-foreground">Build custom reports and financial forecasts</p>
      </div>

      <Tabs defaultValue="custom" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="custom">
          <CustomReportBuilder />
        </TabsContent>

        <TabsContent value="forecasting">
          <ForecastingDashboard />
        </TabsContent>

        <TabsContent value="analytics">
          <FinancialReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedReporting;
