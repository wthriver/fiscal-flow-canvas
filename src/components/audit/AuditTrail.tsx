
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Download, Filter, Shield, Edit, Trash, Plus, Eye } from "lucide-react";
import { toast } from "sonner";

interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  changes?: any;
  ipAddress?: string;
  userAgent?: string;
  severity: "Low" | "Medium" | "High" | "Critical";
}

export const AuditTrail = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("all");
  const [filterEntity, setFilterEntity] = useState("all");
  const [dateRange, setDateRange] = useState("7-days");

  // Mock audit data
  const auditEntries: AuditEntry[] = [
    {
      id: "1",
      timestamp: "2024-01-25 14:30:25",
      userId: "user-1",
      userName: "John Smith",
      action: "Created",
      entity: "Invoice",
      entityId: "INV-001",
      severity: "Low",
      ipAddress: "192.168.1.100",
      changes: { amount: 2500, customer: "ABC Corp" }
    },
    {
      id: "2",
      timestamp: "2024-01-25 14:25:18",
      userId: "user-2",
      userName: "Sarah Johnson",
      action: "Updated",
      entity: "User",
      entityId: "user-3",
      severity: "Medium",
      ipAddress: "192.168.1.101",
      changes: { role: "Admin", permissions: ["financial_data", "reports"] }
    },
    {
      id: "3",
      timestamp: "2024-01-25 14:20:45",
      userId: "user-1",
      userName: "John Smith",
      action: "Deleted",
      entity: "Expense",
      entityId: "EXP-045",
      severity: "High",
      ipAddress: "192.168.1.100",
      changes: { amount: 150, category: "Office Supplies" }
    },
    {
      id: "4",
      timestamp: "2024-01-25 14:15:32",
      userId: "user-3",
      userName: "Mike Davis",
      action: "Login",
      entity: "System",
      entityId: "auth",
      severity: "Low",
      ipAddress: "192.168.1.102"
    },
    {
      id: "5",
      timestamp: "2024-01-25 14:10:15",
      userId: "user-2",
      userName: "Sarah Johnson",
      action: "Exported",
      entity: "Report",
      entityId: "financial-summary",
      severity: "Medium",
      ipAddress: "192.168.1.101",
      changes: { reportType: "Financial Summary", dateRange: "2024-01" }
    },
    {
      id: "6",
      timestamp: "2024-01-25 13:45:22",
      userId: "user-1",
      userName: "John Smith",
      action: "Updated",
      entity: "Company Settings",
      entityId: "settings",
      severity: "Critical",
      ipAddress: "192.168.1.100",
      changes: { fiscalYear: "2024", taxRates: "updated" }
    }
  ];

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case "created":
        return <Plus className="h-4 w-4 text-green-500" />;
      case "updated":
        return <Edit className="h-4 w-4 text-blue-500" />;
      case "deleted":
        return <Trash className="h-4 w-4 text-red-500" />;
      case "viewed":
      case "exported":
        return <Eye className="h-4 w-4 text-purple-500" />;
      case "login":
        return <Shield className="h-4 w-4 text-gray-500" />;
      default:
        return <Edit className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Low":
        return "secondary";
      case "Medium":
        return "outline";
      case "High":
        return "destructive";
      case "Critical":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const filteredEntries = auditEntries.filter(entry => {
    const matchesSearch = searchTerm === "" || 
      entry.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.entityId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = filterAction === "all" || entry.action.toLowerCase() === filterAction.toLowerCase();
    const matchesEntity = filterEntity === "all" || entry.entity.toLowerCase() === filterEntity.toLowerCase();
    
    return matchesSearch && matchesAction && matchesEntity;
  });

  const exportAuditLog = () => {
    toast.success("Audit log exported successfully");
  };

  const formatChanges = (changes: any) => {
    if (!changes) return "No details";
    return Object.entries(changes)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Audit Trail</h2>
          <p className="text-muted-foreground">Complete activity log and compliance tracking</p>
        </div>
        <Button onClick={exportAuditLog}>
          <Download className="h-4 w-4 mr-2" />
          Export Log
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditEntries.length}</div>
            <p className="text-sm text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-red-600">Critical Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {auditEntries.filter(e => e.severity === "Critical").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-orange-600">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {auditEntries.filter(e => e.severity === "High").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-blue-600">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {new Set(auditEntries.map(e => e.userId)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger>
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="created">Created</SelectItem>
                <SelectItem value="updated">Updated</SelectItem>
                <SelectItem value="deleted">Deleted</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="exported">Exported</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterEntity} onValueChange={setFilterEntity}>
              <SelectTrigger>
                <SelectValue placeholder="All Entities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                <SelectItem value="invoice">Invoice</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="report">Report</SelectItem>
                <SelectItem value="company settings">Company Settings</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24-hours">Last 24 Hours</SelectItem>
                <SelectItem value="7-days">Last 7 Days</SelectItem>
                <SelectItem value="30-days">Last 30 Days</SelectItem>
                <SelectItem value="90-days">Last 90 Days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Log</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-mono text-sm">
                    {entry.timestamp}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {getUserInitials(entry.userName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{entry.userName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getActionIcon(entry.action)}
                      <span>{entry.action}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <span className="font-medium">{entry.entity}</span>
                      <div className="text-xs text-muted-foreground">
                        ID: {entry.entityId}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getSeverityColor(entry.severity)}>
                      {entry.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="text-sm truncate" title={formatChanges(entry.changes)}>
                      {formatChanges(entry.changes)}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {entry.ipAddress}
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
