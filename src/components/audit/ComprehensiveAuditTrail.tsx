
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, Filter, Search, Shield, Eye, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { RoleBasedAccess } from "@/components/auth/RoleBasedAccess";

interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  status: "Success" | "Failed" | "Warning";
}

export const ComprehensiveAuditTrail: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUser, setFilterUser] = useState("all");
  const [filterAction, setFilterAction] = useState("all");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [dateRange, setDateRange] = useState("today");

  const auditEntries: AuditEntry[] = [
    {
      id: "audit-001",
      timestamp: "2025-01-10 09:15:22",
      userId: "user-001",
      userName: "John Smith",
      action: "LOGIN",
      resource: "Authentication",
      details: "Successful login from Chrome browser",
      ipAddress: "192.168.1.105",
      userAgent: "Chrome 120.0.0.0",
      severity: "Low",
      status: "Success"
    },
    {
      id: "audit-002",
      timestamp: "2025-01-10 09:23:45",
      userId: "user-001",
      userName: "John Smith",
      action: "CREATE_INVOICE",
      resource: "Invoice #INV-2025-001",
      details: "Created invoice for $5,000.00 for ABC Corp",
      ipAddress: "192.168.1.105",
      userAgent: "Chrome 120.0.0.0",
      severity: "Medium",
      status: "Success"
    },
    {
      id: "audit-003",
      timestamp: "2025-01-10 10:05:12",
      userId: "user-002",
      userName: "Sarah Johnson",
      action: "FAILED_LOGIN",
      resource: "Authentication",
      details: "Failed login attempt - incorrect password",
      ipAddress: "192.168.1.110",
      userAgent: "Firefox 121.0.0.0",
      severity: "High",
      status: "Failed"
    },
    {
      id: "audit-004",
      timestamp: "2025-01-10 10:17:30",
      userId: "user-001",
      userName: "John Smith",
      action: "DELETE_TRANSACTION",
      resource: "Transaction #TXN-001",
      details: "Deleted bank transaction worth $1,200.00",
      ipAddress: "192.168.1.105",
      userAgent: "Chrome 120.0.0.0",
      severity: "Critical",
      status: "Success"
    }
  ];

  const filteredEntries = auditEntries.filter(entry => {
    const matchesSearch = 
      entry.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUser = filterUser === "all" || entry.userId === filterUser;
    const matchesAction = filterAction === "all" || entry.action === filterAction;
    const matchesSeverity = filterSeverity === "all" || entry.severity === filterSeverity;
    
    return matchesSearch && matchesUser && matchesAction && matchesSeverity;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Low": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "High": return "bg-orange-100 text-orange-800";
      case "Critical": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Success": return "bg-green-100 text-green-800";
      case "Failed": return "bg-red-100 text-red-800";
      case "Warning": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const exportAuditLog = () => {
    const csvContent = [
      "Timestamp,User,Action,Resource,Details,IP Address,Severity,Status",
      ...filteredEntries.map(entry => 
        `${entry.timestamp},${entry.userName},${entry.action},${entry.resource},"${entry.details}",${entry.ipAddress},${entry.severity},${entry.status}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success("Audit log exported successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Comprehensive Audit Trail
          </h2>
          <p className="text-muted-foreground">Complete system activity monitoring and logging</p>
        </div>
        <RoleBasedAccess allowedRoles={["Admin", "Owner"]}>
          <Button onClick={exportAuditLog} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Log
          </Button>
        </RoleBasedAccess>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={filterUser} onValueChange={setFilterUser}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="user-001">John Smith</SelectItem>
                <SelectItem value="user-002">Sarah Johnson</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="LOGIN">Login</SelectItem>
                <SelectItem value="CREATE_INVOICE">Create Invoice</SelectItem>
                <SelectItem value="DELETE_TRANSACTION">Delete Transaction</SelectItem>
                <SelectItem value="FAILED_LOGIN">Failed Login</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 days</SelectItem>
                <SelectItem value="month">Last 30 days</SelectItem>
                <SelectItem value="quarter">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card>
        <CardHeader>
          <CardTitle>System Activity Log</CardTitle>
          <CardDescription>
            Showing {filteredEntries.length} of {auditEntries.length} audit entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-mono text-xs">
                      {entry.timestamp}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {entry.userName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-medium">{entry.userName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {entry.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {entry.resource}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {entry.details}
                    </TableCell>
                    <TableCell>
                      <Badge className={getSeverityColor(entry.severity)}>
                        {entry.severity === "Critical" && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {entry.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(entry.status)}>
                        {entry.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {entry.ipAddress}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Security Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-500" />
              Activity Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Total Activities</span>
                <span className="font-semibold">{auditEntries.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Successful Actions</span>
                <span className="font-semibold text-green-600">
                  {auditEntries.filter(e => e.status === "Success").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Failed Actions</span>
                <span className="font-semibold text-red-600">
                  {auditEntries.filter(e => e.status === "Failed").length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-orange-500" />
              Security Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Critical Events</span>
                <span className="font-semibold text-red-600">
                  {auditEntries.filter(e => e.severity === "Critical").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">High Risk Events</span>
                <span className="font-semibold text-orange-600">
                  {auditEntries.filter(e => e.severity === "High").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Failed Logins</span>
                <span className="font-semibold text-red-600">
                  {auditEntries.filter(e => e.action === "FAILED_LOGIN").length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Last Hour</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Last 24 Hours</span>
                <span className="font-semibold">87</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Active Users</span>
                <span className="font-semibold">3</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
