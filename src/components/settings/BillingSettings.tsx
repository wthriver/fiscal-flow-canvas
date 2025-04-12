
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Download, ExternalLink, Clock, ChevronRight, Mail, Check, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function BillingSettings() {
  const [plan, setPlan] = useState("Pro");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [autoRenew, setAutoRenew] = useState(true);
  const [emailReceipts, setEmailReceipts] = useState(true);
  const [additionalEmails, setAdditionalEmails] = useState("");
  const [changeCardDialogOpen, setChangeCardDialogOpen] = useState(false);
  const [emailReceiptsDialogOpen, setEmailReceiptsDialogOpen] = useState(false);
  
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: "1",
      type: "Visa",
      last4: "4242",
      expiry: "04/25",
      isDefault: true
    }
  ]);
  
  const [invoices, setInvoices] = useState([
    {
      id: "INV-001",
      date: "Apr 1, 2023",
      amount: "$49.00",
      status: "Paid"
    },
    {
      id: "INV-002",
      date: "Mar 1, 2023",
      amount: "$49.00",
      status: "Paid"
    },
    {
      id: "INV-003",
      date: "Feb 1, 2023",
      amount: "$49.00",
      status: "Paid"
    }
  ]);

  const handleChangePlan = () => {
    toast.info("Opening plan selection...");
    // In a real app, this would open a dialog to change the plan
  };

  const handleAddPaymentMethod = () => {
    setChangeCardDialogOpen(true);
  };
  
  const handleConfigureEmailReceipts = () => {
    setEmailReceiptsDialogOpen(true);
  };

  const saveEmailReceipts = () => {
    toast.success("Email receipt settings saved");
    setEmailReceiptsDialogOpen(false);
  };

  const downloadInvoice = (invoiceId: string) => {
    toast.success(`Downloading invoice ${invoiceId}...`);
    // In a real app, this would trigger a download of the invoice
  };

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <CardTitle>Subscription</CardTitle>
          </div>
          <CardDescription>Manage your subscription plan and billing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 border rounded-lg bg-primary/5">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold">{plan} Plan</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {billingCycle === "monthly" ? "Monthly billing" : "Annual billing"} • 
                  Renews on {billingCycle === "monthly" ? "May 1, 2023" : "Jan 1, 2024"}
                </p>
                <div className="mt-2">
                  <Button size="sm" variant="outline" onClick={handleChangePlan}>
                    Change Plan
                  </Button>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {billingCycle === "monthly" ? "$49" : "$490"}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{billingCycle === "monthly" ? "month" : "year"}
                  </span>
                </div>
                
                <div className="flex items-center justify-end gap-2 mt-2">
                  <span className="text-sm">Auto-renew</span>
                  <Switch 
                    checked={autoRenew} 
                    onCheckedChange={setAutoRenew} 
                    aria-label="Toggle auto-renew"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Payment Methods</h3>
              <Button variant="outline" size="sm" onClick={handleAddPaymentMethod}>
                <CreditCard className="mr-2 h-4 w-4" />
                Add Payment Method
              </Button>
            </div>
            
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-14 bg-muted rounded flex items-center justify-center">
                    <span className="font-medium">{method.type}</span>
                  </div>
                  <div>
                    <div className="font-medium">•••• {method.last4}</div>
                    <div className="text-sm text-muted-foreground">Expires {method.expiry}</div>
                  </div>
                  {method.isDefault && (
                    <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={handleAddPaymentMethod}>
                  Edit
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <CardTitle>Billing History</CardTitle>
          </div>
          <CardDescription>View your past invoices and payment history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-4 bg-muted py-3 px-4 text-sm font-medium">
              <div>Invoice</div>
              <div>Date</div>
              <div>Amount</div>
              <div className="text-right">Actions</div>
            </div>
            
            {invoices.map((invoice) => (
              <div key={invoice.id} className="grid grid-cols-4 items-center border-t py-3 px-4">
                <div className="font-medium">{invoice.id}</div>
                <div>{invoice.date}</div>
                <div>{invoice.amount}</div>
                <div className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => downloadInvoice(invoice.id)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Download</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => toast.info("Viewing all billing history...")}>
              View All History
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <CardTitle>Email Receipts</CardTitle>
          </div>
          <CardDescription>Configure where to send invoice receipts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Send email receipts</p>
              <p className="text-sm text-muted-foreground">
                Automatically email invoices to your account email
              </p>
            </div>
            <Switch 
              checked={emailReceipts} 
              onCheckedChange={setEmailReceipts} 
            />
          </div>
          
          <Button 
            onClick={handleConfigureEmailReceipts}
            variant="outline" 
            className="mt-4"
          >
            Configure Email Recipients
          </Button>
        </CardContent>
      </Card>
      
      {/* Change Payment Method Dialog */}
      <Dialog open={changeCardDialogOpen} onOpenChange={setChangeCardDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Add a new credit card or other payment method
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="cardName">Name on Card</Label>
              <Input id="cardName" placeholder="John Smith" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" placeholder="123" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="makeDefault" />
              <Label htmlFor="makeDefault">Make default payment method</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangeCardDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast.success("Payment method added successfully");
              setChangeCardDialogOpen(false);
            }}>
              <Check className="mr-2 h-4 w-4" />
              Save Payment Method
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Email Receipts Dialog */}
      <Dialog open={emailReceiptsDialogOpen} onOpenChange={setEmailReceiptsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email Receipt Settings</DialogTitle>
            <DialogDescription>
              Configure who receives invoice and payment receipts
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Send to account email</p>
                <p className="text-sm text-muted-foreground">john@example.com</p>
              </div>
              <Switch 
                checked={emailReceipts} 
                onCheckedChange={setEmailReceipts} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="additionalEmails">Additional Email Recipients</Label>
              <Input 
                id="additionalEmails" 
                placeholder="finance@company.com, accounting@company.com" 
                value={additionalEmails}
                onChange={(e) => setAdditionalEmails(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Separate multiple email addresses with commas
              </p>
            </div>
            
            <div className="p-3 border rounded bg-amber-50 dark:bg-amber-950 text-sm flex gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
              <p className="text-amber-700 dark:text-amber-400">
                Make sure to add finance@company.com to your email whitelist to prevent receipts from going to spam.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailReceiptsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEmailReceipts}>
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
