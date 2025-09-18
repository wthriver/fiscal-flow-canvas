import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  Upload, 
  Download, 
  FileText, 
  Database, 
  Check, 
  X, 
  AlertTriangle, 
  FileSpreadsheet,
  FileImage,
  File,
  Settings,
  PlayCircle,
  History,
  RefreshCw,
  ExternalLink
} from "lucide-react";

export const DataImportExport = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importType, setImportType] = useState("transactions");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const importTypes = [
    { id: "transactions", name: "Bank Transactions", description: "Import CSV or QIF bank transaction data" },
    { id: "customers", name: "Customers", description: "Import customer contact information" },
    { id: "vendors", name: "Vendors", description: "Import vendor and supplier data" },
    { id: "invoices", name: "Invoices", description: "Import existing invoice data" },
    { id: "expenses", name: "Expenses", description: "Import expense and bill data" },
    { id: "inventory", name: "Inventory Items", description: "Import product and inventory data" },
    { id: "accounts", name: "Chart of Accounts", description: "Import account structure" },
    { id: "employees", name: "Employees", description: "Import employee and payroll data" }
  ];

  const exportFormats = [
    { id: "csv", name: "CSV", description: "Comma-separated values", icon: File },
    { id: "excel", name: "Excel", description: "Microsoft Excel format", icon: FileSpreadsheet },
    { id: "pdf", name: "PDF", description: "Portable document format", icon: FileText },
    { id: "qif", name: "QIF", description: "Quicken Interchange Format", icon: FileText },
    { id: "json", name: "JSON", description: "JavaScript Object Notation", icon: Database }
  ];

  const importHistory = [
    {
      id: 1,
      type: "Bank Transactions",
      file: "bank_export_jan2024.csv",
      date: "2024-01-15 10:30 AM",
      status: "Success",
      records: 245,
      errors: 0
    },
    {
      id: 2,
      type: "Customers",
      file: "customer_list.xlsx",
      date: "2024-01-10 2:15 PM", 
      status: "Warning",
      records: 156,
      errors: 3
    },
    {
      id: 3,
      type: "Expenses",
      file: "expenses_q4.csv",
      date: "2024-01-05 9:45 AM",
      status: "Failed",
      records: 0,
      errors: 12
    }
  ];

  const integrationConnections = [
    {
      name: "QuickBooks Desktop",
      description: "Import/export QBW files",
      status: "Available",
      icon: Database
    },
    {
      name: "QuickBooks Online",
      description: "Sync data via API",
      status: "Connected",
      icon: Database
    },
    {
      name: "Xero",
      description: "Import from Xero accounting",
      status: "Available", 
      icon: Database
    },
    {
      name: "Sage 50",
      description: "Import Sage data files",
      status: "Available",
      icon: Database
    },
    {
      name: "Excel/Google Sheets",
      description: "Import spreadsheet data",
      status: "Available",
      icon: FileSpreadsheet
    }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const mappingFields = [
    { source: "Date", target: "Transaction Date", status: "mapped" },
    { source: "Description", target: "Description", status: "mapped" },
    { source: "Amount", target: "Amount", status: "mapped" },
    { source: "Category", target: "Account", status: "unmapped" },
    { source: "Reference", target: "Reference Number", status: "mapped" },
    { source: "Balance", target: "", status: "ignored" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Data Import & Export</h2>
          <p className="text-muted-foreground">Import data from other systems or export your data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <History className="h-4 w-4 mr-2" />
            Import History
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Integration Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="import" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="import">Import Data</TabsTrigger>
          <TabsTrigger value="export">Export Data</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="history">Import History</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Import Type</CardTitle>
                <CardDescription>Choose what type of data you want to import</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={importType} onValueChange={setImportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {importTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-2">
                  {importTypes.find(t => t.id === importType)?.description}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upload File</CardTitle>
                <CardDescription>Select a CSV, Excel, or QIF file to import</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    {selectedFile ? selectedFile.name : "Drag and drop or click to select file"}
                  </p>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    className="hidden" 
                    accept=".csv,.xlsx,.xls,.qif"
                    onChange={handleFileSelect}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose File
                  </Button>
                </div>
                
                {selectedFile && (
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      <span className="text-sm">{selectedFile.name}</span>
                      <Badge variant="outline">{(selectedFile.size / 1024).toFixed(1)} KB</Badge>
                    </div>
                    <Button size="sm" onClick={handleUpload} disabled={isUploading}>
                      {isUploading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    </Button>
                  </div>
                )}

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {uploadProgress === 100 && (
            <Card>
              <CardHeader>
                <CardTitle>Field Mapping</CardTitle>
                <CardDescription>Map your file columns to the correct fields</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mappingFields.map((field, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-4">
                        <div className="font-medium">{field.source}</div>
                        <div className="text-muted-foreground">→</div>
                        <Select defaultValue={field.target}>
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Select target field" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Transaction Date">Transaction Date</SelectItem>
                            <SelectItem value="Description">Description</SelectItem>
                            <SelectItem value="Amount">Amount</SelectItem>
                            <SelectItem value="Account">Account</SelectItem>
                            <SelectItem value="Reference Number">Reference Number</SelectItem>
                            <SelectItem value="skip">Do not import</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Badge variant={
                        field.status === 'mapped' ? 'default' : 
                        field.status === 'unmapped' ? 'destructive' : 'secondary'
                      }>
                        {field.status === 'mapped' && <Check className="h-3 w-3 mr-1" />}
                        {field.status === 'unmapped' && <X className="h-3 w-3 mr-1" />}
                        {field.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline">Preview Data</Button>
                  <Button>
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Import Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Export Data</CardTitle>
                <CardDescription>Export your data to various formats</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Data Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select data to export" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Data (Complete Backup)</SelectItem>
                      <SelectItem value="transactions">Transactions</SelectItem>
                      <SelectItem value="customers">Customers</SelectItem>
                      <SelectItem value="vendors">Vendors</SelectItem>
                      <SelectItem value="invoices">Invoices</SelectItem>
                      <SelectItem value="reports">Financial Reports</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Date Range</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="ytd">Year to Date</SelectItem>
                      <SelectItem value="last-year">Last Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export Format</CardTitle>
                <CardDescription>Choose your preferred export format</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  {exportFormats.map((format) => (
                    <div key={format.id} className="flex items-center justify-between p-3 border rounded cursor-pointer hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <format.icon className="h-5 w-5" />
                        <div>
                          <div className="font-medium">{format.name}</div>
                          <div className="text-sm text-muted-foreground">{format.description}</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrationConnections.map((integration, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <integration.icon className="h-8 w-8" />
                      <div>
                        <CardTitle className="text-base">{integration.name}</CardTitle>
                        <CardDescription>{integration.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={integration.status === 'Connected' ? 'default' : 'outline'}>
                      {integration.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    {integration.status === 'Connected' ? (
                      <>
                        <Button variant="outline" size="sm" className="flex-1">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Sync Now
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" className="flex-1">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Import History</CardTitle>
              <CardDescription>View previous import operations and their results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {importHistory.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        item.status === 'Success' ? 'bg-green-500' : 
                        item.status === 'Warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <div className="font-medium">{item.type}</div>
                        <div className="text-sm text-muted-foreground">{item.file}</div>
                        <div className="text-xs text-muted-foreground">{item.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm">
                        <div>{item.records} records</div>
                        {item.errors > 0 && (
                          <div className="text-red-600">{item.errors} errors</div>
                        )}
                      </div>
                      <Badge variant={
                        item.status === 'Success' ? 'default' : 
                        item.status === 'Warning' ? 'secondary' : 'destructive'
                      }>
                        {item.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};