
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, FileText, Search, Eye, Share2 } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: string;
  category: string;
  reconciled: boolean;
}

interface TransactionHistoryTabProps {
  transactions: Transaction[];
}

export const TransactionHistoryTab: React.FC<TransactionHistoryTabProps> = ({
  transactions
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Transaction; direction: "asc" | "desc" } | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [note, setNote] = useState("");
  const [editedCategory, setEditedCategory] = useState("");

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(transaction => 
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.amount.includes(searchTerm)
  );

  // Sort transactions
  const sortedTransactions = React.useMemo(() => {
    let sortableTransactions = [...filteredTransactions];
    if (sortConfig !== null) {
      sortableTransactions.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableTransactions;
  }, [filteredTransactions, sortConfig]);

  const requestSort = (key: keyof Transaction) => {
    let direction: "asc" | "desc" = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleShareTransaction = (transaction: Transaction) => {
    toast.success(`Sharing transaction details for: ${transaction.description}`, {
      description: "Transaction details have been copied to clipboard",
      action: {
        label: "Close",
        onClick: () => console.log("Toast closed"),
      },
    });
  };

  const handleViewDetails = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setNote("");
    setEditedCategory(transaction.category);
    
    toast.info(`Viewing transaction: ${transaction.description}`, {
      description: `${transaction.date} | Category: ${transaction.category} | Amount: ${transaction.amount}`,
      duration: 5000,
    });
  };

  const handleExportPDF = () => {
    toast.success("Exporting transactions to PDF", {
      description: "Your transactions report will be downloaded shortly",
    });
    
    // Simulate PDF download after a short delay
    setTimeout(() => {
      const link = document.createElement("a");
      link.href = "#";
      link.download = "transactions-report.pdf";
      link.click();
    }, 1500);
  };

  const handleSaveChanges = () => {
    if (!editingTransaction) return;
    
    toast.success("Transaction updated", {
      description: `Category updated to ${editedCategory} and note added`,
    });
    
    setEditingTransaction(null);
  };

  const handleExportCSV = () => {
    // Prepare CSV data
    const headers = ["Date", "Description", "Category", "Amount", "Status"];
    const csvRows = [headers.join(",")];

    sortedTransactions.forEach(transaction => {
      const row = [
        transaction.date,
        `"${transaction.description.replace(/"/g, '""')}"`,
        `"${transaction.category.replace(/"/g, '""')}"`,
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
      <div className="flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center mb-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            size="sm" 
            variant="outline"
            className="text-xs" 
            onClick={handleExportPDF}
          >
            <FileText className="h-4 w-4 mr-1" /> Export PDF
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="text-xs" 
            onClick={handleExportCSV}
          >
            <Download className="h-4 w-4 mr-1" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Transaction Edit Modal */}
      {editingTransaction && (
        <div className="border rounded-lg p-4 mb-4 bg-background shadow-sm">
          <h3 className="text-lg font-medium mb-4">Edit Transaction Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <Input type="text" value={editingTransaction.date} readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <Input type="text" value={editingTransaction.amount} readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Input type="text" value={editingTransaction.description} readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <Input 
                type="text" 
                value={editedCategory}
                onChange={(e) => setEditedCategory(e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Add Note</label>
              <Textarea 
                placeholder="Add details about this transaction..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Status</label>
              <div className="flex items-center space-x-2">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  editingTransaction.reconciled 
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {editingTransaction.reconciled ? "Reconciled" : "Pending"}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setEditingTransaction(null)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveChanges}
            >
              Save Changes
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => requestSort('date')}>
                  Date {sortConfig?.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => requestSort('description')}>
                  Description {sortConfig?.key === 'description' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => requestSort('category')}>
                  Category {sortConfig?.key === 'category' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => requestSort('amount')}>
                  Amount {sortConfig?.key === 'amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => requestSort('reconciled')}>
                  Status {sortConfig?.key === 'reconciled' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTransactions.length > 0 ? (
                sortedTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="hover:bg-muted/50">
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell className={transaction.amount.startsWith("+") ? "text-green-600" : "text-red-600"}>
                      {transaction.amount}
                    </TableCell>
                    <TableCell>
                      {transaction.reconciled ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Reconciled
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleViewDetails(transaction)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                            >
                              <Share2 className="h-4 w-4" />
                              <span className="sr-only">Share</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleShareTransaction(transaction)}>
                              Email
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShareTransaction(transaction)}>
                              Copy Link
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShareTransaction(transaction)}>
                              Download PDF
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    {searchTerm ? "No matching transactions found" : "No transactions found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
