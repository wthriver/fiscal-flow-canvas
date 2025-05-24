
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, Calendar, Filter, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useInvoices } from "@/hooks/useInvoices";
import { NewInvoiceDialog } from "@/components/invoices/NewInvoiceDialog";
import { FilterDialog } from "@/components/invoices/FilterDialog";
import { DateRangeDialog } from "@/components/invoices/DateRangeDialog";
import { ExportDialog } from "@/components/invoices/ExportDialog";
import InvoiceList from "@/components/invoices/InvoiceList";
import FilterDisplay from "@/components/invoices/FilterDisplay";

const Invoices: React.FC = () => {
  const { 
    currentCompany,
    filteredInvoices,
    searchText,
    setSearchText,
    isNewInvoiceOpen, 
    setIsNewInvoiceOpen,
    isFilterOpen, 
    setIsFilterOpen,
    isDateRangeOpen, 
    setIsDateRangeOpen,
    isExportOpen, 
    setIsExportOpen,
    statusFilter, 
    setStatusFilter,
    dateRange, 
    setDateRange,
    handleCreateInvoice,
    handleApplyFilter,
    handleApplyDateRange,
    handleExport
  } = useInvoices();

  // Handler to clear filters
  const clearFilter = (type: "status" | "date" | "all") => {
    if (type === "status" || type === "all") {
      setStatusFilter(null);
    }
    
    if (type === "date" || type === "all") {
      setDateRange({from: undefined, to: undefined});
    }
  };

  // Use company name or default if not available
  const companyName = currentCompany?.name || "Your Company";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">Manage {companyName}'s customer invoices and payments</p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setIsNewInvoiceOpen(true)}
        >
          <PlusCircle size={16} />
          <span>New Invoice</span>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search invoices..."
            className="w-full sm:w-[300px] pl-8"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setIsDateRangeOpen(true)}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Date Range
          </Button>
          <Button
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setIsFilterOpen(true)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setIsExportOpen(true)}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Active filters display */}
      <FilterDisplay 
        statusFilter={statusFilter}
        dateRange={dateRange}
        clearFilter={clearFilter}
      />

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>
            {filteredInvoices.length} of {currentCompany?.invoices?.length || 0} total invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InvoiceList 
            invoices={filteredInvoices} 
          />
        </CardContent>
      </Card>

      {/* Dialogs */}
      <NewInvoiceDialog 
        open={isNewInvoiceOpen} 
        onOpenChange={setIsNewInvoiceOpen}
        onSubmit={handleCreateInvoice}
        customers={currentCompany?.customers || []}
      />
      
      <FilterDialog
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        onApplyFilter={handleApplyFilter}
        currentFilter={statusFilter}
      />
      
      <DateRangeDialog
        open={isDateRangeOpen}
        onOpenChange={setIsDateRangeOpen}
        onApplyDateRange={handleApplyDateRange}
        currentDateRange={dateRange}
      />
      
      <ExportDialog
        open={isExportOpen}
        onOpenChange={setIsExportOpen}
        onExport={handleExport}
      />
    </div>
  );
};

export default Invoices;
