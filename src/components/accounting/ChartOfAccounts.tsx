
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, FileText, Download } from "lucide-react";

// Sample account types and categories
const ACCOUNT_TYPES = [
  {
    name: "Assets",
    categories: ["Current Assets", "Fixed Assets", "Other Assets"]
  },
  {
    name: "Liabilities",
    categories: ["Current Liabilities", "Long Term Liabilities"]
  },
  {
    name: "Equity",
    categories: ["Owner's Equity", "Retained Earnings"]
  },
  {
    name: "Revenue",
    categories: ["Sales Revenue", "Service Revenue", "Other Revenue"]
  },
  {
    name: "Expenses",
    categories: ["Operating Expenses", "Payroll Expenses", "Administrative Expenses", "Other Expenses"]
  }
];

// Sample accounts
const SAMPLE_ACCOUNTS = [
  { id: "1000", name: "Cash", type: "Assets", category: "Current Assets", balance: "$24,500.00", description: "Main operating cash account" },
  { id: "1100", name: "Accounts Receivable", type: "Assets", category: "Current Assets", balance: "$12,250.00", description: "Money owed by customers" },
  { id: "1200", name: "Inventory", type: "Assets", category: "Current Assets", balance: "$34,750.00", description: "Goods for sale" },
  { id: "1500", name: "Office Equipment", type: "Assets", category: "Fixed Assets", balance: "$15,800.00", description: "Office computers and equipment" },
  { id: "2000", name: "Accounts Payable", type: "Liabilities", category: "Current Liabilities", balance: "$8,350.00", description: "Money owed to vendors" },
  { id: "2100", name: "Salaries Payable", type: "Liabilities", category: "Current Liabilities", balance: "$4,200.00", description: "Salaries owed to employees" },
  { id: "2500", name: "Long-term Loan", type: "Liabilities", category: "Long Term Liabilities", balance: "$75,000.00", description: "Bank loan" },
  { id: "3100", name: "Common Stock", type: "Equity", category: "Owner's Equity", balance: "$50,000.00", description: "Shareholder investment" },
  { id: "3200", name: "Retained Earnings", type: "Equity", category: "Retained Earnings", balance: "$23,750.00", description: "Cumulative earnings" },
  { id: "4100", name: "Product Sales", type: "Revenue", category: "Sales Revenue", balance: "$105,800.00", description: "Income from product sales" },
  { id: "4200", name: "Service Revenue", type: "Revenue", category: "Service Revenue", balance: "$48,200.00", description: "Income from services" },
  { id: "5100", name: "Cost of Goods Sold", type: "Expenses", category: "Operating Expenses", balance: "$62,300.00", description: "Direct costs of goods sold" },
  { id: "5200", name: "Salaries Expense", type: "Expenses", category: "Payroll Expenses", balance: "$35,450.00", description: "Employee salaries" },
  { id: "5300", name: "Rent Expense", type: "Expenses", category: "Administrative Expenses", balance: "$12,000.00", description: "Office rent" }
];

export const ChartOfAccounts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Filter accounts based on search term and active tab
  const filteredAccounts = SAMPLE_ACCOUNTS.filter(account => {
    const matchesSearch = 
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    return account.type.toLowerCase() === activeTab && matchesSearch;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">Chart of Accounts</h2>
        <div className="flex items-center gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Account
          </Button>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-[250px] shrink-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Account Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <Button 
                  variant={activeTab === "all" ? "default" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("all")}
                >
                  All Accounts
                </Button>
                
                {ACCOUNT_TYPES.map((type) => (
                  <Button
                    key={type.name}
                    variant={activeTab === type.name.toLowerCase() ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab(type.name.toLowerCase())}
                  >
                    {type.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex-1">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <CardTitle>Account List</CardTitle>
                  <CardDescription>{filteredAccounts.length} accounts</CardDescription>
                </div>
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search accounts..." 
                    className="w-full md:w-[250px] pl-8" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account #</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.length > 0 ? (
                    filteredAccounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="font-medium">{account.id}</TableCell>
                        <TableCell>{account.name}</TableCell>
                        <TableCell>{account.type}</TableCell>
                        <TableCell>{account.category}</TableCell>
                        <TableCell>{account.balance}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{account.description}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">Edit</Button>
                            <Button variant="ghost" size="sm" className="text-destructive">Delete</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No accounts found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Account Summary</CardTitle>
          <CardDescription>Overview of account balances by type</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="summary">
            <TabsList>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="assets">Assets</TabsTrigger>
              <TabsTrigger value="liabilities">Liabilities</TabsTrigger>
              <TabsTrigger value="equity">Equity</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {ACCOUNT_TYPES.map((type) => {
                  const accounts = SAMPLE_ACCOUNTS.filter(account => account.type === type.name);
                  const total = accounts.reduce((sum, account) => {
                    const value = parseFloat(account.balance.replace(/[^0-9.-]+/g, ""));
                    return sum + value;
                  }, 0);
                  
                  return (
                    <Card key={type.name}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{type.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <span className="text-2xl font-bold">${total.toLocaleString()}</span>
                        <p className="text-xs text-muted-foreground mt-1">{accounts.length} accounts</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
            
            {ACCOUNT_TYPES.map((type) => (
              <TabsContent key={type.name.toLowerCase()} value={type.name.toLowerCase()} className="pt-4">
                <div className="space-y-6">
                  {type.categories.map(category => {
                    const categoryAccounts = SAMPLE_ACCOUNTS.filter(
                      account => account.type === type.name && account.category === category
                    );
                    
                    if (categoryAccounts.length === 0) return null;
                    
                    const categoryTotal = categoryAccounts.reduce((sum, account) => {
                      const value = parseFloat(account.balance.replace(/[^0-9.-]+/g, ""));
                      return sum + value;
                    }, 0);
                    
                    return (
                      <div key={category} className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold text-lg">{category}</h3>
                          <span className="font-bold">${categoryTotal.toLocaleString()}</span>
                        </div>
                        
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Account #</TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead>Balance</TableHead>
                              <TableHead>Description</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {categoryAccounts.map((account) => (
                              <TableRow key={account.id}>
                                <TableCell className="font-medium">{account.id}</TableCell>
                                <TableCell>{account.name}</TableCell>
                                <TableCell>{account.balance}</TableCell>
                                <TableCell>{account.description}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
