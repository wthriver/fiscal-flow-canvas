
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Mail, Calendar, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ReminderRule {
  id: string;
  name: string;
  daysBefore: number;
  daysAfter: number;
  isActive: boolean;
  frequency: string;
  message: string;
}

interface OverdueInvoice {
  id: string;
  customer: string;
  amount: number;
  dueDate: string;
  daysOverdue: number;
  lastReminder: string | null;
}

export const PaymentReminders = () => {
  const [reminderRules, setReminderRules] = useState<ReminderRule[]>([
    {
      id: "rule-1",
      name: "Pre-due Reminder",
      daysBefore: 7,
      daysAfter: 0,
      isActive: true,
      frequency: "once",
      message: "Your invoice is due in 7 days. Please ensure payment is processed on time."
    },
    {
      id: "rule-2",
      name: "Overdue Notice",
      daysBefore: 0,
      daysAfter: 7,
      isActive: true,
      frequency: "weekly",
      message: "Your payment is now overdue. Please process payment immediately to avoid late fees."
    }
  ]);

  const [overdueInvoices] = useState<OverdueInvoice[]>([
    {
      id: "INV-001",
      customer: "Acme Corp",
      amount: 1250.00,
      dueDate: "2025-05-15",
      daysOverdue: 9,
      lastReminder: "2025-05-20"
    },
    {
      id: "INV-003",
      customer: "Wayne Enterprises",
      amount: 750.00,
      dueDate: "2025-05-18",
      daysOverdue: 6,
      lastReminder: null
    }
  ]);

  const toggleRule = (ruleId: string) => {
    setReminderRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
    toast.success("Reminder rule updated");
  };

  const sendReminder = (invoiceId: string) => {
    toast.success(`Payment reminder sent for ${invoiceId}`);
  };

  const sendBulkReminders = () => {
    toast.success(`Reminders sent for ${overdueInvoices.length} overdue invoices`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Reminder Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reminderRules.map((rule) => (
              <div key={rule.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">{rule.name}</h3>
                    <Badge variant={rule.isActive ? "default" : "secondary"}>
                      {rule.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <Switch
                    checked={rule.isActive}
                    onCheckedChange={() => toggleRule(rule.id)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <Label className="text-xs">Timing</Label>
                    <p>
                      {rule.daysBefore > 0 && `${rule.daysBefore} days before due`}
                      {rule.daysAfter > 0 && `${rule.daysAfter} days after due`}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs">Frequency</Label>
                    <p className="capitalize">{rule.frequency}</p>
                  </div>
                  <div>
                    <Label className="text-xs">Message Preview</Label>
                    <p className="text-muted-foreground">{rule.message.substring(0, 50)}...</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Overdue Invoices
            </CardTitle>
            <Button onClick={sendBulkReminders}>
              <Mail className="h-4 w-4 mr-2" />
              Send All Reminders
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {overdueInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium">{invoice.id} - {invoice.customer}</p>
                    <p className="text-sm text-muted-foreground">
                      Due: {invoice.dueDate} • {invoice.daysOverdue} days overdue
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-medium">${invoice.amount.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">
                      {invoice.lastReminder ? `Last reminder: ${invoice.lastReminder}` : "No reminders sent"}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => sendReminder(invoice.id)}>
                    <Mail className="h-4 w-4 mr-1" />
                    Send Reminder
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
