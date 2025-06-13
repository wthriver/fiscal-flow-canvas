
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Eye, Edit, Trash2 } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { Customer } from "@/types/company";
import { toast } from "sonner";
import { DataTable, Column } from "@/components/common/DataTable";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { CustomerDialog } from "./CustomerDialog";
import { CustomerViewDialog } from "./CustomerViewDialog";

export const CustomerManagement: React.FC = () => {
  const { currentCompany, addCustomer, updateCustomer, deleteCustomer, getCustomerInvoices, getProjectsByCustomer } = useCompany();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);

  const customers = currentCompany?.customers || [];

  const columns: Column<Customer>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (value, customer) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">{customer.company}</div>
        </div>
      )
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (value) => value || '-'
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (value) => (
        <Badge variant={value === 'Active' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      )
    },
    {
      key: 'totalSales',
      header: 'Total Sales',
      sortable: true,
      render: (value) => `$${(value || 0).toLocaleString()}`
    },
    {
      key: 'customerSince',
      header: 'Customer Since',
      sortable: true
    }
  ];

  const handleAdd = () => {
    setEditingCustomer(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsDialogOpen(true);
  };

  const handleView = (customer: Customer) => {
    setViewingCustomer(customer);
    setIsViewDialogOpen(true);
  };

  const handleDeleteClick = (customer: Customer) => {
    setDeletingCustomer(customer);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingCustomer) {
      // Check for related records
      const relatedInvoices = getCustomerInvoices(deletingCustomer.id);
      const relatedProjects = getProjectsByCustomer(deletingCustomer.id);
      
      if (relatedInvoices.length > 0 || relatedProjects.length > 0) {
        toast.error(`Cannot delete customer. Found ${relatedInvoices.length} invoices and ${relatedProjects.length} projects.`);
        return;
      }

      deleteCustomer(deletingCustomer.id);
      toast.success("Customer deleted successfully");
      setDeletingCustomer(null);
    }
  };

  const handleSave = (customerData: Partial<Customer>) => {
    if (editingCustomer) {
      updateCustomer({ ...editingCustomer, ...customerData } as Customer);
      toast.success("Customer updated successfully");
    } else {
      const newCustomer: Customer = {
        id: `customer-${Date.now()}`,
        name: customerData.name!,
        email: customerData.email!,
        phone: customerData.phone,
        company: customerData.company,
        address: customerData.address,
        city: customerData.city,
        state: customerData.state,
        postalCode: customerData.postalCode,
        country: customerData.country,
        paymentTerms: customerData.paymentTerms || 'Net 30',
        status: customerData.status || 'Active',
        customerSince: new Date().toISOString().split('T')[0],
        totalSales: 0
      };
      addCustomer(newCustomer);
      toast.success("Customer added successfully");
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Customer Management</h2>
          <p className="text-muted-foreground">Manage your customers and their information</p>
        </div>
        <Button onClick={handleAdd}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customers ({customers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={customers}
            columns={columns}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            searchPlaceholder="Search customers..."
            emptyMessage="No customers found. Add your first customer to get started."
          />
        </CardContent>
      </Card>

      <CustomerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        customer={editingCustomer}
        onSave={handleSave}
      />

      <CustomerViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        customer={viewingCustomer}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Customer"
        description={`Are you sure you want to delete ${deletingCustomer?.name}? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
};
