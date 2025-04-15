
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Download, Search, Building, ArrowUpRight, ArrowDownLeft, BarChart4 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FilterButton, ExportButton, ViewButton, EditButton, DeleteButton } from "@/components/common/ActionButtons";
import { handleCreateItem, handleViewItem } from "@/utils/navigationUtils";
import { toast } from "sonner";
import { useCompany } from "@/contexts/CompanyContext";
import { AddTransactionDialog } from "@/components/banking/AddTransactionDialog";
import { ReportsDialog } from "@/components/banking/ReportsDialog";

const Banking: React.FC = () => {
  const { currentCompany } = useCompany();
  const [searchText, setSearchText] = useState("");
  const [addTransactionOpen, setAddTransactionOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState({ id: "", name: "" });
  
  // Filter transactions based on search text
  const filteredTransactions = currentCompany.transactions.filter(transaction => 
    transaction.id.toLowerCase().includes(searchText.toLowerCase()) ||
    transaction.account.toLowerCase().includes(searchText.toLowerCase()) ||
    transaction.description.toLowerCase().includes(searchText.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAddTransaction = () => {
    setAddTransactionOpen(true);
  };

  const handleConnectBank = () => {
    // Create a connect bank modal - simulation
    const connectBankModal = document.createElement('div');
    connectBankModal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    connectBankModal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <h3 class="text-lg font-bold mb-4">Connect Bank Account for ${currentCompany.name}</h3>
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
        toast.success(`Bank connected successfully for ${currentCompany.name}! New accounts added.`);
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
              ${currentCompany.accounts.filter(a => a.id !== accountId).map(a => 
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
      toast.success(`Transfer completed successfully for ${currentCompany.name}`);
      document.body.removeChild(transferModal);
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
              ${currentCompany.accounts.filter(a => a.id !== accountId).map(a => 
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
      toast.success(`Transfer completed successfully for ${currentCompany.name}`);
      document.body.removeChild(transferModal);
    });
  };
  
  const handleViewReports = (accountId: string, name: string) => {
    setSelectedAccount({ id: accountId, name });
    setReportsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Banking</h1>
          <p className="text-muted-foreground">Manage {currentCompany.name}'s financial accounts and transactions</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex items-center gap-2" onClick={handleConnectBank}>
            <Building size={16} />
            <span className="hidden sm:inline">Connect Bank</span>
            <span className="sm:hidden">Connect</span>
          </Button>
          <Button className="flex items-center gap-2" onClick={handleAddTransaction}>
            <PlusCircle size={16} />
            <span className="hidden sm:inline">Add Transaction</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentCompany.accounts.map((account) => (
          <Card key={account.id} className="h-full">
            <CardHeader className="pb-2">
              <CardDescription>{account.institution}</CardDescription>
              <CardTitle>{account.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{account.balance}</div>
              <p className="text-xs text-muted-foreground mt-1">Last synced: {account.lastSync}</p>
            </CardContent>
            <CardFooter className="pt-1 flex flex-wrap justify-between gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs"
                onClick={() => handleTransferOut(account.id, account.name)}
              >
                <ArrowUpRight size={14} className="mr-1" />
                <span className="hidden sm:inline">Transfer Out</span>
                <span className="sm:hidden">Out</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs"
                onClick={() => handleTransferIn(account.id, account.name)}
              >
                <ArrowDownLeft size={14} className="mr-1" />
                <span className="hidden sm:inline">Transfer In</span>
                <span className="sm:hidden">In</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs"
                onClick={() => handleViewReports(account.id, account.name)}
              >
                <BarChart4 size={14} className="mr-1" />
                <span>Reports</span>
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
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
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
          <CardDescription>Showing {currentCompany.name}'s latest transactions across all accounts</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
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
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    {searchText ? "No transactions found matching your search" : "No transactions found for this company."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddTransactionDialog
        open={addTransactionOpen}
        onOpenChange={setAddTransactionOpen}
      />

      <ReportsDialog
        open={reportsOpen}
        onOpenChange={setReportsOpen}
        accountId={selectedAccount.id}
        accountName={selectedAccount.name}
      />
    </div>
  );
};

export default Banking;
