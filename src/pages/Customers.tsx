
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Filter, Download, Search, User, Mail, Phone, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Customers: React.FC = () => {
  // Sample customer data
  const customers = [
    { 
      id: "CUST-001", 
      name: "ABC Corporation", 
      contactName: "John Smith",
      email: "john@abccorp.com", 
      phone: "(555) 123-4567", 
      openInvoices: 2,
      balance: "$3,450.00",
      status: "Active" 
    },
    { 
      id: "CUST-002", 
      name: "XYZ Limited", 
      contactName: "Jane Doe",
      email: "jane@xyzlimited.com", 
      phone: "(555) 987-6543", 
      openInvoices: 1,
      balance: "$1,200.00",
      status: "Active" 
    },
    { 
      id: "CUST-003", 
      name: "123 Industries", 
      contactName: "Robert Johnson",
      email: "robert@123industries.com", 
      phone: "(555) 456-7890", 
      openInvoices: 0,
      balance: "$0.00",
      status: "Active" 
    },
    { 
      id: "CUST-004", 
      name: "Global Tech", 
      contactName: "Sarah Williams",
      email: "sarah@globaltech.com", 
      phone: "(555) 789-0123", 
      openInvoices: 3,
      balance: "$5,875.25",
      status: "Active" 
    },
    { 
      id: "CUST-005", 
      name: "Acme Inc", 
      contactName: "Michael Brown",
      email: "michael@acmeinc.com", 
      phone: "(555) 234-5678", 
      openInvoices: 0,
      balance: "$0.00",
      status: "Inactive" 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage your customer relationships</p>
        </div>
        <Button className="flex items-center gap-2">
          <PlusCircle size={16} />
          <span>Add Customer</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">42</CardTitle>
            <CardDescription>Total Customers</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-primary">28</CardTitle>
            <CardDescription>Active Customers</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-amber-500">12</CardTitle>
            <CardDescription>With Open Invoices</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-green-500">$42,890</CardTitle>
            <CardDescription>Total Receivables</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers..."
            className="w-full sm:w-[300px] pl-8"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter size={16} />
            <span>Filter</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download size={16} />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Customer List</CardTitle>
          <CardDescription>Manage your customers and their information</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Open Invoices</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.contactName}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.openInvoices}</TableCell>
                  <TableCell>{customer.balance}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      customer.status === "Active" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {customer.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <User size={16} />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Mail size={16} />
                        <span className="sr-only">Email</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <FileText size={16} />
                        <span className="sr-only">Statement</span>
                      </Button>
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

export default Customers;
