
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface RecurringJournalEntry {
  id: string;
  description: string;
  frequency: 'monthly' | 'quarterly' | 'annually';
  nextRunDate: Date;
  isActive: boolean;
  debits: { account: string; amount: number }[];
  credits: { account: string; amount: number }[];
}

export const AdvancedJournalEntry: React.FC = () => {
  const [isRecurring, setIsRecurring] = useState(false);
  const [isReversing, setIsReversing] = useState(false);
  const [frequency, setFrequency] = useState<'monthly' | 'quarterly' | 'annually'>('monthly');
  const [reverseDate, setReverseDate] = useState<Date | undefined>();
  const [entries, setEntries] = useState([
    { id: '1', account: '', debit: 0, credit: 0 }
  ]);

  const accounts = [
    'Cash', 'Accounts Receivable', 'Inventory', 'Equipment',
    'Accounts Payable', 'Revenue', 'Expenses', 'Accrued Expenses'
  ];

  const addEntry = () => {
    setEntries([...entries, { id: Date.now().toString(), account: '', debit: 0, credit: 0 }]);
  };

  const removeEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const updateEntry = (id: string, field: string, value: any) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const handleSave = () => {
    const totalDebits = entries.reduce((sum, entry) => sum + (entry.debit || 0), 0);
    const totalCredits = entries.reduce((sum, entry) => sum + (entry.credit || 0), 0);

    if (Math.abs(totalDebits - totalCredits) > 0.01) {
      toast.error("Debits and credits must balance");
      return;
    }

    if (isRecurring) {
      toast.success("Recurring journal entry created successfully");
    } else if (isReversing) {
      toast.success("Reversing journal entry scheduled");
    } else {
      toast.success("Journal entry saved successfully");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Journal Entry</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="recurring" 
              checked={isRecurring}
              onCheckedChange={setIsRecurring}
            />
            <Label htmlFor="recurring">Recurring Entry</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="reversing" 
              checked={isReversing}
              onCheckedChange={setIsReversing}
            />
            <Label htmlFor="reversing">Reversing Entry</Label>
          </div>
        </div>

        {isRecurring && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Frequency</Label>
              <Select value={frequency} onValueChange={(value: any) => setFrequency(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {isReversing && (
          <div>
            <Label>Reverse Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {reverseDate ? format(reverseDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={reverseDate}
                  onSelect={setReverseDate}
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Journal Entries</h3>
            <Button onClick={addEntry} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Line
            </Button>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-12 gap-2 text-sm font-medium">
              <div className="col-span-5">Account</div>
              <div className="col-span-3">Debit</div>
              <div className="col-span-3">Credit</div>
              <div className="col-span-1">Action</div>
            </div>
            
            {entries.map((entry) => (
              <div key={entry.id} className="grid grid-cols-12 gap-2">
                <div className="col-span-5">
                  <Select 
                    value={entry.account} 
                    onValueChange={(value) => updateEntry(entry.id, 'account', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map(account => (
                        <SelectItem key={account} value={account}>{account}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-3">
                  <Input
                    type="number"
                    step="0.01"
                    value={entry.debit || ''}
                    onChange={(e) => updateEntry(entry.id, 'debit', parseFloat(e.target.value) || 0)}
                    onFocus={(e) => {
                      updateEntry(entry.id, 'credit', 0);
                    }}
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    type="number"
                    step="0.01"
                    value={entry.credit || ''}
                    onChange={(e) => updateEntry(entry.id, 'credit', parseFloat(e.target.value) || 0)}
                    onFocus={(e) => {
                      updateEntry(entry.id, 'debit', 0);
                    }}
                  />
                </div>
                <div className="col-span-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEntry(entry.id)}
                    disabled={entries.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-5 text-right font-semibold">Totals:</div>
              <div className="col-span-3 text-center font-semibold">
                ${entries.reduce((sum, entry) => sum + (entry.debit || 0), 0).toFixed(2)}
              </div>
              <div className="col-span-3 text-center font-semibold">
                ${entries.reduce((sum, entry) => sum + (entry.credit || 0), 0).toFixed(2)}
              </div>
              <div className="col-span-1"></div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSave}>Save Entry</Button>
        </div>
      </CardContent>
    </Card>
  );
};
