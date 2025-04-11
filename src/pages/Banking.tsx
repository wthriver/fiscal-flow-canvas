
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Download, Search, Building, ArrowUpRight, ArrowDownLeft, BarChart4 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FilterButton, ExportButton, ViewButton, EditButton, DeleteButton } from "@/components/common/ActionButtons";
import { handleCreateItem, handleViewItem } from "@/utils/navigationUtils";
import { toast } from "sonner";

const Banking: React.FC = () => {
  // Sample accounts data
  const [accounts, setAccounts] = useState([
    { id: "acc-1", name: "Business Checking", institution: "First National Bank", balance: "$24,587.65", lastSync: "Today at 9:30 AM" },
    { id: "acc-2", name: "Business Savings", institution: "First National Bank", balance: "$58,900.00", lastSync: "Today at 9:30 AM" },
    { id: "acc-3", name: "Credit Card", institution: "Capital Finance", balance: "-$4,325.18", lastSync: "Yesterday at 11:45 PM" }
  ]);

  // Sample transactions data
  const [transactions, setTransactions] = useState([
    { id: "TRN-001", account: "Business Checking", date: "2025-04-11", description: "Client Payment - XYZ Corp", amount: "+$5,000.00", category: "Income", reconciled: true },
    { id: "TRN-002", account: "Business Checking", date: "2025-04-10", description: "Office Supplies", amount: "-$156.78", category: "Office Expenses", reconciled: true },
    { id: "TRN-003", account: "Credit Card", date: "2025-04-10", description: "Software Subscription", amount: "-$49.99", category: "Software", reconciled: false },
    { id: "TRN-004", account: "Business Checking", date: "2025-04-09", description: "Utilities - Electricity", amount: "-$235.67", category: "Utilities", reconciled: true },
    { id: "TRN-005", account: "Business Savings", date: "2025-04-08", description: "Transfer from Checking", amount: "+$2,000.00", category: "Transfer", reconciled: true },
  ]);

  const handleAddTransaction = () => {
    handleCreateItem("Transaction");
    // In a real app, you would open a form and then add the new transaction to the state
  };

  const handleConnectBank = () => {
    // Create a connect bank modal - simulation
    const connectBankModal = document.createElement('div');
    connectBankModal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    connectBankModal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <h3 class="text-lg font-bold mb-4">Connect Bank Account</h3>
        <div class="space-y-4 mb-4">
          <p class="text-sm text-gray-600">Select your bank to securely connect your accounts. We use industry-standard encryption to protect your data.</p>
          
          <div class="border rounded-md p-4">
            <div class="space-y-3">
              <div class="flex items-center">
                <input type="radio" id="bank-1" name="bank" class="mr-2" checked>
                <label for="bank-1" class="flex-1">First National Bank</label>
                <img src="https://via.placeholder.com/32" alt="Bank logo" class="h-8 w-8">
              </div>
              <div class="flex items-center">
                <input type="radio" id="bank-2" name="bank" class="mr-2">
                <label for="bank-2" class="flex-1">Capital Financial</label>
                <img src="https://via.placeholder.com/32" alt="Bank logo" class="h-8 w-8">
              </div>
              <div class="flex items-center">
                <input type="radio" id="bank-3" name="bank" class="mr-2">
                <label for="bank-3" class="flex-1">Regional Credit Union</label>
                <img src="https://via.placeholder.com/32" alt="Bank logo" class="h-8 w-8">
              </div>
            </div>
          </div>
          
          <div>
            <input type="text" class="w-full p-2 border rounded-md" placeholder="Search for your bank..." />
          </div>
        </div>
        <div class="flex justify-end space-x-2">
          <button class="px-4 py-2 bg-gray-200 rounded-md" id="cancel-bank">Cancel</button>
          <button class="px-4 py-2 bg-primary text-white rounded-md" id="continue-bank">Continue</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(connectBankModal);
    
    document.getElementById('cancel-bank')?.addEventListener('click', () => {
      document.body.removeChild(connectBankModal);
    });
    
    document.getElementById('continue-bank')?.addEventListener('click', () => {
      document.body.removeChild(connectBankModal);
      
      // Show a credentials modal
      const credentialsModal = document.createElement('div');
      credentialsModal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
      credentialsModal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 class="text-lg font-bold mb-4">First National Bank Login</h3>
          <div class="space-y-4 mb-4">
            <div>
              <label class="block text-sm font-medium mb-1">Username</label>
              <input type="text" class="w-full p-2 border rounded-md" placeholder="Enter bank username" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Password</label>
              <input type="password" class="w-full p-2 border rounded-md" placeholder="Enter bank password" />
            </div>
            <p class="text-xs text-gray-500">Your credentials are securely encrypted and never stored. We use them only to establish a connection with your bank.</p>
          </div>
          <div class="flex justify-end space-x-2">
            <button class="px-4 py-2 bg-gray-200 rounded-md" id="back-cred">Back</button>
            <button class="px-4 py-2 bg-primary text-white rounded-md" id="connect-cred">Connect</button>
          </div>
        </div>
      `;
      
      document.body.appendChild(credentialsModal);
      
      document.getElementById('back-cred')?.addEventListener('click', () => {
        document.body.removeChild(credentialsModal);
        document.body.appendChild(connectBankModal);
      });
      
      document.getElementById('connect-cred')?.addEventListener('click', () => {
        document.body.removeChild(credentialsModal);
        toast.success('Bank connected successfully! New accounts added.');
        
        // Add a new account to simulate the connection
        const newAccount = {
          id: `acc-${accounts.length + 1}`,
          name: "Business Checking 2",
          institution: "First National Bank",
          balance: "$12,345.67",
          lastSync: "Just now"
        };
        
        setAccounts([...accounts, newAccount]);
      });
    });
  };
  
  const handleTransferOut = (accountId: string, name: string) => {
    // Create a transfer modal - simulation
    const transferModal = document.createElement('div');
    transferModal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    transferModal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-bold mb-4">Transfer Out from ${name}</h3>
        <div class="space-y-4 mb-4">
          <div>
            <label class="block text-sm font-medium mb-1">To Account</label>
            <select class="w-full p-2 border rounded-md">
              ${accounts.filter(a => a.id !== accountId).map(a => 
                `<option value="${a.id}">${a.name}</option>`
              ).join('')}
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Amount</label>
            <input type="number" class="w-full p-2 border rounded-md" placeholder="0.00" step="0.01" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Date</label>
            <input type="date" class="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Memo</label>
            <input type="text" class="w-full p-2 border rounded-md" placeholder="Add a note" />
          </div>
        </div>
        <div class="flex justify-end space-x-2">
          <button class="px-4 py-2 bg-gray-200 rounded-md" id="cancel-transfer">Cancel</button>
          <button class="px-4 py-2 bg-primary text-white rounded-md" id="complete-transfer">Transfer</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(transferModal);
    
    document.getElementById('cancel-transfer')?.addEventListener('click', () => {
      document.body.removeChild(transferModal);
    });
    
    document.getElementById('complete-transfer')?.addEventListener('click', () => {
      toast.success('Transfer completed successfully');
      document.body.removeChild(transferModal);
      
      // Add a new transaction to simulate the transfer
      const newTransaction = {
        id: `TRN-${transactions.length + 1}`,
        account: name,
        date: new Date().toISOString().split('T')[0],
        description: "Transfer to another account",
        amount: "-$500.00",
        category: "Transfer",
        reconciled: true
      };
      
      setTransactions([newTransaction, ...transactions]);
    });
  };
  
  const handleTransferIn = (accountId: string, name: string) => {
    // Similar to transfer out, but for receiving funds
    const transferModal = document.createElement('div');
    transferModal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    transferModal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-bold mb-4">Transfer Into ${name}</h3>
        <div class="space-y-4 mb-4">
          <div>
            <label class="block text-sm font-medium mb-1">From Account</label>
            <select class="w-full p-2 border rounded-md">
              ${accounts.filter(a => a.id !== accountId).map(a => 
                `<option value="${a.id}">${a.name}</option>`
              ).join('')}
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Amount</label>
            <input type="number" class="w-full p-2 border rounded-md" placeholder="0.00" step="0.01" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Date</label>
            <input type="date" class="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Memo</label>
            <input type="text" class="w-full p-2 border rounded-md" placeholder="Add a note" />
          </div>
        </div>
        <div class="flex justify-end space-x-2">
          <button class="px-4 py-2 bg-gray-200 rounded-md" id="cancel-transfer-in">Cancel</button>
          <button class="px-4 py-2 bg-primary text-white rounded-md" id="complete-transfer-in">Transfer</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(transferModal);
    
    document.getElementById('cancel-transfer-in')?.addEventListener('click', () => {
      document.body.removeChild(transferModal);
    });
    
    document.getElementById('complete-transfer-in')?.addEventListener('click', () => {
      toast.success('Transfer completed successfully');
      document.body.removeChild(transferModal);
      
      // Add a new transaction to simulate the transfer
      const newTransaction = {
        id: `TRN-${transactions.length + 1}`,
        account: name,
        date: new Date().toISOString().split('T')[0],
        description: "Transfer from another account",
        amount: "+$500.00",
        category: "Transfer",
        reconciled: true
      };
      
      setTransactions([newTransaction, ...transactions]);
    });
  };
  
  const handleViewReports = (accountId: string, name: string) => {
    // Create a reports modal - simulation
    const reportsModal = document.createElement('div');
    reportsModal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    reportsModal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-bold mb-4">Reports for ${name}</h3>
        <div class="space-y-2 mb-4">
          <button class="w-full text-left p-3 border rounded-md hover:bg-gray-50 flex items-center justify-between">
            <span>Transaction History</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
          <button class="w-full text-left p-3 border rounded-md hover:bg-gray-50 flex items-center justify-between">
            <span>Account Statement</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
          <button class="w-full text-left p-3 border rounded-md hover:bg-gray-50 flex items-center justify-between">
            <span>Income & Expenses</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
          <button class="w-full text-left p-3 border rounded-md hover:bg-gray-50 flex items-center justify-between">
            <span>Reconciliation Report</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>
        <div class="flex justify-end">
          <button class="px-4 py-2 bg-gray-200 rounded-md" id="close-reports">Close</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(reportsModal);
    
    document.getElementById('close-reports')?.addEventListener('click', () => {
      document.body.removeChild(reportsModal);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Banking</h1>
          <p className="text-muted-foreground">Manage your financial accounts and transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2" onClick={handleConnectBank}>
            <Building size={16} />
            <span>Connect Bank</span>
          </Button>
          <Button className="flex items-center gap-2" onClick={handleAddTransaction}>
            <PlusCircle size={16} />
            <span>Add Transaction</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <Card key={account.id}>
            <CardHeader className="pb-2">
              <CardDescription>{account.institution}</CardDescription>
              <CardTitle>{account.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{account.balance}</div>
              <p className="text-xs text-muted-foreground mt-1">Last synced: {account.lastSync}</p>
            </CardContent>
            <CardFooter className="pt-1 flex justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs"
                onClick={() => handleTransferOut(account.id, account.name)}
              >
                <ArrowUpRight size={14} className="mr-1" />
                Transfer Out
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs"
                onClick={() => handleTransferIn(account.id, account.name)}
              >
                <ArrowDownLeft size={14} className="mr-1" />
                Transfer In
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs"
                onClick={() => handleViewReports(account.id, account.name)}
              >
                <BarChart4 size={14} className="mr-1" />
                Reports
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search transactions..."
            className="w-full sm:w-[300px] pl-8"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <FilterButton type="Banking" />
          <ExportButton type="Banking" />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Showing the latest transactions across all accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id} id={`row-${transaction.id}`}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell className="font-medium">{transaction.description}</TableCell>
                  <TableCell>{transaction.account}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell className={transaction.amount.startsWith("+") ? "text-green-600" : "text-red-600"}>
                    {transaction.amount}
                  </TableCell>
                  <TableCell className="text-right">
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
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <ViewButton id={transaction.id} type="Transaction" />
                      <EditButton id={transaction.id} type="Transaction" />
                      <DeleteButton id={transaction.id} type="Transaction" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Banking;
