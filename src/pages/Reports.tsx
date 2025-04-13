
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, BarChart4, TrendingUp, Printer, Calendar, Share2 } from "lucide-react";
import { DateRangeButton, ExportButton } from "@/components/common/ActionButtons";
import { toast } from "sonner";
import { useCompany } from "@/contexts/CompanyContext";

const Reports: React.FC = () => {
  const { currentCompany } = useCompany();
  
  const handleGenerateReport = (reportName: string) => {
    toast.success(`Generating ${reportName} report for ${currentCompany.name}`);
  };

  const handleViewReport = (reportName: string) => {
    toast.info(`Viewing ${reportName} report for ${currentCompany.name}`);
  };

  const handleShareReport = (reportName: string) => {
    toast.info(`Share options for ${currentCompany.name}'s ${reportName} report`);
  };

  const reportCategories = [
    {
      title: "Financial Statements",
      description: `Core financial reports for ${currentCompany.name}`,
      reports: [
        { name: "Balance Sheet", icon: FileText, description: "View your assets, liabilities, and equity" },
        { name: "Profit & Loss", icon: TrendingUp, description: "Income and expenses for a specific period" },
        { name: "Cash Flow Statement", icon: BarChart4, description: "Track cash movements in your business" }
      ]
    },
    {
      title: "Tax Reports",
      description: `Reports to help with ${currentCompany.name}'s tax compliance`,
      reports: [
        { name: "Sales Tax Summary", icon: FileText, description: "Summary of collected and paid sales taxes" },
        { name: "Tax Liability", icon: FileText, description: "Track your tax obligations" },
        { name: "1099 Preparation", icon: FileText, description: "Prepare contractor payment information" }
      ]
    },
    {
      title: "Accounts Receivable",
      description: `Track money owed to ${currentCompany.name}`,
      reports: [
        { name: "A/R Aging Summary", icon: FileText, description: "See overdue customer invoices" },
        { name: "Customer Balances", icon: FileText, description: "Current balances for all customers" },
        { name: "Collections Report", icon: FileText, description: "Track your collection efforts" }
      ]
    },
    {
      title: "Accounts Payable",
      description: `Track money ${currentCompany.name} owes`,
      reports: [
        { name: "A/P Aging Summary", icon: FileText, description: "See overdue bills by vendor" },
        { name: "Vendor Balances", icon: FileText, description: "Current balances for all vendors" },
        { name: "Upcoming Payments", icon: FileText, description: "Schedule of bills due soon" }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Generate and view financial reports for {currentCompany.name}</p>
        </div>
        <div className="flex gap-2">
          <DateRangeButton type="Reports" />
          <Button variant="outline" className="flex items-center gap-2" onClick={() => toast.info("Print report options")}>
            <Printer size={16} />
            <span>Print</span>
          </Button>
          <ExportButton type="Reports" />
        </div>
      </div>

      <div className="grid gap-6">
        {reportCategories.map((category, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle>{category.title}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {category.reports.map((report, reportIdx) => (
                  <div 
                    key={reportIdx}
                    className="flex flex-col p-4 border rounded-lg hover:border-primary hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <report.icon className="h-5 w-5 text-primary" />
                        <h3 className="font-medium">{report.name}</h3>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleShareReport(report.name)}
                      >
                        <Share2 className="h-4 w-4" />
                        <span className="sr-only">Share</span>
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                    <div className="mt-4 flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleViewReport(report.name)}
                      >
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleGenerateReport(report.name)}
                      >
                        Generate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Reports;
