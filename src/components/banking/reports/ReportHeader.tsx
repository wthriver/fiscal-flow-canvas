
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";

export interface ReportHeaderProps {
  accountId: string;
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({ accountId }) => {
  const { currentCompany } = useCompany();
  const account = accountId ? currentCompany.bankAccounts.find(acc => acc.id === accountId) : null;

  const handleGenerateReport = () => {
    console.log("Generating report for", account?.name || "all accounts");
  };

  const handleExportData = () => {
    console.log("Exporting data for", account?.name || "all accounts");
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h3 className="text-lg font-medium">
          {account ? account.name : "All Accounts"} Reports
        </h3>
        <p className="text-sm text-muted-foreground">
          Generate and download financial reports
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleGenerateReport}>
          <FileText className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
        <Button variant="outline" onClick={handleExportData}>
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>
    </div>
  );
};
