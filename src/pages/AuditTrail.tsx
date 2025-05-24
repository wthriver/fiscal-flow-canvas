
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCompany } from "@/contexts/CompanyContext";
import { Shield, Clock, User, FileText } from "lucide-react";

const AuditTrail: React.FC = () => {
  const { currentCompany } = useCompany();

  // Demo audit trail data
  const auditEntries = [
    {
      id: 'audit-1',
      timestamp: '2025-05-24 10:30:00',
      user: 'John Admin',
      action: 'Invoice Created',
      resource: 'INV-001',
      details: 'Created invoice for Smith Enterprises - $2,500.00',
      type: 'create'
    },
    {
      id: 'audit-2',
      timestamp: '2025-05-24 09:15:00',
      user: 'Sarah Manager',
      action: 'Customer Updated',
      resource: 'CUST-002',
      details: 'Updated contact information for TechStart Inc',
      type: 'update'
    },
    {
      id: 'audit-3',
      timestamp: '2025-05-23 16:45:00',
      user: 'Mike User',
      action: 'Expense Deleted',
      resource: 'EXP-045',
      details: 'Deleted duplicate office supplies expense',
      type: 'delete'
    },
    {
      id: 'audit-4',
      timestamp: '2025-05-23 14:20:00',
      user: 'John Admin',
      action: 'User Access Granted',
      resource: 'USER-005',
      details: 'Granted accounting access to new user',
      type: 'security'
    }
  ];

  const getActionBadge = (type: string) => {
    const variants = {
      create: "default",
      update: "secondary",
      delete: "destructive",
      security: "outline"
    } as const;
    
    return <Badge variant={variants[type as keyof typeof variants] || "default"}>{type}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Audit Trail</h1>
        <p className="text-muted-foreground">Complete activity log for {currentCompany?.name || 'Your Company'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-xl font-semibold">1,247</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-xl font-semibold">23</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-xl font-semibold">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Critical Events</p>
                <p className="text-xl font-semibold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-mono text-sm">{entry.timestamp}</TableCell>
                  <TableCell>{entry.user}</TableCell>
                  <TableCell>{entry.action}</TableCell>
                  <TableCell>{entry.resource}</TableCell>
                  <TableCell className="max-w-xs truncate">{entry.details}</TableCell>
                  <TableCell>{getActionBadge(entry.type)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditTrail;
