import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, BookOpen, FileText, Calculator, Download } from "lucide-react";
import { JournalEntryDialog } from "@/components/journal/JournalEntryDialog";
import { JournalEntryViewDialog } from "@/components/journal/JournalEntryViewDialog";
import { exportToCSV } from "@/utils/exportUtils";
import { JournalEntry } from "@/types/journal";

const Journal: React.FC = () => {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    {
      id: 'JE-001',
      date: '2025-05-24',
      description: 'Customer payment received',
      reference: 'INV-001',
      debits: [
        { account: 'Cash', amount: 2500.00 }
      ],
      credits: [
        { account: 'Accounts Receivable', amount: 2500.00 }
      ],
      status: 'Posted'
    },
    {
      id: 'JE-002',
      date: '2025-05-23',
      description: 'Office rent payment',
      reference: 'BILL-045',
      debits: [
        { account: 'Rent Expense', amount: 1200.00 }
      ],
      credits: [
        { account: 'Cash', amount: 1200.00 }
      ],
      status: 'Posted'
    },
    {
      id: 'JE-003',
      date: '2025-05-22',
      description: 'Equipment purchase',
      reference: 'PO-012',
      debits: [
        { account: 'Equipment', amount: 3500.00 }
      ],
      credits: [
        { account: 'Accounts Payable', amount: 3500.00 }
      ],
      status: 'Draft'
    }
  ]);

  const handleSaveEntry = (entry: JournalEntry) => {
    setJournalEntries(prev => {
      const existing = prev.find(e => e.id === entry.id);
      if (existing) {
        return prev.map(e => e.id === entry.id ? entry : e);
      }
      return [...prev, entry];
    });
  };

  const handleExportEntries = () => {
    const exportData = journalEntries.map(entry => ({
      ID: entry.id,
      Date: entry.date,
      Description: entry.description,
      Reference: entry.reference || '',
      'Total Amount': entry.debits.reduce((sum, d) => sum + d.amount, 0),
      Status: entry.status
    }));
    
    exportToCSV(exportData, 'journal_entries');
  };

  const getStatusBadge = (status: string) => {
    return status === 'Posted' ? 
      <Badge className="bg-green-100 text-green-800">Posted</Badge> : 
      <Badge variant="outline">Draft</Badge>;
  };

  const getTotalEntries = () => journalEntries.length;
  const getPostedEntries = () => journalEntries.filter(e => e.status === 'Posted').length;
  const getDraftEntries = () => journalEntries.filter(e => e.status === 'Draft').length;
  const getThisMonthEntries = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return journalEntries.filter(e => {
      const entryDate = new Date(e.date);
      return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
    }).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">General Journal</h1>
          <p className="text-muted-foreground">Record and manage journal entries</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportEntries}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <JournalEntryDialog onSave={handleSaveEntry}>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              New Entry
            </Button>
          </JournalEntryDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Entries</p>
                <p className="text-xl font-semibold">{getTotalEntries()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Posted</p>
                <p className="text-xl font-semibold">{getPostedEntries()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Draft</p>
                <p className="text-xl font-semibold">{getDraftEntries()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-xl font-semibold">{getThisMonthEntries()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Journal Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {journalEntries.map((entry) => (
              <div key={entry.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold">{entry.id}</h4>
                      {getStatusBadge(entry.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{entry.date} • {entry.description}</p>
                    {entry.reference && (
                      <p className="text-sm text-muted-foreground">Ref: {entry.reference}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <JournalEntryViewDialog entry={entry}>
                      <Button variant="outline" size="sm">View</Button>
                    </JournalEntryViewDialog>
                    <JournalEntryDialog onSave={handleSaveEntry} editEntry={entry}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </JournalEntryDialog>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-sm mb-2">Debits</h5>
                    <div className="space-y-1">
                      {entry.debits.map((debit, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{debit.account}</span>
                          <span className="font-mono">${debit.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-sm mb-2">Credits</h5>
                    <div className="space-y-1">
                      {entry.credits.map((credit, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{credit.account}</span>
                          <span className="font-mono">${credit.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Journal;
