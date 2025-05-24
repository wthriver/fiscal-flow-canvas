
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, BookOpen, FileText, Calculator } from "lucide-react";

const Journal: React.FC = () => {
  const journalEntries = [
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
  ];

  const getStatusBadge = (status: string) => {
    return status === 'Posted' ? 
      <Badge className="bg-green-100 text-green-800">Posted</Badge> : 
      <Badge variant="outline">Draft</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">General Journal</h1>
          <p className="text-muted-foreground">Record and manage journal entries</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          New Entry
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Entries</p>
                <p className="text-xl font-semibold">147</p>
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
                <p className="text-xl font-semibold">142</p>
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
                <p className="text-xl font-semibold">5</p>
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
                <p className="text-xl font-semibold">23</p>
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
                  <Button variant="outline" size="sm">View</Button>
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
