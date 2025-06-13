
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Customer } from '@/types/company';
import { useCompany } from '@/contexts/CompanyContext';

interface CustomerViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer?: Customer | null;
}

export const CustomerViewDialog: React.FC<CustomerViewDialogProps> = ({
  open,
  onOpenChange,
  customer
}) => {
  const { getCustomerInvoices, getProjectsByCustomer } = useCompany();

  if (!customer) return null;

  const customerInvoices = getCustomerInvoices(customer.id);
  const customerProjects = getProjectsByCustomer(customer.id);
  const totalInvoiced = customerInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const paidInvoices = customerInvoices.filter(invoice => invoice.status === 'Paid');
  const totalPaid = paidInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const outstandingAmount = totalInvoiced - totalPaid;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {customer.name}
            <Badge variant={customer.status === 'Active' ? 'default' : 'secondary'}>
              {customer.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Customer details and business relationship overview
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{customer.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p>{customer.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Company</p>
                <p>{customer.company || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Customer Since</p>
                <p>{customer.customerSince}</p>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          {customer.address && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p>{customer.address}</p>
                  {(customer.city || customer.state || customer.postalCode) && (
                    <p>
                      {customer.city && `${customer.city}, `}
                      {customer.state && `${customer.state} `}
                      {customer.postalCode}
                    </p>
                  )}
                  {customer.country && <p>{customer.country}</p>}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Business Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Business Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Payment Terms</p>
                <p>{customer.paymentTerms}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                <p className="text-lg font-semibold">${(customer.totalSales || 0).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Financial Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Invoiced</p>
                  <p className="text-lg font-semibold">${totalInvoiced.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Paid</p>
                  <p className="text-lg font-semibold text-green-600">${totalPaid.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Outstanding</p>
                  <p className="text-lg font-semibold text-orange-600">${outstandingAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Invoices</p>
                  <p className="text-lg font-semibold">{customerInvoices.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                {customerInvoices.length === 0 ? (
                  <p className="text-muted-foreground">No invoices found</p>
                ) : (
                  <div className="space-y-2">
                    {customerInvoices.slice(0, 5).map(invoice => (
                      <div key={invoice.id} className="flex justify-between items-center py-2 border-b last:border-0">
                        <div>
                          <p className="font-medium">#{invoice.invoiceNumber}</p>
                          <p className="text-sm text-muted-foreground">{invoice.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${invoice.total.toLocaleString()}</p>
                          <Badge variant={invoice.status === 'Paid' ? 'default' : invoice.status === 'Overdue' ? 'destructive' : 'secondary'}>
                            {invoice.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Active Projects</CardTitle>
              </CardHeader>
              <CardContent>
                {customerProjects.length === 0 ? (
                  <p className="text-muted-foreground">No projects found</p>
                ) : (
                  <div className="space-y-2">
                    {customerProjects.slice(0, 5).map(project => (
                      <div key={project.id} className="flex justify-between items-center py-2 border-b last:border-0">
                        <div>
                          <p className="font-medium">{project.name}</p>
                          <p className="text-sm text-muted-foreground">{project.startDate}</p>
                        </div>
                        <Badge variant={project.status === 'Completed' ? 'default' : project.status === 'In Progress' ? 'secondary' : 'outline'}>
                          {project.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
