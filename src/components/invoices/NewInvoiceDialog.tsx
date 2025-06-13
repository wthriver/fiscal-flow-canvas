import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "@/hooks/use-toast";
import { InvoiceItem } from "@/types/company";

interface NewInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewInvoiceDialog: React.FC<NewInvoiceDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { addInvoice, currentCompany } = useCompany();
  const [customer, setCustomer] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [items, setItems] = useState([
    { id: `item-${Date.now()}`, description: "", quantity: 1, price: 0 },
  ]);
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState("");

  const resetForm = () => {
    setCustomer("");
    setDueDate("");
    setItems([{ id: `item-${Date.now()}`, description: "", quantity: 1, price: 0 }]);
    setTaxRate(0);
    setNotes("");
  };

  const calculateSubtotal = () => {
    return items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * (taxRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: `item-${Date.now()}`, description: "", quantity: 1, price: 0 },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleItemChange = (
    id: string,
    field: string,
    value: string | number
  ) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customer || !dueDate || items.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and add at least one item",
        variant: "destructive",
      });
      return;
    }

    const invoiceItems: InvoiceItem[] = items.map(item => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      rate: item.price,
      amount: item.quantity * item.price
    }));

    const newInvoice = {
      id: `INV-${Math.floor(Math.random() * 9000) + 1000}`,
      customer,
      date: new Date().toISOString().split('T')[0],
      dueDate,
      items: invoiceItems,
      subtotal: calculateSubtotal(),
      tax: taxRate,
      taxAmount: calculateTax(),
      total: calculateTotal(),
      status: "Draft" as const,
      notes: notes || ""
    };

    addInvoice(newInvoice);
    
    toast({
      title: "Success",
      description: "Invoice created successfully",
    });
    
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>New Invoice</DialogTitle>
          <DialogDescription>Create a new invoice for a customer</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customer" className="text-right">
                Customer
              </Label>
              <Select value={customer} onValueChange={setCustomer}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {currentCompany?.customers?.map((customer) => (
                    <SelectItem key={customer.id} value={customer.name}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <Input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="w-[50px]">
                      <Button variant="ghost" size="sm" onClick={handleAddItem}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Input
                          type="text"
                          value={item.description}
                          onChange={(e) =>
                            handleItemChange(item.id, "description", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(
                              item.id,
                              "quantity",
                              parseInt(e.target.value)
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.price}
                          onChange={(e) =>
                            handleItemChange(
                              item.id,
                              "price",
                              parseFloat(e.target.value)
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>{item.quantity * item.price}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="taxRate" className="text-right">
                Tax Rate (%)
              </Label>
              <Input
                type="number"
                id="taxRate"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value))}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Subtotal</Label>
              <div className="col-span-3">${calculateSubtotal()}</div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Tax</Label>
              <div className="col-span-3">${calculateTax()}</div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Total</Label>
              <div className="col-span-3">${calculateTotal()}</div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Invoice</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
