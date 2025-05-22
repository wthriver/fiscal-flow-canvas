
import { useState, useEffect } from 'react';
import { useCompany } from '@/contexts/CompanyContext';
import { Invoice } from '@/types/company';
import { toast } from 'sonner';

export const useInvoices = () => {
  const { currentCompany, addInvoice, updateInvoice, deleteInvoice } = useCompany();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Simulate fetching invoices from an API
    setTimeout(() => {
      if (currentCompany?.invoices) {
        setInvoices(currentCompany.invoices);
      } else {
        setInvoices([]);
      }
      setLoading(false);
    }, 200);
  }, [currentCompany?.invoices]);

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

  return {
    invoices,
    loading,
    error,
    createInvoice,
    editInvoice,
    deleteInvoice: deleteInvoiceById,
  };
};
