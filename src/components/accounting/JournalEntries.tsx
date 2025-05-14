
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Plus, Calendar, FileText, ArrowUpDown, Download } from "lucide-react";
import { toast } from "sonner";
import { useCompany } from "@/contexts/CompanyContext";

// Sample journal entries
const JOURNAL_ENTRIES = [
  {
    id: "je-001",
    date: "2025-05-10",
    reference: "JE-0025",
    description: "Monthly Rent Payment",
    entries: [
      { account: "6100 - Rent Expense", debit: "$2,000.00", credit: "$0.00" },
      { account: "1000 - Cash", debit: "$0.00", credit: "$2,000.00" }
    ],
    status: "posted"
  },
  {
    id: "je-002",
    date: "2025-05-08",
    reference: "JE-0024",
    description: "Office Supplies Purchase",
    entries: [
      { account: "6200 - Office Supplies", debit: "$350.75", credit: "$0.00" },
      { account: "1000 - Cash", debit: "$0.00", credit: "$350.75" }
    ],
    status: "posted"
  },
  {
    id: "je-003",
    date: "2025-05-12",
    reference: "JE-0026",
    description: "Client Retainer Payment",
    entries: [
      { account: "1000 - Cash", debit: "$5,000.00", credit: "$0.00" },
      { account: "2000 - Unearned Revenue", debit: "$0.00", credit: "$5,000.00" }
    ],
    status: "draft"
  }
];

export const JournalEntries: React.FC = () => {
  const { currentCompany } = useCompany();
  const [entries, setEntries] = useState(JOURNAL_ENTRIES);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isNewEntryDialogOpen, setIsNewEntryDialogOpen] = useState(false);
  
  // Filter entries based on search and filters
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = 
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.reference.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesDate = dateFilter === "all" || 
      (dateFilter === "current-month" && entry.date.startsWith("2025-05"));
      
    const matchesStatus = statusFilter === "all" || entry.status === statusFilter;
    
    return matchesSearch && matchesDate && matchesStatus;
  });
  
  const handleAddEntry = () => {
    toast.success("Journal entry created", {
      description: "The new journal entry has been recorded successfully"
    });
    setIsNewEntryDialogOpen(false);
  };
  
  const handleExport = () => {
    toast.success("Exporting journal entries", {
      description: "Your journal entries will be downloaded shortly"
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Journal Entries</h2>
          <p className="text-muted-foreground">Create and manage journal entries</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsNewEntryDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Journal Entry
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Journal Entries</CardTitle>
          <CardDescription>Record and track all journal entries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search entries..."
                  className="pl-8 w-full md:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="current-month">Current Month</SelectItem>
                  <SelectItem value="previous-month">Previous Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="posted">Posted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead className="w-[120px]">Reference</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.length > 0 ? (
                  filteredEntries.map((entry) => {
                    // Calculate total debits and credits
                    const totalDebit = entry.entries.reduce((sum, line) => {
                      const debitAmount = parseFloat(line.debit.replace(/[^0-9.-]+/g, "") || "0");
                      return sum + debitAmount;
                    }, 0);
                    
                    const totalCredit = entry.entries.reduce((sum, line) => {
                      const creditAmount = parseFloat(line.credit.replace(/[^0-9.-]+/g, "") || "0");
                      return sum + creditAmount;
                    }, 0);
                    
                    return (
                      <TableRow key={entry.id}>
                        <TableCell>{entry.date}</TableCell>
                        <TableCell>{entry.reference}</TableCell>
                        <TableCell>{entry.description}</TableCell>
                        <TableCell className="text-right">${totalDebit.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${totalCredit.toFixed(2)}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            entry.status === 'posted' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {entry.status === 'posted' ? 'Posted' : 'Draft'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No journal entries found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredEntries.length} of {entries.length} entries
          </div>
        </CardFooter>
      </Card>
      
      {/* New Journal Entry Dialog */}
      <Dialog open={isNewEntryDialogOpen} onOpenChange={setIsNewEntryDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Journal Entry</DialogTitle>
            <DialogDescription>
              Create a new journal entry with debits and credits
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="entry-date">Date*</label>
                <Input id="entry-date" type="date" defaultValue="2025-05-14" />
              </div>
              <div className="space-y-2">
                <label htmlFor="entry-reference">Reference*</label>
                <Input id="entry-reference" placeholder="e.g., JE-0027" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="entry-description">Description*</label>
              <Input id="entry-description" placeholder="Description of the transaction" />
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Journal Entry Lines</h4>
              <div className="space-y-4 mb-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Account</TableHead>
                        <TableHead className="text-right">Debit</TableHead>
                        <TableHead className="text-right">Credit</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select account" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1000">1000 - Cash</SelectItem>
                              <SelectItem value="1100">1100 - Accounts Receivable</SelectItem>
                              <SelectItem value="2000">2000 - Accounts Payable</SelectItem>
                              <SelectItem value="4000">4000 - Sales Revenue</SelectItem>
                              <SelectItem value="5000">5000 - Cost of Goods Sold</SelectItem>
                              <SelectItem value="6000">6000 - Expenses</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input placeholder="0.00" />
                        </TableCell>
                        <TableCell>
                          <Input placeholder="0.00" />
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">-</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select account" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1000">1000 - Cash</SelectItem>
                              <SelectItem value="1100">1100 - Accounts Receivable</SelectItem>
                              <SelectItem value="2000">2000 - Accounts Payable</SelectItem>
                              <SelectItem value="4000">4000 - Sales Revenue</SelectItem>
                              <SelectItem value="5000">5000 - Cost of Goods Sold</SelectItem>
                              <SelectItem value="6000">6000 - Expenses</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input placeholder="0.00" />
                        </TableCell>
                        <TableCell>
                          <Input placeholder="0.00" />
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">-</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Line
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between items-center py-2 border-t border-b">
              <span className="font-medium">Totals</span>
              <div className="space-x-4">
                <span>Debits: <strong>$0.00</strong></span>
                <span>Credits: <strong>$0.00</strong></span>
                <span>Difference: <strong>$0.00</strong></span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="entry-notes">Notes (Optional)</label>
              <textarea 
                id="entry-notes" 
                className="min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                placeholder="Additional notes about this entry"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewEntryDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddEntry}>
              Create Journal Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
