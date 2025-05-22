import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { Account } from "@/types/company";

export const ChartOfAccountsComponent = () => {
  const { currentCompany, addAccount, updateAccount, deleteAccount } = useCompany();
  const [accounts, setAccounts] = useState<Account[]>(currentCompany.accounts || []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "Asset",
    number: "",
    balance: 0,
    description: "",
  });

  const accountTypes = [
    "Asset",
    "Liability",
    "Equity",
    "Revenue",
    "Expense",
  ];

  const handleOpenDialog = (account?: Account) => {
    if (account) {
      setCurrentAccount(account);
      setFormData({
        name: account.name,
        type: account.type,
        number: account.number,
        balance: account.balance,
        description: account.description || "",
      });
    } else {
      setCurrentAccount(null);
      setFormData({
        name: "",
        type: "Asset",
        number: "",
        balance: 0,
        description: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (currentAccount) {
      // Update existing account
      const updatedAccount = {
        ...currentAccount,
        ...formData
      };
      updateAccount(updatedAccount);
      setAccounts(accounts.map(a => a.id === currentAccount.id ? updatedAccount : a));
    } else {
      // Add new account
      const newAccount = {
        id: `acc${Date.now()}`,
        ...formData
      };
      addAccount(newAccount);
      setAccounts([...accounts, newAccount]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteAccount(id);
    setAccounts(accounts.filter(a => a.id !== id));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Chart of Accounts</CardTitle>
        <Button size="sm" onClick={() => handleOpenDialog()}>
          <Plus className="mr-1 h-4 w-4" /> Add Account
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account Number</TableHead>
              <TableHead>Account Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.length > 0 ? (
              accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>{account.number}</TableCell>
                  <TableCell>{account.name}</TableCell>
                  <TableCell>{account.type}</TableCell>
                  <TableCell>${account.balance.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(account)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(account.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No accounts found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentAccount ? "Edit Account" : "Add New Account"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="number">Account Number</Label>
                <Input
                  id="number"
                  value={formData.number}
                  onChange={(e) => handleChange("number", e.target.value)}
                  placeholder="e.g., 1000"
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleChange("type", value)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="name">Account Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., Cash on Hand"
              />
            </div>
            <div>
              <Label htmlFor="balance">Initial Balance</Label>
              <Input
                id="balance"
                type="number"
                value={formData.balance}
                onChange={(e) => handleChange("balance", parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Optional description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>{currentAccount ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
