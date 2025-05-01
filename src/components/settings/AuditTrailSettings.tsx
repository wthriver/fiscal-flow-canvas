
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Download, History, Search, Filter } from "lucide-react";
import { toast } from "sonner";

export const AuditTrailSettings: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  
  const handleExportAudit = () => {
    toast.success("Audit trail exported", {
      description: "Your audit data has been downloaded as CSV"
    });
  };

  // Sample audit trail data
  const auditEntries = [
    { 
      id: "audit-001", 
      timestamp: "2025-05-01 09:15:22", 
      user: "john.doe@acmecorp.com", 
      action: "Login", 
      details: "Successful login from 192.168.1.105", 
      ip: "192.168.1.105" 
    },
    { 
      id: "audit-002", 
      timestamp: "2025-05-01 09:23:45", 
      user: "john.doe@acmecorp.com", 
      action: "Create Invoice", 
      details: "Created invoice #INV-006 for Global Tech ($3,000.00)", 
      ip: "192.168.1.105" 
    },
    { 
      id: "audit-003", 
      timestamp: "2025-05-01 10:05:12", 
      user: "jane.smith@acmecorp.com", 
      action: "Update Customer", 
      details: "Updated contact information for ABC Corporation", 
      ip: "192.168.1.110" 
    },
    { 
      id: "audit-004", 
      timestamp: "2025-05-01 10:17:30", 
      user: "john.doe@acmecorp.com", 
      action: "View Report", 
      details: "Generated Profit & Loss report for Q1 2025", 
      ip: "192.168.1.105" 
    },
    { 
      id: "audit-005", 
      timestamp: "2025-05-01 11:02:18", 
      user: "bob.johnson@acmecorp.com", 
      action: "Bank Reconciliation", 
      details: "Reconciled Business Checking account ending 3889", 
      ip: "192.168.1.115" 
    },
    { 
      id: "audit-006", 
      timestamp: "2025-05-01 11:45:33", 
      user: "jane.smith@acmecorp.com", 
      action: "Delete Transaction", 
      details: "Deleted duplicate transaction #tx007", 
      ip: "192.168.1.110" 
    }
  ];

  // Filter audit entries by search term and type
  const filteredEntries = auditEntries.filter(entry => {
    const matchesSearch = 
      entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === "all") return matchesSearch;
    return matchesSearch && entry.action.toLowerCase() === filterType.toLowerCase();
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <History className="h-6 w-6" />
          Audit Trail
        </h1>
        <Button 
          onClick={handleExportAudit}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          <span>Export Audit Trail</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Activity Log</CardTitle>
          <CardDescription>Track all changes made within the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search audit trail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="create invoice">Create Invoice</SelectItem>
                  <SelectItem value="update customer">Update Customer</SelectItem>
                  <SelectItem value="view report">View Report</SelectItem>
                  <SelectItem value="bank reconciliation">Bank Reconciliation</SelectItem>
                  <SelectItem value="delete transaction">Delete Transaction</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="today">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="lastweek">Last 7 Days</SelectItem>
                  <SelectItem value="lastmonth">Last 30 Days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead className="hidden md:table-cell">Details</TableHead>
                  <TableHead className="hidden md:table-cell">IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.length > 0 ? (
                  filteredEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-mono text-xs">{entry.timestamp}</TableCell>
                      <TableCell>{entry.user}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          entry.action === "Login" ? "bg-blue-100 text-blue-800" : 
                          entry.action.startsWith("Create") ? "bg-green-100 text-green-800" : 
                          entry.action.startsWith("Update") ? "bg-yellow-100 text-yellow-800" : 
                          entry.action.startsWith("Delete") ? "bg-red-100 text-red-800" : 
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {entry.action}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{entry.details}</TableCell>
                      <TableCell className="hidden md:table-cell font-mono text-xs">{entry.ip}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No audit entries found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Audit Settings</CardTitle>
            <CardDescription>Configure audit trail behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Retention Period</label>
              <Select defaultValue="365">
                <SelectTrigger>
                  <SelectValue placeholder="Select retention period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">6 months</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                  <SelectItem value="730">2 years</SelectItem>
                  <SelectItem value="1825">5 years</SelectItem>
                  <SelectItem value="3650">10 years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Detail Level</label>
              <Select defaultValue="detailed">
                <SelectTrigger>
                  <SelectValue placeholder="Select detail level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic (actions only)</SelectItem>
                  <SelectItem value="standard">Standard (actions & basic details)</SelectItem>
                  <SelectItem value="detailed">Detailed (complete change history)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-2">
              <Button>Save Settings</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Audit Statistics</CardTitle>
            <CardDescription>Overview of system activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Today's Activities</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold">142</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Users Today</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Log Size</p>
                <p className="text-2xl font-bold">14.3 MB</p>
              </div>
            </div>
            
            <div className="pt-2">
              <Button variant="outline" className="w-full">
                View Full Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
