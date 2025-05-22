
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface RecurringInvoice {
  id: string;
  client: string;
  amount: string;
  frequency: string;
  nextDate: string;
  status: string;
}

export const RecurringInvoices = () => {
  const [recurringInvoices, setRecurringInvoices] = useState<RecurringInvoice[]>([
    { id: "1", client: "Acme Corp", amount: "$1,200.00", frequency: "Monthly", nextDate: "2025-06-15", status: "Active" },
    { id: "2", client: "Globex Industries", amount: "$2,500.00", frequency: "Quarterly", nextDate: "2025-08-01", status: "Active" },
    { id: "3", client: "Wayne Enterprises", amount: "$5,000.00", frequency: "Monthly", nextDate: "2025-06-10", status: "Active" },
    { id: "4", client: "Stark Industries", amount: "$1,800.00", frequency: "Biweekly", nextDate: "2025-05-28", status: "Paused" },
    { id: "5", client: "Oscorp", amount: "$3,200.00", frequency: "Monthly", nextDate: "2025-06-05", status: "Active" },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<RecurringInvoice | null>(null);
  const [nextDate, setNextDate] = useState<Date | undefined>(undefined);

  const [formData, setFormData] = useState({
    client: "",
    amount: "",
    frequency: "Monthly",
    nextDate: "",
    status: "Active"
  });

  const handleOpenDialog = (invoice?: RecurringInvoice) => {
    if (invoice) {
      setCurrentInvoice(invoice);
      setFormData({
        client: invoice.client,
        amount: invoice.amount.replace("$", ""),
        frequency: invoice.frequency,
        nextDate: invoice.nextDate,
        status: invoice.status
      });
      setNextDate(new Date(invoice.nextDate));
    } else {
      setCurrentInvoice(null);
      setFormData({
        client: "",
        amount: "",
        frequency: "Monthly",
        nextDate: "",
        status: "Active"
      });
      setNextDate(undefined);
    }
    setIsDialogOpen(true);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setNextDate(date);
    if (date) {
      setFormData(prev => ({
        ...prev,
        nextDate: format(date, "yyyy-MM-dd")
      }));
    }
  };

  const handleSubmit = () => {
    if (!formData.client || !formData.amount || !formData.nextDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const formattedAmount = !formData.amount.includes("$") 
      ? `$${parseFloat(formData.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : formData.amount;

    if (currentInvoice) {
      // Update existing invoice
      const updatedInvoice = {
        ...currentInvoice,
        client: formData.client,
        amount: formattedAmount,
        frequency: formData.frequency,
        nextDate: formData.nextDate,
        status: formData.status
      };
      
      setRecurringInvoices(prevInvoices => 
        prevInvoices.map(inv => inv.id === currentInvoice.id ? updatedInvoice : inv)
      );
      
      toast.success("Recurring invoice updated");
    } else {
      // Create new invoice
      const newInvoice = {
        id: `rec-${Date.now()}`,
        client: formData.client,
        amount: formattedAmount,
        frequency: formData.frequency,
        nextDate: formData.nextDate,
        status: formData.status
      };
      
      setRecurringInvoices(prev => [...prev, newInvoice]);
      toast.success("Recurring invoice created");
    }
    
    setIsDialogOpen(false);
  };

  const handleToggleStatus = (invoice: RecurringInvoice) => {
    const newStatus = invoice.status === "Active" ? "Paused" : "Active";
    const updatedInvoices = recurringInvoices.map(inv => 
      inv.id === invoice.id ? { ...inv, status: newStatus } : inv
    );
    setRecurringInvoices(updatedInvoices);
    
    toast.success(`Invoice ${newStatus === "Active" ? "activated" : "paused"}`);
  };

  const handleDelete = (id: string) => {
    setRecurringInvoices(prev => prev.filter(invoice => invoice.id !== id));
    toast.success("Recurring invoice deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Recurring Invoices</h2>
        <Button onClick={() => handleOpenDialog()}>New Recurring Invoice</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Active Recurring Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Next Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recurringInvoices.length > 0 ? (
                recurringInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.client}</TableCell>
                    <TableCell>{invoice.amount}</TableCell>
                    <TableCell>{invoice.frequency}</TableCell>
                    <TableCell>{invoice.nextDate}</TableCell>
                    <TableCell>
                      <Badge variant={invoice.status === "Active" ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => handleToggleStatus(invoice)}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleOpenDialog(invoice)}>
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(invoice.id)}>
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No recurring invoices found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentInvoice ? "Edit Recurring Invoice" : "Create Recurring Invoice"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Input
                id="client"
                value={formData.client}
                onChange={(e) => handleChange("client", e.target.value)}
                placeholder="Client name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                placeholder="0.00"
                type="text"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select 
                  value={formData.frequency} 
                  onValueChange={(value) => handleChange("frequency", value)}
                >
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Biweekly">Biweekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleChange("status", value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nextDate">Next Invoice Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="nextDate"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !nextDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {nextDate ? format(nextDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={nextDate}
                    onSelect={handleDateSelect}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {currentInvoice ? "Update Invoice" : "Create Invoice"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
