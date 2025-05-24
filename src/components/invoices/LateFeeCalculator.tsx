
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Calculator, DollarSign, Percent } from "lucide-react";
import { toast } from "sonner";

interface LateFeeSettings {
  isEnabled: boolean;
  feeType: "percentage" | "fixed";
  feeAmount: number;
  gracePeriod: number;
  maxFee: number;
  compoundDaily: boolean;
}

interface InvoiceWithFees {
  id: string;
  customer: string;
  originalAmount: number;
  dueDate: string;
  daysOverdue: number;
  lateFee: number;
  totalAmount: number;
}

export const LateFeeCalculator = () => {
  const [settings, setSettings] = useState<LateFeeSettings>({
    isEnabled: true,
    feeType: "percentage",
    feeAmount: 1.5,
    gracePeriod: 5,
    maxFee: 100,
    compoundDaily: false
  });

  const [invoicesWithFees] = useState<InvoiceWithFees[]>([
    {
      id: "INV-001",
      customer: "Acme Corp",
      originalAmount: 1000.00,
      dueDate: "2025-05-10",
      daysOverdue: 14,
      lateFee: 15.00,
      totalAmount: 1015.00
    },
    {
      id: "INV-002",
      customer: "Global Tech",
      originalAmount: 2500.00,
      dueDate: "2025-05-12",
      daysOverdue: 12,
      lateFee: 37.50,
      totalAmount: 2537.50
    }
  ]);

  const calculateLateFee = (amount: number, daysOverdue: number): number => {
    if (!settings.isEnabled || daysOverdue <= settings.gracePeriod) {
      return 0;
    }

    const effectiveDays = daysOverdue - settings.gracePeriod;
    let fee = 0;

    if (settings.feeType === "percentage") {
      fee = (amount * settings.feeAmount) / 100;
      if (settings.compoundDaily) {
        fee = fee * effectiveDays;
      }
    } else {
      fee = settings.feeAmount;
      if (settings.compoundDaily) {
        fee = fee * effectiveDays;
      }
    }

    return Math.min(fee, settings.maxFee);
  };

  const updateSettings = (key: keyof LateFeeSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const applyLateFees = () => {
    toast.success("Late fees have been applied to overdue invoices");
  };

  const previewFee = () => {
    const testAmount = 1000;
    const testDays = 10;
    const fee = calculateLateFee(testAmount, testDays);
    toast.info(`Preview: $${fee.toFixed(2)} late fee for $${testAmount} invoice that's ${testDays} days overdue`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Late Fee Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="enabled">Enable Late Fees</Label>
              <Switch
                id="enabled"
                checked={settings.isEnabled}
                onCheckedChange={(checked) => updateSettings("isEnabled", checked)}
              />
            </div>

            {settings.isEnabled && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="feeType">Fee Type</Label>
                    <Select value={settings.feeType} onValueChange={(value) => updateSettings("feeType", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="feeAmount">
                      {settings.feeType === "percentage" ? "Percentage (%)" : "Fixed Amount ($)"}
                    </Label>
                    <Input
                      id="feeAmount"
                      type="number"
                      value={settings.feeAmount}
                      onChange={(e) => updateSettings("feeAmount", parseFloat(e.target.value) || 0)}
                      placeholder={settings.feeType === "percentage" ? "1.5" : "25.00"}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gracePeriod">Grace Period (days)</Label>
                    <Input
                      id="gracePeriod"
                      type="number"
                      value={settings.gracePeriod}
                      onChange={(e) => updateSettings("gracePeriod", parseInt(e.target.value) || 0)}
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxFee">Maximum Fee ($)</Label>
                    <Input
                      id="maxFee"
                      type="number"
                      value={settings.maxFee}
                      onChange={(e) => updateSettings("maxFee", parseFloat(e.target.value) || 0)}
                      placeholder="100.00"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="compound">Compound Daily</Label>
                  <Switch
                    id="compound"
                    checked={settings.compoundDaily}
                    onCheckedChange={(checked) => updateSettings("compoundDaily", checked)}
                  />
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={previewFee}>
                    Preview Calculation
                  </Button>
                  <Button onClick={applyLateFees}>
                    Apply Late Fees
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {settings.isEnabled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Invoices with Late Fees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invoicesWithFees.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Percent className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-medium">{invoice.id} - {invoice.customer}</p>
                      <p className="text-sm text-muted-foreground">
                        Due: {invoice.dueDate} • {invoice.daysOverdue} days overdue
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Original: ${invoice.originalAmount.toFixed(2)}</p>
                        <p className="text-sm text-orange-600">Late Fee: ${invoice.lateFee.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-lg">${invoice.totalAmount.toFixed(2)}</p>
                        <Badge variant="secondary">Total Due</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
