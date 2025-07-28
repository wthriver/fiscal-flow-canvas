import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Customer, Invoice, Project } from "@/types/company";
import { MapPin, Phone, Mail, Building, Calendar } from "lucide-react";

interface CustomerViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
  invoices: Invoice[];
  projects: Project[];
}

export const CustomerViewDialog: React.FC<CustomerViewDialogProps> = ({
  open,
  onOpenChange,
  customer,
  invoices,
  projects
}) => {
  if (!customer) return null;

  const customerInvoices = invoices.filter(inv => inv.customerId === customer.id);
  const customerProjects = projects.filter(proj => proj.clientId === customer.id);
  const totalRevenue = customerInvoices.reduce((sum, inv) => sum + inv.total, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{customer.name}</span>
            <Badge variant={customer.status === 'Active' ? 'default' : 'secondary'}>
              {customer.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{customer.email}</span>
              </div>
              {customer.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.phone}</span>
                </div>
              )}
              {customer.company && (
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.company}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Customer since: {new Date(customer.customerSince).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Financial Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ${totalRevenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{customerInvoices.length}</div>
                  <div className="text-sm text-muted-foreground">Total Invoices</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{customerProjects.length}</div>
                  <div className="text-sm text-muted-foreground">Active Projects</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};