
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCompany } from "@/contexts/CompanyContext";
import { Calendar, FileText, Mail, Phone } from "lucide-react";

export const AccountsReceivableAging = () => {
  const { currentCompany } = useCompany();
  const [filterBy, setFilterBy] = useState("all");

  const getAgingData = () => {
    const today = new Date();
    return currentCompany.invoices?.map(invoice => {
      const dueDate = new Date(invoice.dueDate);
      const daysPastDue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      
      let agingBucket = "Current";
      if (daysPastDue > 90) agingBucket = "90+ Days";
      else if (daysPastDue > 60) agingBucket = "61-90 Days";
      else if (daysPastDue > 30) agingBucket = "31-60 Days";
      else if (daysPastDue > 0) agingBucket = "1-30 Days";

      return {
        ...invoice,
        daysPastDue,
        agingBucket
      };
    }).filter(invoice => invoice.status !== "Paid") || [];
  };

  const agingData = getAgingData();
  const filteredData = filterBy === "all" ? agingData : agingData.filter(item => item.agingBucket === filterBy);

  const getTotalByBucket = (bucket: string) => {
    return agingData
      .filter(item => item.agingBucket === bucket)
      .reduce((sum, item) => sum + item.total, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Accounts Receivable Aging</h2>
          <p className="text-muted-foreground">Track overdue customer payments</p>
        </div>
        <Select value={filterBy} onValueChange={setFilterBy}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Outstanding</SelectItem>
            <SelectItem value="Current">Current</SelectItem>
            <SelectItem value="1-30 Days">1-30 Days</SelectItem>
            <SelectItem value="31-60 Days">31-60 Days</SelectItem>
            <SelectItem value="61-90 Days">61-90 Days</SelectItem>
            <SelectItem value="90+ Days">90+ Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Current</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${getTotalByBucket("Current").toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">1-30 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              ${getTotalByBucket("1-30 Days").toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">31-60 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              ${getTotalByBucket("31-60 Days").toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">61-90 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${getTotalByBucket("61-90 Days").toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">90+ Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">
              ${getTotalByBucket("90+ Days").toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Outstanding Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Invoice Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Days Past Due</TableHead>
                <TableHead>Aging Bucket</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.invoiceNumber || invoice.id}</TableCell>
                  <TableCell>{invoice.customer}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.dueDate}</TableCell>
                  <TableCell>${invoice.total.toLocaleString()}</TableCell>
                  <TableCell>
                    {invoice.daysPastDue > 0 ? invoice.daysPastDue : 0}
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      invoice.agingBucket === "Current" ? "default" :
                      invoice.agingBucket === "1-30 Days" ? "secondary" :
                      invoice.agingBucket === "31-60 Days" ? "destructive" :
                      "destructive"
                    }>
                      {invoice.agingBucket}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4" />
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
