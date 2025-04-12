
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Save } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FiscalYearSettings() {
  const [fiscalYearStart, setFiscalYearStart] = useState("January");
  const [periodType, setPeriodType] = useState("monthly");
  const [lockDate, setLockDate] = useState("2023-12-31");
  
  const saveSettings = () => {
    toast.success("Fiscal year settings saved successfully");
  };
  
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <CardTitle>Fiscal Year</CardTitle>
        </div>
        <CardDescription>Configure your fiscal year and accounting periods</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fiscalYearStart">Fiscal Year Start</Label>
            <Select value={fiscalYearStart} onValueChange={setFiscalYearStart}>
              <SelectTrigger id="fiscalYearStart">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Your fiscal year starts on the 1st of {fiscalYearStart} and ends on the last day of {
                months[(months.indexOf(fiscalYearStart) + 11) % 12]
              }
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="periodType">Accounting Period Type</Label>
            <Select value={periodType} onValueChange={setPeriodType}>
              <SelectTrigger id="periodType">
                <SelectValue placeholder="Select period type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly (12 periods per year)</SelectItem>
                <SelectItem value="quarterly">Quarterly (4 periods per year)</SelectItem>
                <SelectItem value="custom">Custom Periods</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {periodType === "custom" && (
            <div className="space-y-2 p-3 border rounded bg-muted">
              <p className="text-sm font-medium">Custom periods configuration</p>
              <p className="text-sm text-muted-foreground">Contact support to set up custom accounting periods.</p>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="lockDate">Books Lockout Date</Label>
            <Input 
              type="date" 
              id="lockDate" 
              value={lockDate}
              onChange={(e) => setLockDate(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Entries dated on or before this date cannot be modified
            </p>
          </div>
        </div>
        
        <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-md border border-amber-200 dark:border-amber-800">
          <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300">Important Note</h4>
          <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
            Changing your fiscal year settings may impact your financial reports. We recommend consulting with your accountant before making changes.
          </p>
        </div>
        
        <div className="flex justify-end pt-2">
          <Button onClick={saveSettings}>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
