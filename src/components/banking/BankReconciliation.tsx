
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ArrowRight, Check, FileCheck, Search } from "lucide-react";
import { toast } from "sonner";

export const BankReconciliation: React.FC = () => {
  const [isReconciling, setIsReconciling] = useState(false);
  const [finishDialogOpen, setFinishDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  
  const bankTransactions = [
    { id: "bt001", date: "2025-04-14", description: "Office Supplies", amount: "-$253.75" },
    { id: "bt002", date: "2025-04-13", description: "Client Payment - ABC Corp", amount: "+$1,250.00" },
    { id: "bt003", date: "2025-04-12", description: "Monthly Rent", amount: "-$2,500.00" },
    { id: "bt004", date: "2025-04-10", description: "Utility Bill", amount: "-$187.45" },
  ];
  
  const bookTransactions = [
    { id: "bk001", date: "2025-04-14", description: "Office Supplies", amount: "-$253.75", reconciled: true },
    { id: "bk002", date: "2025-04-13", description: "Client Payment - ABC Corp", amount: "+$1,250.00", reconciled: true },
    { id: "bk003", date: "2025-04-12", description: "Monthly Rent", amount: "-$2,500.00", reconciled: true },
    { id: "bk004", date: "2025-04-10", description: "Utility Bill", amount: "-$187.45", reconciled: false },
    { id: "bk005", date: "2025-04-09", description: "Client Payment - XYZ Ltd", amount: "+$3,450.00", reconciled: false },
  ];

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
  
  const handleStartReconciliation = () => {
    setIsReconciling(true);
    toast.info("Starting bank reconciliation", {
      description: "Match your book transactions with bank statement transactions"
    });
  };

  const handleFinishReconciliation = () => {
    setFinishDialogOpen(false);
    setIsReconciling(false);
    setSelectedTransactions([]);
    toast.success("Bank reconciliation completed successfully", {
      description: "Your account has been reconciled through April 14, 2025"
    });
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
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-2xl font-bold">Bank Reconciliation</h1>
        <div>
          {!isReconciling ? (
            <Button onClick={handleStartReconciliation}>Start Reconciliation</Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsReconciling(false)}>Cancel</Button>
              <Button onClick={() => setFinishDialogOpen(true)}>Finish Reconciliation</Button>
            </div>
          )}
        </div>
      </div>
      
      {!isReconciling ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Checking</CardTitle>
              <CardDescription>Last reconciled: March 31, 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm">Account Balance</p>
                  <p className="text-2xl font-bold">$15,243.89</p>
                </div>
                <Button variant="outline" className="flex items-center gap-1">
                  <FileCheck className="h-4 w-4" />
                  <span>View History</span>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Business Savings</CardTitle>
              <CardDescription>Last reconciled: March 31, 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm">Account Balance</p>
                  <p className="text-2xl font-bold">$42,876.54</p>
                </div>
                <Button variant="outline" className="flex items-center gap-1">
                  <FileCheck className="h-4 w-4" />
                  <span>View History</span>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Operating Account</CardTitle>
              <CardDescription>Last reconciled: March 15, 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm">Account Balance</p>
                  <p className="text-2xl font-bold">$8,721.33</p>
                </div>
                <Button variant="outline" className="flex items-center gap-1">
                  <FileCheck className="h-4 w-4" />
                  <span>View History</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
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
        </div>
      )}
      
      <Dialog open={finishDialogOpen} onOpenChange={setFinishDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finish Reconciliation</DialogTitle>
            <DialogDescription>
              Please confirm the final reconciliation details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Statement Date</p>
                <p>April 14, 2025</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ending Balance</p>
                <p>$15,243.89</p>
              </div>
            </div>
            <div className="rounded-md bg-muted p-4">
              <div className="flex items-center justify-between">
                <p>Difference</p>
                <p className="text-green-600 font-medium">$0.00</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              All transactions have been successfully matched. Your books are now reconciled with your bank statement.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFinishDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleFinishReconciliation}>
              Complete Reconciliation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
