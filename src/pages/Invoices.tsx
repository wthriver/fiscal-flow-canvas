
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ViewButton, 
  FilterButton, 
  ExportButton, 
  DateRangeButton, 
  ActionDropdown 
} from "@/components/common/ActionButtons";
import { useCompany } from "@/contexts/CompanyContext";
import { NewInvoiceDialog } from "@/components/invoices/NewInvoiceDialog";
import { FilterDialog } from "@/components/invoices/FilterDialog";
import { DateRangeDialog } from "@/components/invoices/DateRangeDialog";
import { ExportDialog } from "@/components/invoices/ExportDialog";
import { useToast } from "@/hooks/use-toast";

const Invoices: React.FC = () => {
  const { currentCompany, addInvoice } = useCompany();
  const { toast } = useToast();
  
  // State for searchable and filtered invoices
  const [searchText, setSearchText] = useState("");
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{from: Date | undefined, to: Date | undefined}>({
    from: undefined,
    to: undefined
  });
  
  // Ensure invoices array exists before filtering
  const invoices = currentCompany?.invoices || [];
  
  // Filter invoices based on search text, status, and date range
  const filteredInvoices = invoices.filter(invoice => {
    // Text search
    const matchesSearch = 
      !searchText || 
      invoice.id.toLowerCase().includes(searchText.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchText.toLowerCase());
    
    // Status filter
    const matchesStatus = !statusFilter || invoice.status === statusFilter;
    
    // Date range filter
    let matchesDateRange = true;
    if (dateRange.from || dateRange.to) {
      const invoiceDate = new Date(invoice.date);
      
      if (dateRange.from && invoiceDate < dateRange.from) {
        matchesDateRange = false;
      }
      
      if (dateRange.to) {
        // Add one day to include the end date
        const endDate = new Date(dateRange.to);
        endDate.setDate(endDate.getDate() + 1);
        if (invoiceDate > endDate) {
          matchesDateRange = false;
        }
      }
    }
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });
  
  // Handler for creating a new invoice
  const handleCreateInvoice = (invoiceData: any) => {
    addInvoice(invoiceData);
    setIsNewInvoiceOpen(false);
    toast({
      title: "Invoice Created",
      description: `Invoice ${invoiceData.id} has been created successfully.`,
    });
  };
  
  // Handler for applying filters
  const handleApplyFilter = (status: string | null) => {
    setStatusFilter(status);
    setIsFilterOpen(false);
  };
  
  // Handler for applying date range
  const handleApplyDateRange = (range: {from: Date | undefined, to: Date | undefined}) => {
    setDateRange(range);
    setIsDateRangeOpen(false);
  };
  
  // Handler for exporting data
  const handleExport = (format: string) => {
    toast({
      title: "Export Started",
      description: `Exporting invoices as ${format.toUpperCase()}.`,
    });
    
    // Simulate export process
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `Invoices have been exported as ${format.toUpperCase()}.`,
      });
    }, 1500);
    
    setIsExportOpen(false);
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
            <DateRangeButton type="Invoices" />
          </Button>
          <Button
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setIsFilterOpen(true)}
          >
            <FilterButton type="Invoices" />
          </Button>
          <Button
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setIsExportOpen(true)}
          >
            <ExportButton type="Invoices" />
          </Button>
        </div>
      </div>

      {/* Active filters display */}
      {(statusFilter || dateRange.from || dateRange.to) && (
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="font-medium">Active filters:</span>
          {statusFilter && (
            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center">
              Status: {statusFilter}
              <button 
                className="ml-1 hover:text-primary/70"
                onClick={() => setStatusFilter(null)}
              >
                ×
              </button>
            </span>
          )}
          {(dateRange.from || dateRange.to) && (
            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center">
              Date: {dateRange.from?.toLocaleDateString() || 'Any'} - {dateRange.to?.toLocaleDateString() || 'Any'}
              <button 
                className="ml-1 hover:text-primary/70"
                onClick={() => setDateRange({from: undefined, to: undefined})}
              >
                ×
              </button>
            </span>
          )}
          <button 
            className="text-primary hover:text-primary/70 underline"
            onClick={() => {
              setStatusFilter(null);
              setDateRange({from: undefined, to: undefined});
            }}
          >
            Clear all
          </button>
        </div>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>
            {filteredInvoices.length} of {invoices.length} total invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.customer}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.dueDate}</TableCell>
                    <TableCell>{invoice.amount}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        invoice.status === "Paid" 
                          ? "bg-green-100 text-green-800" 
                          : invoice.status === "Pending" || invoice.status === "Outstanding"
                            ? "bg-yellow-100 text-yellow-800" 
                            : "bg-red-100 text-red-800"
                      }`}>
                        {invoice.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-1">
                        <ViewButton id={invoice.id} type="Invoice" />
                        <ActionDropdown id={invoice.id} type="Invoice" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    {searchText || statusFilter || dateRange.from || dateRange.to
                      ? "No invoices found matching your search criteria"
                      : "No invoices found for this company."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
