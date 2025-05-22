
import { useState, useEffect } from 'react';
import { useCompany } from '@/contexts/CompanyContext';
import { Invoice } from '@/types/company';
import { toast } from 'sonner';

// This type represents a date range selection
interface DateRange {
  from?: Date;
  to?: Date;
}

export const useInvoices = () => {
  const { currentCompany, addInvoice, updateInvoice, deleteInvoice } = useCompany();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Add these states to support filtering and UI operations
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({});
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Simulate fetching invoices from an API
    setTimeout(() => {
      if (currentCompany?.invoices) {
        setInvoices(currentCompany.invoices);
        setFilteredInvoices(currentCompany.invoices);
      } else {
        setInvoices([]);
        setFilteredInvoices([]);
      }
      setLoading(false);
    }, 200);
  }, [currentCompany?.invoices]);
  
  // Filter invoices whenever search text or filters change
  useEffect(() => {
    let results = [...invoices];
    
    // Apply text search
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      results = results.filter(invoice => 
        invoice.id.toLowerCase().includes(searchLower) ||
        invoice.customer.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      results = results.filter(invoice => invoice.status === statusFilter);
    }
    
    // Apply date range filter
    if (dateRange.from || dateRange.to) {
      results = results.filter(invoice => {
        const invoiceDate = new Date(invoice.date);
        
        if (dateRange.from && dateRange.to) {
          return invoiceDate >= dateRange.from && invoiceDate <= dateRange.to;
        } else if (dateRange.from) {
          return invoiceDate >= dateRange.from;
        } else if (dateRange.to) {
          return invoiceDate <= dateRange.to;
        }
        
        return true;
      });
    }
    
    setFilteredInvoices(results);
  }, [invoices, searchText, statusFilter, dateRange]);

  const createInvoice = async (invoiceData: Invoice) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      addInvoice(invoiceData);
      setInvoices(prevInvoices => [...prevInvoices, invoiceData]);
      toast.success("Invoice created successfully");
    } catch (err) {
      setError('Failed to create invoice');
      toast.error('Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  const editInvoice = async (invoiceData: Invoice) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      updateInvoice(invoiceData);
      setInvoices(prevInvoices =>
        prevInvoices.map(invoice => (invoice.id === invoiceData.id ? invoiceData : invoice))
      );
      toast.success("Invoice updated successfully");
    } catch (err) {
      setError('Failed to update invoice');
      toast.error('Failed to update invoice');
    } finally {
      setLoading(false);
    }
  };

  const deleteInvoiceById = async (id: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      deleteInvoice(id);
      setInvoices(prevInvoices => prevInvoices.filter(invoice => invoice.id !== id));
      toast.success("Invoice deleted successfully");
    } catch (err) {
      setError('Failed to delete invoice');
      toast.error('Failed to delete invoice');
    } finally {
      setLoading(false);
    }
  };
  
  // Add these handlers to support the UI operations
  const handleCreateInvoice = (invoiceData: Invoice) => {
    createInvoice(invoiceData);
    setIsNewInvoiceOpen(false);
  };
  
  const handleApplyFilter = (status: string | null) => {
    setStatusFilter(status);
    setIsFilterOpen(false);
  };
  
  const handleApplyDateRange = (range: DateRange) => {
    setDateRange(range);
    setIsDateRangeOpen(false);
  };
  
  const handleExport = (format: string) => {
    toast.success(`Exporting invoices as ${format}`);
    setIsExportOpen(false);
  };

  return {
    invoices,
    filteredInvoices,
    loading,
    error,
    createInvoice,
    editInvoice,
    deleteInvoice: deleteInvoiceById,
    searchText,
    setSearchText,
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,
    isNewInvoiceOpen,
    setIsNewInvoiceOpen,
    isFilterOpen,
    setIsFilterOpen,
    isDateRangeOpen,
    setIsDateRangeOpen,
    isExportOpen,
    setIsExportOpen,
    handleCreateInvoice,
    handleApplyFilter,
    handleApplyDateRange,
    handleExport,
    currentCompany
  };
};
