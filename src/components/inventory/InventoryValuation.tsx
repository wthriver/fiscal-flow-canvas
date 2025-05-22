
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Download, ArrowUp, ArrowDown, Plus, FileBarChart, Truck, Package2 } from "lucide-react";
import { toast } from "sonner";
import { useCompany } from "@/contexts/CompanyContext";
import { safeReplaceForNumber } from "../timetracking/utils/timeTrackingUtils";

// We need to add a utility function to safely format numbers as strings
const formatNumberToString = (value: number | string): string => {
  if (typeof value === 'string') {
    return value;
  }
  return value.toString();
};

export const InventoryValuation: React.FC = () => {
  const { currentCompany } = useCompany();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [valuationMethod, setValuationMethod] = useState("fifo");
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  
  // Get inventory items
  const inventoryItems = currentCompany.inventory?.items || [];
  
  // Filter inventory items based on search and filters
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesLocation = locationFilter === "all" || item.location === locationFilter;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });
  
  // Get unique categories and locations for filters
  const categories = Array.from(new Set(inventoryItems.map(item => item.category)));
  const locations = Array.from(new Set(inventoryItems.map(item => item.location)));
  
  // Calculate total inventory value
  const totalInventoryValue = filteredItems.reduce((total, item) => {
    const costStr = typeof item.cost === 'string' ? item.cost : item.cost.toString();
    const cost = parseFloat(safeReplaceForNumber(costStr)) || 0;
    return total + (cost * item.quantity);
  }, 0);
  
  const handleExportInventory = () => {
    toast.success("Exporting inventory report", {
      description: "Your inventory valuation report will be downloaded shortly"
    });
  };
  
  const handleGenerateReport = () => {
    toast.success("Inventory report generated", {
      description: "Inventory valuation report has been prepared"
    });
    setIsReportDialogOpen(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Inventory Valuation</h2>
          <p className="text-muted-foreground">Track and manage your inventory value</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportInventory}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsReportDialogOpen(true)}>
            <FileBarChart className="mr-2 h-4 w-4" />
            Valuation Report
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Inventory Value</p>
                <p className="text-2xl font-bold">${totalInventoryValue.toFixed(2)}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                <Package2 size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Items In Stock</p>
                <p className="text-2xl font-bold">{filteredItems.length}</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full text-green-600">
                <ArrowUp size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <div className="bg-yellow-100 p-2 rounded-full text-yellow-600">
                <ArrowDown size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>Current inventory valuation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category, index) => (
                  <SelectItem key={index} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location, index) => (
                  <SelectItem key={index} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={valuationMethod} onValueChange={setValuationMethod}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Valuation Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fifo">FIFO</SelectItem>
                <SelectItem value="lifo">LIFO</SelectItem>
                <SelectItem value="average">Average Cost</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Cost</TableHead>
                  <TableHead className="text-right">Total Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => {
                    const costStr = typeof item.cost === 'string' ? item.cost : item.cost.toString();
                    const cost = parseFloat(safeReplaceForNumber(costStr)) || 0;
                    const totalValue = cost * item.quantity;
                    
                    return (
                      <TableRow key={item.id}>
                        <TableCell>{item.sku}</TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{item.cost}</TableCell>
                        <TableCell className="text-right">${totalValue.toFixed(2)}</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No inventory items found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredItems.length} of {inventoryItems.length} items
          </div>
          <div className="text-sm font-medium">
            Total Valuation: ${totalInventoryValue.toFixed(2)}
          </div>
        </CardFooter>
      </Card>
      
      {/* Inventory Valuation Report Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generate Inventory Valuation Report</DialogTitle>
            <DialogDescription>
              Customize your inventory valuation report
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="report-date">Report Date</label>
              <Input id="report-date" type="date" defaultValue="2025-05-14" />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="valuation-method">Valuation Method</label>
              <Select defaultValue="fifo">
                <SelectTrigger id="valuation-method">
                  <SelectValue placeholder="Choose valuation method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fifo">FIFO (First In, First Out)</SelectItem>
                  <SelectItem value="lifo">LIFO (Last In, First Out)</SelectItem>
                  <SelectItem value="average">Average Cost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="location-filter">Location</label>
              <Select defaultValue="all">
                <SelectTrigger id="location-filter">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((location, index) => (
                    <SelectItem key={index} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="category-filter">Category</label>
              <Select defaultValue="all">
                <SelectTrigger id="category-filter">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category, index) => (
                    <SelectItem key={index} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label>Include in Report</label>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="include-zero" className="rounded border-gray-300" defaultChecked />
                <label htmlFor="include-zero" className="text-sm">Include items with zero quantity</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="include-movements" className="rounded border-gray-300" defaultChecked />
                <label htmlFor="include-movements" className="text-sm">Include stock movements</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="include-costs" className="rounded border-gray-300" defaultChecked />
                <label htmlFor="include-costs" className="text-sm">Include cost breakdown</label>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="report-format">Report Format</label>
              <Select defaultValue="pdf">
                <SelectTrigger id="report-format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateReport}>
              Generate Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
