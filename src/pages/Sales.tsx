
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Filter, Download, Search, ShoppingCart, FileText, CalendarIcon, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Sales: React.FC = () => {
  // Sample sales data
  const sales = [
    { 
      id: "SALE-001", 
      date: "2025-04-11", 
      customer: "ABC Corporation", 
      items: 5,
      total: "$1,250.00",
      status: "Completed",
      paymentStatus: "Paid" 
    },
    { 
      id: "SALE-002", 
      date: "2025-04-10", 
      customer: "XYZ Limited", 
      items: 3,
      total: "$875.50",
      status: "Completed",
      paymentStatus: "Paid" 
    },
    { 
      id: "SALE-003", 
      date: "2025-04-09", 
      customer: "123 Industries", 
      items: 2,
      total: "$450.00",
      status: "Processing",
      paymentStatus: "Pending" 
    },
    { 
      id: "SALE-004", 
      date: "2025-04-08", 
      customer: "Global Tech", 
      items: 8,
      total: "$2,879.99",
      status: "Completed",
      paymentStatus: "Paid" 
    },
    { 
      id: "SALE-005", 
      date: "2025-04-08", 
      customer: "Acme Inc", 
      items: 1,
      total: "$399.99",
      status: "On Hold",
      paymentStatus: "Pending" 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sales</h1>
          <p className="text-muted-foreground">Manage your sales orders and transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Tag size={16} />
            <span>Create Estimate</span>
          </Button>
          <Button className="flex items-center gap-2">
            <PlusCircle size={16} />
            <span>New Sale</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-green-500">$5,855.48</CardTitle>
            <CardDescription>Sales This Week</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">19</CardTitle>
            <CardDescription>Total Orders</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-amber-500">3</CardTitle>
            <CardDescription>Pending Orders</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-primary">+12.5%</CardTitle>
            <CardDescription>vs. Last Week</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search sales..."
            className="w-full sm:w-[300px] pl-8"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <CalendarIcon size={16} />
            <span>Date Range</span>
          </Button>
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
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>View and manage your recent sales orders</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.id}</TableCell>
                  <TableCell>{sale.date}</TableCell>
                  <TableCell>{sale.customer}</TableCell>
                  <TableCell>{sale.items}</TableCell>
                  <TableCell>{sale.total}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      sale.status === "Completed" 
                        ? "bg-green-100 text-green-800" 
                        : sale.status === "Processing" 
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {sale.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      sale.paymentStatus === "Paid" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {sale.paymentStatus}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ShoppingCart size={16} />
                        <span className="sr-only">View Order</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <FileText size={16} />
                        <span className="sr-only">Invoice</span>
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

export default Sales;
