import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Plus, FileText, Download, Mail, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";

interface Form1099Record {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorTIN: string; // Tax Identification Number
  vendorAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  taxYear: number;
  formType: "1099-NEC" | "1099-MISC" | "1099-INT" | "1099-DIV";
  amounts: {
    box1?: number; // Non-employee compensation (1099-NEC)
    box2?: number; // Rent
    box3?: number; // Other income
    box4?: number; // Federal income tax withheld
    box5?: number; // Fishing boat proceeds
    box6?: number; // Medical and health care payments
    box7?: number; // Substitute payments
    box8?: number; // Crop insurance proceeds
    box9?: number; // Excess golden parachute payments
    box10?: number; // Gross proceeds to attorney
    [key: string]: number | undefined;
  };
  status: "draft" | "ready" | "filed" | "corrected";
  filedDate?: string;
  correctionReason?: string;
  electronicFiling: boolean;
  notes: string;
}

interface Vendor1099Setup {
  id: string;
  vendorId: string;
  vendorName: string;
  tinType: "SSN" | "EIN";
  tin: string;
  threshold1099: number; // Minimum amount for 1099 reporting
  backupWithholding: boolean;
  exempt: boolean;
  exemptionReason?: string;
  w9OnFile: boolean;
  w9Date?: string;
}

export const Form1099Manager: React.FC = () => {
  const { currentCompany, updateCompany } = useCompany();
  const [activeTab, setActiveTab] = useState("overview");
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false);
  const [isVendorSetupDialogOpen, setIsVendorSetupDialogOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Sample 1099 records
  const [form1099Records, setForm1099Records] = useState<Form1099Record[]>([
    {
      id: "1099-1",
      vendorId: "vendor-1",
      vendorName: "ABC Consulting LLC",
      vendorTIN: "12-3456789",
      vendorAddress: {
        street: "123 Business Ave",
        city: "Business City",
        state: "CA",
        zipCode: "90210"
      },
      taxYear: 2024,
      formType: "1099-NEC",
      amounts: {
        box1: 15000, // Non-employee compensation
        box4: 0 // Federal tax withheld
      },
      status: "ready",
      electronicFiling: true,
      notes: "Regular contractor payments"
    },
    {
      id: "1099-2",
      vendorId: "vendor-2",
      vendorName: "XYZ Property Management",
      vendorTIN: "98-7654321",
      vendorAddress: {
        street: "456 Real Estate Blvd",
        city: "Property Town",
        state: "NY",
        zipCode: "10001"
      },
      taxYear: 2024,
      formType: "1099-MISC",
      amounts: {
        box2: 24000, // Rent
        box4: 0
      },
      status: "filed",
      filedDate: "2024-01-31",
      electronicFiling: true,
      notes: "Office rent payments"
    },
    {
      id: "1099-3",
      vendorId: "vendor-3",
      vendorName: "Professional Services Corp",
      vendorTIN: "11-2233445",
      vendorAddress: {
        street: "789 Professional Way",
        city: "Service City",
        state: "TX",
        zipCode: "75201"
      },
      taxYear: 2024,
      formType: "1099-NEC",
      amounts: {
        box1: 8500,
        box4: 0
      },
      status: "draft",
      electronicFiling: false,
      notes: "Legal services - requires paper filing"
    }
  ]);

  // Sample vendor 1099 setup
  const [vendor1099Setup, setVendor1099Setup] = useState<Vendor1099Setup[]>([
    {
      id: "setup-1",
      vendorId: "vendor-1",
      vendorName: "ABC Consulting LLC",
      tinType: "EIN",
      tin: "12-3456789",
      threshold1099: 600,
      backupWithholding: false,
      exempt: false,
      w9OnFile: true,
      w9Date: "2024-01-15"
    },
    {
      id: "setup-2",
      vendorId: "vendor-2",
      vendorName: "XYZ Property Management",
      tinType: "EIN",
      tin: "98-7654321",
      threshold1099: 600,
      backupWithholding: false,
      exempt: false,
      w9OnFile: true,
      w9Date: "2023-12-01"
    }
  ]);

  const [newRecord, setNewRecord] = useState<Partial<Form1099Record>>({
    vendorName: "",
    vendorTIN: "",
    vendorAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: ""
    },
    taxYear: new Date().getFullYear(),
    formType: "1099-NEC",
    amounts: {},
    status: "draft",
    electronicFiling: true,
    notes: ""
  });

  const [newVendorSetup, setNewVendorSetup] = useState<Partial<Vendor1099Setup>>({
    vendorName: "",
    tinType: "EIN",
    tin: "",
    threshold1099: 600,
    backupWithholding: false,
    exempt: false,
    w9OnFile: false
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "filed": return "bg-green-100 text-green-800";
      case "ready": return "bg-blue-100 text-blue-800";
      case "draft": return "bg-yellow-100 text-yellow-800";
      case "corrected": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "filed": return <CheckCircle className="h-4 w-4" />;
      case "ready": return <Clock className="h-4 w-4" />;
      case "draft": return <FileText className="h-4 w-4" />;
      case "corrected": return <AlertTriangle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getFormTypeDescription = (formType: string) => {
    switch (formType) {
      case "1099-NEC": return "Nonemployee Compensation";
      case "1099-MISC": return "Miscellaneous Information";
      case "1099-INT": return "Interest Income";
      case "1099-DIV": return "Dividends and Distributions";
      default: return formType;
    }
  };

  const calculateTotalAmount = (amounts: { [key: string]: number | undefined }) => {
    return Object.values(amounts).reduce((sum, amount) => sum + (amount || 0), 0);
  };

  const handleSaveRecord = () => {
    if (!newRecord.vendorName || !newRecord.vendorTIN) {
      toast.error("Please fill in required fields");
      return;
    }

    const record: Form1099Record = {
      id: `1099-${Date.now()}`,
      vendorId: `vendor-${Date.now()}`,
      vendorName: newRecord.vendorName!,
      vendorTIN: newRecord.vendorTIN!,
      vendorAddress: newRecord.vendorAddress!,
      taxYear: newRecord.taxYear || new Date().getFullYear(),
      formType: newRecord.formType as any || "1099-NEC",
      amounts: newRecord.amounts || {},
      status: newRecord.status as any || "draft",
      electronicFiling: newRecord.electronicFiling || true,
      notes: newRecord.notes || ""
    };

    setForm1099Records(prev => [...prev, record]);
    toast.success("1099 record created successfully");
    setIsRecordDialogOpen(false);
    resetRecordForm();
  };

  const handleSaveVendorSetup = () => {
    if (!newVendorSetup.vendorName || !newVendorSetup.tin) {
      toast.error("Please fill in required fields");
      return;
    }

    const setup: Vendor1099Setup = {
      id: `setup-${Date.now()}`,
      vendorId: `vendor-${Date.now()}`,
      vendorName: newVendorSetup.vendorName!,
      tinType: newVendorSetup.tinType as any || "EIN",
      tin: newVendorSetup.tin!,
      threshold1099: newVendorSetup.threshold1099 || 600,
      backupWithholding: newVendorSetup.backupWithholding || false,
      exempt: newVendorSetup.exempt || false,
      exemptionReason: newVendorSetup.exemptionReason,
      w9OnFile: newVendorSetup.w9OnFile || false,
      w9Date: newVendorSetup.w9Date
    };

    setVendor1099Setup(prev => [...prev, setup]);
    toast.success("Vendor 1099 setup created successfully");
    setIsVendorSetupDialogOpen(false);
    resetVendorSetupForm();
  };

  const resetRecordForm = () => {
    setNewRecord({
      vendorName: "",
      vendorTIN: "",
      vendorAddress: {
        street: "",
        city: "",
        state: "",
        zipCode: ""
      },
      taxYear: new Date().getFullYear(),
      formType: "1099-NEC",
      amounts: {},
      status: "draft",
      electronicFiling: true,
      notes: ""
    });
  };

  const resetVendorSetupForm = () => {
    setNewVendorSetup({
      vendorName: "",
      tinType: "EIN",
      tin: "",
      threshold1099: 600,
      backupWithholding: false,
      exempt: false,
      w9OnFile: false
    });
  };

  const handleFileForms = () => {
    const readyForms = form1099Records.filter(record => record.status === "ready");
    if (readyForms.length === 0) {
      toast.error("No forms ready for filing");
      return;
    }

    // Simulate filing process
    setForm1099Records(prev => prev.map(record => 
      record.status === "ready" 
        ? { ...record, status: "filed" as const, filedDate: new Date().toISOString().split('T')[0] }
        : record
    ));
    toast.success(`Filed ${readyForms.length} 1099 forms successfully`);
  };

  const exportForms = () => {
    toast.success("Exporting 1099 forms to PDF...");
  };

  const generateCorrection = (recordId: string) => {
    setForm1099Records(prev => prev.map(record => 
      record.id === recordId 
        ? { ...record, status: "corrected" as const }
        : record
    ));
    toast.success("Correction form generated");
  };

  const getRecordsForYear = (year: number) => {
    return form1099Records.filter(record => record.taxYear === year);
  };

  const getTotalFiledAmount = (year: number) => {
    return getRecordsForYear(year)
      .filter(record => record.status === "filed")
      .reduce((sum, record) => sum + calculateTotalAmount(record.amounts), 0);
  };

  const getVendorsRequiring1099 = () => {
    return vendor1099Setup.filter(setup => !setup.exempt).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">1099 Management</h1>
          <p className="text-muted-foreground">
            Manage contractor tax reporting and compliance
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isVendorSetupDialogOpen} onOpenChange={setIsVendorSetupDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Vendor Setup
              </Button>
            </DialogTrigger>
          </Dialog>
          <Dialog open={isRecordDialogOpen} onOpenChange={setIsRecordDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New 1099
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forms for {selectedYear}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getRecordsForYear(selectedYear).length}</div>
            <p className="text-xs text-muted-foreground">Total 1099 forms</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Filed Forms</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getRecordsForYear(selectedYear).filter(r => r.status === "filed").length}
            </div>
            <p className="text-xs text-muted-foreground">Successfully filed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${getTotalFiledAmount(selectedYear).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Reported payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendors Tracked</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getVendorsRequiring1099()}</div>
            <p className="text-xs text-muted-foreground">Requiring 1099s</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="forms">1099 Forms</TabsTrigger>
          <TabsTrigger value="vendors">Vendor Setup</TabsTrigger>
          <TabsTrigger value="filing">Filing & Export</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Filing Status Summary</CardTitle>
                <CardDescription>Status of 1099 forms for {selectedYear}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["draft", "ready", "filed", "corrected"].map(status => {
                    const count = getRecordsForYear(selectedYear).filter(r => r.status === status).length;
                    return (
                      <div key={status} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(status)}
                          <span className="capitalize">{status} Forms</span>
                        </div>
                        <Badge className={getStatusColor(status)}>{count}</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Compliance Checklist</CardTitle>
                <CardDescription>Key tasks for 1099 compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>W-9 Forms Collected</span>
                    <Badge className={vendor1099Setup.filter(v => v.w9OnFile).length === vendor1099Setup.length ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                      {vendor1099Setup.filter(v => v.w9OnFile).length}/{vendor1099Setup.length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Forms Ready to File</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {form1099Records.filter(r => r.status === "ready").length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Filing Deadline</span>
                    <Badge className="bg-red-100 text-red-800">Jan 31, {selectedYear + 1}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forms">
          <Card>
            <CardHeader>
              <CardTitle>1099 Forms for {selectedYear}</CardTitle>
              <CardDescription>Manage and track 1099 forms</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>TIN</TableHead>
                    <TableHead>Form Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Filing Method</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getRecordsForYear(selectedYear).map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.vendorName}</TableCell>
                      <TableCell>{record.vendorTIN}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{record.formType}</Badge>
                      </TableCell>
                      <TableCell>${calculateTotalAmount(record.amounts).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(record.status)} flex items-center gap-1 w-fit`}>
                          {getStatusIcon(record.status)}
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={record.electronicFiling ? "default" : "secondary"}>
                          {record.electronicFiling ? "Electronic" : "Paper"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" title="Download">
                            <Download className="h-4 w-4" />
                          </Button>
                          {record.status === "filed" && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => generateCorrection(record.id)}
                              title="Generate Correction"
                            >
                              <AlertTriangle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" title="Send Copy">
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors">
          <Card>
            <CardHeader>
              <CardTitle>Vendor 1099 Setup</CardTitle>
              <CardDescription>Configure vendors requiring 1099 reporting</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor Name</TableHead>
                    <TableHead>TIN Type</TableHead>
                    <TableHead>TIN</TableHead>
                    <TableHead>Threshold</TableHead>
                    <TableHead>W-9</TableHead>
                    <TableHead>Exempt</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendor1099Setup.map((setup) => (
                    <TableRow key={setup.id}>
                      <TableCell className="font-medium">{setup.vendorName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{setup.tinType}</Badge>
                      </TableCell>
                      <TableCell>{setup.tin}</TableCell>
                      <TableCell>${setup.threshold1099}</TableCell>
                      <TableCell>
                        <Badge className={setup.w9OnFile ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {setup.w9OnFile ? "On File" : "Missing"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={setup.exempt ? "bg-gray-100 text-gray-800" : "bg-blue-100 text-blue-800"}>
                          {setup.exempt ? "Exempt" : "Required"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="filing">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Filing Actions</CardTitle>
                <CardDescription>File and export 1099 forms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button onClick={handleFileForms} className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    File Ready Forms ({form1099Records.filter(r => r.status === "ready").length})
                  </Button>
                  <Button variant="outline" onClick={exportForms} className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export All Forms
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email to Recipients
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Filing Requirements</CardTitle>
                <CardDescription>Important deadlines and requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-yellow-50">
                    <h3 className="font-semibold text-yellow-800">Important Deadlines</h3>
                    <ul className="mt-2 space-y-1 text-sm text-yellow-700">
                      <li>• January 31: Deadline to furnish 1099s to recipients</li>
                      <li>• February 28: Deadline for paper filing with IRS</li>
                      <li>• March 31: Deadline for electronic filing with IRS</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <h3 className="font-semibold text-blue-800">Filing Requirements</h3>
                    <ul className="mt-2 space-y-1 text-sm text-blue-700">
                      <li>• Payments of $600 or more to non-corporate contractors</li>
                      <li>• Rent payments of $600+ to individuals or partnerships</li>
                      <li>• Any backup withholding regardless of amount</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* New 1099 Record Dialog */}
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create New 1099 Form</DialogTitle>
          <DialogDescription>
            Generate a new 1099 form for contractor payments
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vendor-name">Vendor Name</Label>
              <Input
                id="vendor-name"
                value={newRecord.vendorName || ""}
                onChange={(e) => setNewRecord(prev => ({ ...prev, vendorName: e.target.value }))}
                placeholder="Enter vendor name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vendor-tin">Tax ID Number</Label>
              <Input
                id="vendor-tin"
                value={newRecord.vendorTIN || ""}
                onChange={(e) => setNewRecord(prev => ({ ...prev, vendorTIN: e.target.value }))}
                placeholder="XX-XXXXXXX"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="form-type">Form Type</Label>
              <Select 
                value={newRecord.formType} 
                onValueChange={(value) => setNewRecord(prev => ({ ...prev, formType: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select form type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1099-NEC">1099-NEC - Nonemployee Compensation</SelectItem>
                  <SelectItem value="1099-MISC">1099-MISC - Miscellaneous Information</SelectItem>
                  <SelectItem value="1099-INT">1099-INT - Interest Income</SelectItem>
                  <SelectItem value="1099-DIV">1099-DIV - Dividends</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax-year">Tax Year</Label>
              <Input
                id="tax-year"
                type="number"
                value={newRecord.taxYear || ""}
                onChange={(e) => setNewRecord(prev => ({ ...prev, taxYear: parseInt(e.target.value) }))}
                placeholder="2024"
              />
            </div>
          </div>
          <div className="space-y-4">
            <Label>Payment Amounts</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="box1">Box 1 - Nonemployee Compensation</Label>
                <Input
                  id="box1"
                  type="number"
                  step="0.01"
                  value={newRecord.amounts?.box1 || ""}
                  onChange={(e) => setNewRecord(prev => ({ 
                    ...prev, 
                    amounts: { ...prev.amounts, box1: parseFloat(e.target.value) || 0 }
                  }))}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="box4">Box 4 - Federal Income Tax Withheld</Label>
                <Input
                  id="box4"
                  type="number"
                  step="0.01"
                  value={newRecord.amounts?.box4 || ""}
                  onChange={(e) => setNewRecord(prev => ({ 
                    ...prev, 
                    amounts: { ...prev.amounts, box4: parseFloat(e.target.value) || 0 }
                  }))}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={newRecord.notes || ""}
              onChange={(e) => setNewRecord(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes about this 1099"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="electronic"
              checked={newRecord.electronicFiling}
              onCheckedChange={(checked) => setNewRecord(prev => ({ ...prev, electronicFiling: checked }))}
            />
            <Label htmlFor="electronic">Electronic Filing</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsRecordDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveRecord}>Create 1099 Form</Button>
        </DialogFooter>
      </DialogContent>

      {/* Vendor Setup Dialog */}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Vendor 1099 Setup</DialogTitle>
          <DialogDescription>
            Configure vendor for 1099 reporting requirements
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="setup-vendor-name">Vendor Name</Label>
              <Input
                id="setup-vendor-name"
                value={newVendorSetup.vendorName || ""}
                onChange={(e) => setNewVendorSetup(prev => ({ ...prev, vendorName: e.target.value }))}
                placeholder="Enter vendor name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="setup-tin">Tax ID Number</Label>
              <Input
                id="setup-tin"
                value={newVendorSetup.tin || ""}
                onChange={(e) => setNewVendorSetup(prev => ({ ...prev, tin: e.target.value }))}
                placeholder="XX-XXXXXXX"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tin-type">TIN Type</Label>
              <Select 
                value={newVendorSetup.tinType} 
                onValueChange={(value) => setNewVendorSetup(prev => ({ ...prev, tinType: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select TIN type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EIN">EIN - Employer Identification Number</SelectItem>
                  <SelectItem value="SSN">SSN - Social Security Number</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="threshold">1099 Threshold</Label>
              <Input
                id="threshold"
                type="number"
                value={newVendorSetup.threshold1099 || ""}
                onChange={(e) => setNewVendorSetup(prev => ({ ...prev, threshold1099: parseInt(e.target.value) }))}
                placeholder="600"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="w9-on-file"
                checked={newVendorSetup.w9OnFile}
                onCheckedChange={(checked) => setNewVendorSetup(prev => ({ ...prev, w9OnFile: checked }))}
              />
              <Label htmlFor="w9-on-file">W-9 Form on File</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="backup-withholding"
                checked={newVendorSetup.backupWithholding}
                onCheckedChange={(checked) => setNewVendorSetup(prev => ({ ...prev, backupWithholding: checked }))}
              />
              <Label htmlFor="backup-withholding">Backup Withholding Required</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="exempt"
                checked={newVendorSetup.exempt}
                onCheckedChange={(checked) => setNewVendorSetup(prev => ({ ...prev, exempt: checked }))}
              />
              <Label htmlFor="exempt">Exempt from 1099 Reporting</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsVendorSetupDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveVendorSetup}>Save Vendor Setup</Button>
        </DialogFooter>
      </DialogContent>
    </div>
  );
};