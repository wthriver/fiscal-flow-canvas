
import React, { useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Customer } from "@/types/company";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCompany } from "@/contexts/CompanyContext";
import { Invoice, InvoiceItem } from "@/types/company";

interface NewInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Invoice) => void;
  customers: Customer[];
}

// Create a schema for form validation
const invoiceSchema = z.object({
  id: z.string().min(3, "Invoice ID must be at least 3 characters"),
  customer: z.string().min(1, "Customer is required"),
  date: z.string().min(1, "Date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  amount: z.string().min(1, "Amount is required"),
  status: z.string().min(1, "Status is required"),
  description: z.string().min(1, "Description is required"),
});

export const NewInvoiceDialog: React.FC<NewInvoiceDialogProps> = ({ 
  open, 
  onOpenChange, 
  onSubmit,
  customers
}) => {
  const { currentCompany } = useCompany();
  
  // Current date for default values
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  
  // Due date 30 days from today
  const dueDate = new Date();
  dueDate.setDate(today.getDate() + 30);
  const dueDateStr = dueDate.toISOString().split("T")[0];
  
  // Generate a new invoice ID
  const generateInvoiceId = () => {
    const prefix = "INV";
    const existingInvoices = currentCompany.invoices || [];
    const nextNumber = existingInvoices.length + 1;
    return `${prefix}-${nextNumber.toString().padStart(3, '0')}`;
  };
  
  // Set up form with validation
  const form = useForm<z.infer<typeof invoiceSchema>>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      id: generateInvoiceId(),
      customer: "",
      date: todayStr,
      dueDate: dueDateStr,
      amount: "",
      status: "Pending",
      description: "",
    },
  });
  
  // Get customer data for the selected customer
  const selectedCustomer = useMemo(() => {
    const customerName = form.watch('customer');
    return customers.find(c => c.name === customerName);
  }, [form.watch('customer'), customers]);
  
  // Handle form submission
  const handleSubmit = (data: z.infer<typeof invoiceSchema>) => {
    const amount = parseFloat(data.amount.replace(/[^0-9.]/g, ''));
    
    // Create invoice item
    const invoiceItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: data.description,
      quantity: 1,
      price: amount,
      total: amount
    };
    
    // Format invoice data
    const invoiceData: Invoice = {
      id: data.id,
      invoiceNumber: data.id,
      customer: data.customer,
      customerId: selectedCustomer?.id,
      date: data.date,
      dueDate: data.dueDate,
      items: [invoiceItem],
      status: data.status,
      total: amount,
      amount: `$${amount.toFixed(2)}`
    };
    
    onSubmit(invoiceData);
    form.reset({
      id: generateInvoiceId(),
      customer: "",
      date: todayStr,
      dueDate: dueDateStr,
      amount: "",
      status: "Pending",
      description: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
          <DialogDescription>
            Enter the details for the new invoice. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice ID</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly className="bg-muted" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="customer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.name}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {selectedCustomer && (
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">Customer Details:</p>
                <p className="text-sm text-muted-foreground">{selectedCustomer.email}</p>
                {selectedCustomer.phone && <p className="text-sm text-muted-foreground">{selectedCustomer.phone}</p>}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      placeholder="What is this invoice for?"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        onChange={(e) => {
                          // Remove non-numeric characters for input
                          const value = e.target.value.replace(/[^0-9.]/g, '');
                          field.onChange(value);
                        }}
                        placeholder="0.00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Overdue">Overdue</SelectItem>
                        <SelectItem value="Outstanding">Outstanding</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Invoice</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
