
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, Search } from "lucide-react";
import { toast } from "sonner";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: string;
  reconciled?: boolean;
}

interface ReconciliationContentProps {
  bankTransactions: Transaction[];
  bookTransactions: Transaction[];
}

export const ReconciliationContent: React.FC<ReconciliationContentProps> = ({
  bankTransactions,
  bookTransactions
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  
  const filteredBookTransactions = bookTransactions.filter(
    transaction => !transaction.reconciled && 
    (transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
     transaction.amount.includes(searchTerm))
  );

  const toggleTransactionSelection = (id: string) => {
    setSelectedTransactions(prev => 
      prev.includes(id) ? prev.filter(transId => transId !== id) : [...prev, id]
    );
  };

  const handleMarkAsReconciled = () => {
    if (selectedTransactions.length === 0) {
      toast.error("No transactions selected", {
        description: "Please select at least one transaction to reconcile"
      });
      return;
    }

    toast.success(`${selectedTransactions.length} transactions reconciled`, {
      description: "Selected transactions have been marked as reconciled"
    });
    
    // In a real app, we would update the reconciled status in the database
    setSelectedTransactions([]);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Checking Reconciliation</CardTitle>
        <CardDescription>Reconciliation period: April 1, 2025 - April 14, 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <p className="text-sm text-muted-foreground">Beginning Balance</p>
            <p className="text-lg font-bold">$10,934.09</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Bank Statement Ending Balance</p>
            <p className="text-lg font-bold">$15,243.89</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Difference</p>
            <p className="text-lg font-bold text-green-600">$0.00</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Bank Statement</h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bankTransactions.map(transaction => (
                    <TableRow key={transaction.id} className="hover:bg-muted/50">
                      <TableCell>
                        <Checkbox
                          checked={selectedTransactions.includes(transaction.id)}
                          onCheckedChange={() => toggleTransactionSelection(transaction.id)}
                        />
                      </TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell className={transaction.amount.startsWith("+") ? "text-green-600" : "text-red-600"}>
                        {transaction.amount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Book Transactions</h3>
              <div className="relative w-64">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookTransactions.map(transaction => (
                    <TableRow key={transaction.id} className="hover:bg-muted/50">
                      <TableCell>
                        <Checkbox
                          checked={selectedTransactions.includes(transaction.id)}
                          onCheckedChange={() => toggleTransactionSelection(transaction.id)}
                        />
                      </TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell className={transaction.amount.startsWith("+") ? "text-green-600" : "text-red-600"}>
                        {transaction.amount}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredBookTransactions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        {searchTerm ? "No matching transactions found" : "No unreconciled transactions"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-6">
          <Button
            onClick={handleMarkAsReconciled}
            className="flex items-center gap-2"
            disabled={selectedTransactions.length === 0}
          >
            <Check className="h-4 w-4" />
            <span>Mark Selected as Reconciled</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
