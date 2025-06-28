
import React, { useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Customer, Sale, SaleItem } from "@/types/company";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCompany } from "@/contexts/CompanyContext";
import { safeStringReplace } from "@/utils/typeHelpers";

interface SaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Sale) => void;
  customers: Customer[];
  sale?: Sale | null;
}

const saleSchema = z.object({
  id: z.string().min(3, "Sale ID must be at least 3 characters"),
  customer: z.string().min(1, "Customer is required"),
  date: z.string().min(1, "Date is required"),
  amount: z.string().min(1, "Amount is required"),
  status: z.string().min(1, "Status is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  notes: z.string().optional(),
});

export const SaleDialog: React.FC<SaleDialogProps> = ({ 
  open, 
  onOpenChange, 
  onSubmit,
  customers,
  sale = null
}) => {
  const { currentCompany } = useCompany();
  
  const today = new Date().toISOString().split("T")[0];
  
  const generateSaleId = () => {
    const prefix = "SALE";
    const existingSales = currentCompany?.sales || [];
    const nextNumber = existingSales.length + 1;
    return `${prefix}-${nextNumber.toString().padStart(3, '0')}`;
  };
  
  const form = useForm<z.infer<typeof saleSchema>>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      id: sale?.id || generateSaleId(),
      customer: sale?.customer || "",
      date: sale?.date || today,
      amount: typeof sale?.amount === 'number' ? sale.amount.toString() : safeStringReplace(sale?.amount || "0", /[^0-9.]/g, ""),
      status: sale?.status || "Completed",
      paymentMethod: sale?.paymentMethod || "Cash",
      notes: sale?.notes || "",
    },
  });
  
  const selectedCustomer = useMemo(() => {
    const customerName = form.watch('customer');
    return customers.find(c => c.name === customerName);
  }, [form.watch('customer'), customers]);
  
  const handleSubmit = (data: z.infer<typeof saleSchema>) => {
    const amount = parseFloat(data.amount.replace(/[^0-9.]/g, ''));
    
    const saleData: Sale = {
      id: data.id,
      customer: data.customer,
      date: data.date,
      amount: amount,
      status: data.status as "Completed" | "Pending",
      paymentMethod: data.paymentMethod,
      notes: data.notes
    };
    
    onSubmit(saleData);
    if (!sale) {
      form.reset({
        id: generateSaleId(),
        customer: "",
        date: today,
        amount: "",
        status: "Completed",
        paymentMethod: "Cash",
        notes: "",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{sale ? 'Edit Sale' : 'Create New Sale'}</DialogTitle>
          <DialogDescription>
            {sale ? 'Update the sale details.' : 'Enter the details for the new sale. Click save when you\'re done.'}
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
                    <FormLabel>Sale ID</FormLabel>
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
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        onChange={(e) => {
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
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                        <SelectItem value="Debit Card">Debit Card</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        <SelectItem value="Check">Check</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      placeholder="Additional notes about this sale..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{sale ? 'Update Sale' : 'Save Sale'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
