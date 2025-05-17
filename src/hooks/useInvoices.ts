
import { useState } from "react";
import { useCompany } from "@/contexts/CompanyContext";
import { Invoice } from "@/types/company";
import { toast } from "sonner";

export const useInvoices = () => {
  const { currentCompany, addInvoice, updateInvoice, deleteInvoice } = useCompany();
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

  return {
    currentCompany,
    invoices,
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
  };
};
