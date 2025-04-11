
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ViewButton, 
  FilterButton, 
  ExportButton, 
  DateRangeButton, 
  ActionDropdown 
} from "@/components/common/ActionButtons";
import { handleCreateItem } from "@/utils/navigationUtils";

const Invoices: React.FC = () => {
  // Sample invoice data
  const invoices = [
    { id: "INV-001", customer: "ABC Corporation", date: "2025-04-10", amount: "$1,250.00", status: "Paid" },
    { id: "INV-002", customer: "XYZ Limited", date: "2025-04-08", amount: "$3,450.00", status: "Pending" },
    { id: "INV-003", customer: "123 Industries", date: "2025-04-05", amount: "$780.00", status: "Overdue" },
    { id: "INV-004", customer: "Global Tech", date: "2025-04-01", amount: "$2,100.00", status: "Paid" },
    { id: "INV-005", customer: "Acme Inc", date: "2025-03-28", amount: "$1,870.00", status: "Pending" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">Manage your customer invoices and payments</p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => handleCreateItem("Invoice")}
        >
          <PlusCircle size={16} />
          <span>New Invoice</span>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search invoices..."
            className="w-full sm:w-[300px] pl-8"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <DateRangeButton type="Invoices" />
          <FilterButton type="Invoices" />
          <ExportButton type="Invoices" />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>You have {invoices.length} total invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.customer}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      invoice.status === "Paid" 
                        ? "bg-green-100 text-green-800" 
                        : invoice.status === "Pending" 
                          ? "bg-yellow-100 text-yellow-800" 
                          : "bg-red-100 text-red-800"
                    }`}>
                      {invoice.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-1">
                      <ViewButton id={invoice.id} type="Invoice" />
                      <ActionDropdown id={invoice.id} type="Invoice" />
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

export default Invoices;
