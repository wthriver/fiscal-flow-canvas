
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, FileEdit, Trash2, Download, Upload, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Account {
  id: string;
  code: string;
  name: string;
  type: string;
  subtype: string;
  balance: number;
}

export function ChartOfAccountsSettings() {
  const [accounts, setAccounts] = useState<Account[]>([
    { id: "1", code: "1000", name: "Cash", type: "Asset", subtype: "Current Asset", balance: 15000 },
    { id: "2", code: "1100", name: "Accounts Receivable", type: "Asset", subtype: "Current Asset", balance: 7500 },
    { id: "3", code: "1500", name: "Office Equipment", type: "Asset", subtype: "Fixed Asset", balance: 12000 },
    { id: "4", code: "2000", name: "Accounts Payable", type: "Liability", subtype: "Current Liability", balance: 6000 },
    { id: "5", code: "3000", name: "Common Stock", type: "Equity", subtype: "Equity", balance: 25000 },
    { id: "6", code: "4000", name: "Sales Revenue", type: "Revenue", subtype: "Income", balance: 50000 },
    { id: "7", code: "5000", name: "Cost of Goods Sold", type: "Expense", subtype: "Cost of Sales", balance: 20000 },
    { id: "8", code: "6000", name: "Rent Expense", type: "Expense", subtype: "Operating Expense", balance: 15000 },
  ]);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);

  const handleDeleteAccount = (account: Account) => {
    setAccountToDelete(account);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (accountToDelete) {
      setAccounts(accounts.filter(account => account.id !== accountToDelete.id));
      toast.success(`Account "${accountToDelete.name}" deleted successfully`);
      setDeleteDialogOpen(false);
      setAccountToDelete(null);
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'Asset':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Liability':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'Equity':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Revenue':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Expense':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const handleAddAccount = () => {
    toast.info("Opening account creation form...");
    // In a real app, this would open a form to create a new account
  };

  const handleImportAccounts = () => {
    toast.info("Opening account import dialog...");
    // In a real app, this would open a dialog to import accounts
  };

  const handleExportAccounts = () => {
    toast.success("Exporting chart of accounts...");
    // In a real app, this would trigger a download of the chart of accounts
  };

  const handleEditAccount = (account: Account) => {
    toast.info(`Opening edit form for ${account.name}...`);
    // In a real app, this would open a form to edit the account
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <CardTitle>Chart of Accounts</CardTitle>
        </div>
        <CardDescription>Manage your accounting structure and accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 justify-end mb-4">
          <Button variant="outline" onClick={handleImportAccounts}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" onClick={handleExportAccounts}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleAddAccount}>
            <Plus className="mr-2 h-4 w-4" />
            Add Account
          </Button>
        </div>
        
        <div className="rounded-md border">
          <div className="grid grid-cols-12 bg-muted py-3 px-4 text-sm font-medium">
            <div className="col-span-2">Code</div>
            <div className="col-span-4">Account Name</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-3">Balance</div>
            <div className="col-span-1"></div>
          </div>
          
          {accounts.map((account) => (
            <div key={account.id} className="grid grid-cols-12 items-center border-t py-3 px-4">
              <div className="col-span-2 font-mono text-sm">{account.code}</div>
              <div className="col-span-4">
                <div className="font-medium">{account.name}</div>
                <div className="text-xs text-muted-foreground">{account.subtype}</div>
              </div>
              <div className="col-span-2">
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getAccountTypeColor(account.type)}`}>
                  {account.type}
                </span>
              </div>
              <div className="col-span-3 font-mono">
                {account.balance.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}
              </div>
              <div className="col-span-1 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditAccount(account)}>
                      <FileEdit className="mr-2 h-4 w-4" />
                      Edit Account
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive" 
                      onClick={() => handleDeleteAccount(account)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
        
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Account</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the account "{accountToDelete?.name}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
