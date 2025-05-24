
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Car, Plus, Calculator } from "lucide-react";
import { toast } from "sonner";

interface MileageEntry {
  id: string;
  date: string;
  startLocation: string;
  endLocation: string;
  purpose: string;
  miles: number;
  rate: number;
  amount: number;
  status: string;
}

export const MileageTracking = () => {
  const [mileageEntries, setMileageEntries] = useState<MileageEntry[]>([
    {
      id: "mile-1",
      date: "2025-05-20",
      startLocation: "Office",
      endLocation: "Client Meeting - Downtown",
      purpose: "Business Meeting",
      miles: 25,
      rate: 0.655,
      amount: 16.38,
      status: "Approved"
    },
    {
      id: "mile-2",
      date: "2025-05-22",
      startLocation: "Office",
      endLocation: "Conference Center",
      purpose: "Training Session",
      miles: 45,
      rate: 0.655,
      amount: 29.48,
      status: "Pending"
    }
  ]);

  const [newEntry, setNewEntry] = useState({
    date: "",
    startLocation: "",
    endLocation: "",
    purpose: "",
    miles: "",
    rate: "0.655"
  });

  const handleAddEntry = () => {
    if (!newEntry.date || !newEntry.startLocation || !newEntry.endLocation || !newEntry.miles) {
      toast.error("Please fill in all required fields");
      return;
    }

    const miles = parseFloat(newEntry.miles);
    const rate = parseFloat(newEntry.rate);
    const amount = miles * rate;

    const entry: MileageEntry = {
      id: `mile-${Date.now()}`,
      date: newEntry.date,
      startLocation: newEntry.startLocation,
      endLocation: newEntry.endLocation,
      purpose: newEntry.purpose,
      miles: miles,
      rate: rate,
      amount: amount,
      status: "Pending"
    };

    setMileageEntries(prev => [entry, ...prev]);
    setNewEntry({
      date: "",
      startLocation: "",
      endLocation: "",
      purpose: "",
      miles: "",
      rate: "0.655"
    });
    toast.success("Mileage entry added successfully");
  };

  const totalAmount = mileageEntries.reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Add Mileage Entry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newEntry.date}
                onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="startLocation">Start Location</Label>
              <Input
                id="startLocation"
                value={newEntry.startLocation}
                onChange={(e) => setNewEntry({...newEntry, startLocation: e.target.value})}
                placeholder="Office, Home, etc."
              />
            </div>
            <div>
              <Label htmlFor="endLocation">End Location</Label>
              <Input
                id="endLocation"
                value={newEntry.endLocation}
                onChange={(e) => setNewEntry({...newEntry, endLocation: e.target.value})}
                placeholder="Client location, meeting venue, etc."
              />
            </div>
            <div>
              <Label htmlFor="purpose">Business Purpose</Label>
              <Input
                id="purpose"
                value={newEntry.purpose}
                onChange={(e) => setNewEntry({...newEntry, purpose: e.target.value})}
                placeholder="Client meeting, training, etc."
              />
            </div>
            <div>
              <Label htmlFor="miles">Miles</Label>
              <Input
                id="miles"
                type="number"
                step="0.1"
                value={newEntry.miles}
                onChange={(e) => setNewEntry({...newEntry, miles: e.target.value})}
                placeholder="0.0"
              />
            </div>
            <div>
              <Label htmlFor="rate">Rate per Mile</Label>
              <Input
                id="rate"
                type="number"
                step="0.001"
                value={newEntry.rate}
                onChange={(e) => setNewEntry({...newEntry, rate: e.target.value})}
              />
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <Button onClick={handleAddEntry}>
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
            {newEntry.miles && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calculator className="h-4 w-4" />
                Estimated Amount: ${(parseFloat(newEntry.miles || "0") * parseFloat(newEntry.rate)).toFixed(2)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Mileage Entries</CardTitle>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Reimbursement</p>
              <p className="text-lg font-semibold">${totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Miles</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mileageEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{entry.startLocation}</div>
                      <div className="text-muted-foreground">→ {entry.endLocation}</div>
                    </div>
                  </TableCell>
                  <TableCell>{entry.purpose}</TableCell>
                  <TableCell>{entry.miles}</TableCell>
                  <TableCell>${entry.rate}</TableCell>
                  <TableCell>${entry.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={entry.status === "Approved" ? "default" : "secondary"}>
                      {entry.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
