
import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import { TransactionEditModal } from "./TransactionEditModal";
import { TransactionSearchBar } from "./TransactionSearchBar";
import { TransactionTable } from "./TransactionTable";
import { useCompany, Transaction as CompanyTransaction } from "@/contexts/CompanyContext";

// Use the Transaction type from CompanyContext to avoid conflicts
interface TransactionHistoryTabProps {
  transactions: CompanyTransaction[];
}

export const TransactionHistoryTab: React.FC<TransactionHistoryTabProps> = ({
  transactions: inputTransactions = []
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof CompanyTransaction; direction: "asc" | "desc" } | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<CompanyTransaction | null>(null);

  // Filter transactions based on search term
  const filteredTransactions = inputTransactions.filter(transaction => 
    (transaction.description?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (transaction.category?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (transaction.amount || "").includes(searchTerm)
  );

  // Sort transactions
  const sortedTransactions = useMemo(() => {
    let sortableTransactions = [...filteredTransactions];
    if (sortConfig !== null) {
      sortableTransactions.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (!aValue && !bValue) return 0;
        if (!aValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (!bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableTransactions;
  }, [filteredTransactions, sortConfig]);

  const requestSort = (key: keyof CompanyTransaction) => {
    let direction: "asc" | "desc" = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleShareTransaction = (transaction: CompanyTransaction) => {
    toast.success(`Sharing transaction details for: ${transaction.description}`, {
      description: "Transaction details have been copied to clipboard"
    });
  };

  const handleViewDetails = (transaction: CompanyTransaction) => {
    setEditingTransaction(transaction);
    
    toast.info(`Viewing transaction: ${transaction.description}`, {
      description: `${transaction.date} | Category: ${transaction.category} | Amount: ${transaction.amount}`,
      duration: 5000,
    });
  };

  const handleExportPDF = () => {
    toast.success("Exporting transactions to PDF", {
      description: "Your transactions report will be downloaded shortly"
    });
    
    // Simulate PDF download after a short delay
    setTimeout(() => {
      const link = document.createElement("a");
      link.href = "#";
      link.download = "transactions-report.pdf";
      link.click();
    }, 1500);
  };

  const handleExportCSV = () => {
    // Prepare CSV data
    const headers = ["Date", "Description", "Category", "Amount", "Status"];
    const csvRows = [headers.join(",")];

    sortedTransactions.forEach(transaction => {
      const row = [
        transaction.date,
        `"${(transaction.description || '').replace(/"/g, '""')}"`,
        `"${(transaction.category || '').replace(/"/g, '""')}"`,
        transaction.amount,
        transaction.reconciled ? "Reconciled" : "Pending"
      ];
      csvRows.push(row.join(","));
    });

    // Create the CSV content
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    // Create and click download link
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "transaction-history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("CSV exported successfully", {
      description: "Transaction history has been downloaded as CSV"
    });
  };

  return (
    <div className="space-y-4">
      <TransactionSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onExportPDF={handleExportPDF}
        onExportCSV={handleExportCSV}
      />

      {editingTransaction && (
        <TransactionEditModal
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onSave={() => {
            toast.success("Transaction updated", {
              description: "Transaction details have been saved"
            });
            setEditingTransaction(null);
          }}
        />
      )}

      <TransactionTable
        transactions={sortedTransactions}
        sortConfig={sortConfig}
        onRequestSort={requestSort}
        onViewDetails={handleViewDetails}
        onShareTransaction={handleShareTransaction}
        searchTerm={searchTerm}
      />
    </div>
  );
};
