
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Calendar, DollarSign, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface TaxForm {
  id: string;
  formType: 'W-2' | '1099-NEC' | '941' | '940' | 'W-3' | '1096';
  employee?: string;
  vendor?: string;
  year: number;
  quarter?: number;
  amount: number;
  status: 'draft' | 'filed' | 'pending';
  dueDate: string;
}

interface TaxLiability {
  id: string;
  taxType: 'Federal Income' | 'Social Security' | 'Medicare' | 'State Income' | 'FUTA' | 'SUTA';
  amount: number;
  dueDate: string;
  status: 'current' | 'overdue' | 'paid';
  quarter: number;
  year: number;
}

export const TaxComplianceManager: React.FC = () => {
  const [taxForms] = useState<TaxForm[]>([
    {
      id: '1',
      formType: 'W-2',
      employee: 'John Smith',
      year: 2024,
      amount: 65000,
      status: 'draft',
      dueDate: '2025-01-31'
    },
    {
      id: '2',
      formType: '941',
      year: 2024,
      quarter: 4,
      amount: 15750,
      status: 'pending',
      dueDate: '2025-01-31'
    }
  ]);

  const [taxLiabilities] = useState<TaxLiability[]>([
    {
      id: '1',
      taxType: 'Federal Income',
      amount: 8500,
      dueDate: '2025-01-15',
      status: 'current',
      quarter: 4,
      year: 2024
    },
    {
      id: '2',
      taxType: 'Social Security',
      amount: 4030,
      dueDate: '2025-01-15',
      status: 'current',
      quarter: 4,
      year: 2024
    }
  ]);

  const generateForm = (formId: string) => {
    toast.success("Tax form generated successfully");
  };

  const fileForm = (formId: string) => {
    toast.success("Tax form filed electronically");
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'draft': { variant: 'outline' as const, label: 'Draft' },
      'pending': { variant: 'secondary' as const, label: 'Pending' },
      'filed': { variant: 'default' as const, label: 'Filed' },
      'current': { variant: 'default' as const, label: 'Current' },
      'overdue': { variant: 'destructive' as const, label: 'Overdue' },
      'paid': { variant: 'secondary' as const, label: 'Paid' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTotalLiabilities = () => {
    return taxLiabilities.reduce((sum, liability) => sum + liability.amount, 0);
  };

  const getOverdueLiabilities = () => {
    return taxLiabilities.filter(liability => 
      liability.status === 'overdue' || 
      (liability.status === 'current' && new Date(liability.dueDate) < new Date())
    ).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Tax Compliance Manager</h2>
          <p className="text-muted-foreground">Manage tax forms, calculations, and compliance requirements</p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Generate Year-End Reports
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Tax Liability</p>
                <p className="text-2xl font-bold">${getTotalLiabilities().toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Forms to File</p>
                <p className="text-2xl font-bold">{taxForms.filter(f => f.status !== 'filed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Deadlines</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Overdue Items</p>
                <p className="text-2xl font-bold">{getOverdueLiabilities()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="forms" className="space-y-4">
        <TabsList>
          <TabsTrigger value="forms">Tax Forms</TabsTrigger>
          <TabsTrigger value="liabilities">Tax Liabilities</TabsTrigger>
          <TabsTrigger value="calendar">Tax Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="forms">
          <Card>
            <CardHeader>
              <CardTitle>Tax Forms Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Form Type</TableHead>
                    <TableHead>Employee/Vendor</TableHead>
                    <TableHead>Tax Year</TableHead>
                    <TableHead>Quarter</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taxForms.map((form) => (
                    <TableRow key={form.id}>
                      <TableCell className="font-medium">{form.formType}</TableCell>
                      <TableCell>{form.employee || form.vendor || 'N/A'}</TableCell>
                      <TableCell>{form.year}</TableCell>
                      <TableCell>{form.quarter || 'N/A'}</TableCell>
                      <TableCell>${form.amount.toLocaleString()}</TableCell>
                      <TableCell>{new Date(form.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(form.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => generateForm(form.id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          {form.status !== 'filed' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => fileForm(form.id)}
                            >
                              File
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="liabilities">
          <Card>
            <CardHeader>
              <CardTitle>Tax Liabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tax Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Quarter</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taxLiabilities.map((liability) => (
                    <TableRow key={liability.id}>
                      <TableCell className="font-medium">{liability.taxType}</TableCell>
                      <TableCell>${liability.amount.toLocaleString()}</TableCell>
                      <TableCell>{new Date(liability.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>Q{liability.quarter}</TableCell>
                      <TableCell>{liability.year}</TableCell>
                      <TableCell>{getStatusBadge(liability.status)}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Pay Now
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Tax Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="font-medium">January 15, 2025</div>
                    <div className="text-sm text-muted-foreground">Q4 2024 Payroll Tax Deposit</div>
                    <Badge variant="secondary" className="mt-2">Upcoming</Badge>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="font-medium">January 31, 2025</div>
                    <div className="text-sm text-muted-foreground">Form 941 - Q4 2024</div>
                    <Badge variant="secondary" className="mt-2">Upcoming</Badge>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="font-medium">January 31, 2025</div>
                    <div className="text-sm text-muted-foreground">W-2 Forms Distribution</div>
                    <Badge variant="secondary" className="mt-2">Upcoming</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
