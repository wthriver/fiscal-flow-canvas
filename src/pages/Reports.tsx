
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, BarChart4, TrendingUp, Printer, Calendar, Share2, Eye, ExternalLink } from "lucide-react";
import { DateRangeDialog } from "@/components/invoices/DateRangeDialog";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useCompany } from "@/contexts/CompanyContext";
import { format } from "date-fns";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

const Reports: React.FC = () => {
  const { currentCompany } = useCompany();
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const handleGenerateReport = (reportName: string) => {
    toast.success(`Generating ${reportName} report`, {
      description: `Creating a detailed ${reportName} report for ${currentCompany.name}`,
      duration: 5000,
    });
    
    // Simulate report generation with loading state
    setTimeout(() => {
      toast.success(`${reportName} report ready`, {
        description: "Your report has been generated successfully",
      });
    }, 2000);
  };

  const handleViewReport = (reportName: string) => {
    toast.info(`Viewing ${reportName}`, {
      description: `Opening ${currentCompany.name}'s ${reportName} report`,
      action: {
        label: "Open",
        onClick: () => console.log("Opening report view"),
      },
    });
  };

  const handleShareReport = (reportName: string) => {
    toast.info(`Share options for ${reportName}`, {
      description: "Choose how you want to share this report",
      action: {
        label: "Email",
        onClick: () => toast.success(`${reportName} shared via email`),
      },
    });
  };

  const handlePrint = () => {
    toast.info(`Preparing to print reports`, {
      description: "Getting your reports ready for printing...",
    });
    setTimeout(() => window.print(), 1000);
  };

  const handleExport = () => {
    toast.success(`Exporting reports`, {
      description: "Your reports will be downloaded as a zip file shortly",
    });
    
    // Simulate file download after a short delay
    setTimeout(() => {
      const link = document.createElement("a");
      link.href = "#";
      link.download = "company-reports.zip";
      link.click();
    }, 1500);
  };

  const handleApplyDateRange = (range: DateRange) => {
    setSelectedDateRange(range);
    toast.success("Date range applied", {
      description: "Your reports have been filtered by the selected date range",
    });
  };

  const reportCategories = [
    {
      id: "financial",
      title: "Financial Statements",
      description: `Core financial reports for ${currentCompany.name}`,
      reports: [
        { name: "Balance Sheet", icon: FileText, description: "View your assets, liabilities, and equity" },
        { name: "Profit & Loss", icon: TrendingUp, description: "Income and expenses for a specific period" },
        { name: "Cash Flow Statement", icon: BarChart4, description: "Track cash movements in your business" }
      ]
    },
    {
      id: "tax",
      title: "Tax Reports",
      description: `Reports to help with ${currentCompany.name}'s tax compliance`,
      reports: [
        { name: "Sales Tax Summary", icon: FileText, description: "Summary of collected and paid sales taxes" },
        { name: "Tax Liability", icon: FileText, description: "Track your tax obligations" },
        { name: "1099 Preparation", icon: FileText, description: "Prepare contractor payment information" }
      ]
    },
    {
      id: "receivable",
      title: "Accounts Receivable",
      description: `Track money owed to ${currentCompany.name}`,
      reports: [
        { name: "A/R Aging Summary", icon: FileText, description: "See overdue customer invoices" },
        { name: "Customer Balances", icon: FileText, description: `Current balances for all ${currentCompany.customers.length} customers` },
        { name: "Collections Report", icon: FileText, description: "Track your collection efforts" }
      ]
    },
    {
      id: "payable",
      title: "Accounts Payable",
      description: `Track money ${currentCompany.name} owes`,
      reports: [
        { name: "A/P Aging Summary", icon: FileText, description: "See overdue bills by vendor" },
        { name: "Vendor Balances", icon: FileText, description: "Current balances for all vendors" },
        { name: "Upcoming Payments", icon: FileText, description: "Schedule of bills due soon" }
      ]
    },
    {
      id: "inventory",
      title: "Inventory Reports",
      description: `Manage ${currentCompany.name}'s inventory`,
      reports: [
        { name: "Inventory Valuation", icon: FileText, description: `Value of ${currentCompany.inventory.length} inventory items` },
        { name: "Low Stock Report", icon: FileText, description: "Items that need to be reordered" },
        { name: "Inventory Movement", icon: FileText, description: "Track inventory changes over time" }
      ]
    },
    {
      id: "project",
      title: "Project Reports",
      description: `Monitor ${currentCompany.name}'s project performance`,
      reports: [
        { name: "Project Profitability", icon: FileText, description: `Profitability of ${currentCompany.projects.length} projects` },
        { name: "Resource Utilization", icon: FileText, description: "How resources are being used across projects" },
        { name: "Project Timeline", icon: FileText, description: "Track project timelines and milestones" }
      ]
    }
  ];

  // Filter reports based on search and active tab
  const filteredCategories = useMemo(() => {
    return reportCategories
      .filter(category => activeTab === 'all' || category.id === activeTab)
      .map(category => ({
        ...category,
        reports: category.reports.filter(report => 
          report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }))
      .filter(category => category.reports.length > 0);
  }, [reportCategories, searchTerm, activeTab]);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Generate and view financial reports for {currentCompany.name}</p>
          {selectedDateRange.from && selectedDateRange.to && (
            <p className="text-sm text-muted-foreground mt-1">
              Date Range: {format(selectedDateRange.from, "MMM d, yyyy")} - {format(selectedDateRange.to, "MMM d, yyyy")}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setDateRangeOpen(true)}
          >
            <Calendar size={16} />
            <span>Date Range</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handlePrint}
          >
            <Printer size={16} />
            <span>Print</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleExport}
          >
            <Download size={16} />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative w-full sm:w-72">
          <Input
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-3"
          />
        </div>
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
          <Button 
            variant={activeTab === 'all' ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveTab('all')}
          >
            All
          </Button>
          {reportCategories.map(category => (
            <Button 
              key={category.id}
              variant={activeTab === category.id ? "default" : "outline"} 
              size="sm"
              onClick={() => setActiveTab(category.id)}
            >
              {category.title}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-6">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category, idx) => (
            <Card key={idx} className="transition-all hover:shadow-md">
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Share2 className="h-4 w-4" />
                              <span className="sr-only">Share</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => toast.info(`Email ${report.name} report sent`)}>
                              Email Report
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              toast.success("Link copied to clipboard", {
                                description: `Share link for ${report.name} report`
                              });
                            }}>
                              Copy Link
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              toast.success(`Downloading ${report.name} as PDF`);
                              setTimeout(() => {
                                const link = document.createElement("a");
                                link.href = "#";
                                link.download = `${report.name.replace(/\s+/g, "-").toLowerCase()}.pdf`;
                                link.click();
                              }, 1500);
                            }}>
                              Download PDF
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                      <div className="mt-4 flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full flex items-center gap-1"
                          onClick={() => handleViewReport(report.name)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          className="w-full flex items-center gap-1"
                          onClick={() => handleGenerateReport(report.name)}
                        >
                          <FileText className="h-3.5 w-3.5" />
                          Generate
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Reports Found</h3>
            <p className="text-muted-foreground">
              {searchTerm 
                ? `No reports match "${searchTerm}". Try a different search term.` 
                : "No reports are available in this category."}
            </p>
            {searchTerm && (
              <Button variant="outline" className="mt-4" onClick={() => setSearchTerm("")}>
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>

      <DateRangeDialog
        open={dateRangeOpen}
        onOpenChange={setDateRangeOpen}
        onApplyDateRange={handleApplyDateRange}
        currentDateRange={selectedDateRange}
      />
    </div>
  );
};

export default Reports;
