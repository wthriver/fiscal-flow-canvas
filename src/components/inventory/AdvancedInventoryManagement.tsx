
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileBarChart, Barcode, ArrowDown, Search, FileCheck } from "lucide-react";

export const AdvancedInventoryManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState("inventory-items");

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
        <h1 className="text-2xl font-bold">Advanced Inventory Management</h1>
        <div className="flex flex-wrap gap-2">
          <Button className="flex items-center gap-2">
            <Barcode className="h-4 w-4" />
            <span>Scan Item</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowDown className="h-4 w-4" />
            <span>Import Items</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <FileBarChart className="h-4 w-4" />
            <span>Reports</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">5</p>
          </CardContent>
        </Card>
        
        <Card className="bg-yellow-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2</p>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1</p>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$7,798.75</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search inventory..." className="pl-8" />
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="all-categories">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-categories">All Categories</SelectItem>
              <SelectItem value="widgets">Widgets</SelectItem>
              <SelectItem value="gadgets">Gadgets</SelectItem>
              <SelectItem value="tools">Tools</SelectItem>
              <SelectItem value="gizmos">Gizmos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
          <TabsTrigger value="inventory-items">Inventory Items</TabsTrigger>
          <TabsTrigger value="lot-tracking">Lot Tracking</TabsTrigger>
          <TabsTrigger value="serial-numbers">Serial Numbers</TabsTrigger>
          <TabsTrigger value="bundles">Bundles & Assemblies</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory-items" className="border rounded-md p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Reorder Point</TableHead>
                <TableHead>Cost Price</TableHead>
                <TableHead>Sell Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-muted/50">
                <TableCell>WID-001</TableCell>
                <TableCell>Widget Pro</TableCell>
                <TableCell>Widgets</TableCell>
                <TableCell>150</TableCell>
                <TableCell>25</TableCell>
                <TableCell>$19.99</TableCell>
                <TableCell>$29.99</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">In Stock</span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">Adjust</Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-muted/50">
                <TableCell>GAD-002</TableCell>
                <TableCell>Premium Gadget</TableCell>
                <TableCell>Gadgets</TableCell>
                <TableCell>75</TableCell>
                <TableCell>15</TableCell>
                <TableCell>$29.99</TableCell>
                <TableCell>$49.99</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">In Stock</span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">Adjust</Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-muted/50">
                <TableCell>TK-003</TableCell>
                <TableCell>Basic Tool Kit</TableCell>
                <TableCell>Tools</TableCell>
                <TableCell>20</TableCell>
                <TableCell>20</TableCell>
                <TableCell>$45.00</TableCell>
                <TableCell>$75.00</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Low Stock</span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">Adjust</Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="lot-tracking" className="border rounded-md p-4">
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Lot Tracking</CardTitle>
                <CardDescription>Track inventory by lot/batch number with expiration dates</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Track inventory items by lot or batch numbers to manage items that expire or need to be recalled.</p>
                <div className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Lot Number</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Expiration Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Premium Gadget</TableCell>
                        <TableCell>LOT-2025-042</TableCell>
                        <TableCell>45</TableCell>
                        <TableCell>Dec 31, 2026</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Premium Gadget</TableCell>
                        <TableCell>LOT-2025-021</TableCell>
                        <TableCell>30</TableCell>
                        <TableCell>Jun 15, 2026</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Add Lot</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="serial-numbers" className="border rounded-md p-4">
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Serial Number Tracking</CardTitle>
                <CardDescription>Track individual inventory items by serial number</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Track individual inventory items by unique serial numbers for warranty and service purposes.</p>
                <div className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Serial Number</TableHead>
                        <TableHead>Purchase Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Advanced Gizmo</TableCell>
                        <TableCell>SN-A0012548</TableCell>
                        <TableCell>Apr 15, 2025</TableCell>
                        <TableCell>ABC Corporation</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Sold</span>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Advanced Gizmo</TableCell>
                        <TableCell>SN-A0012549</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">In Stock</span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Add Serial Number</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="bundles" className="border rounded-md p-4">
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Bundles & Assemblies</CardTitle>
                <CardDescription>Create and manage product bundles and assemblies</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Combine multiple inventory items into bundles or assemblies for selling as a single unit.</p>
                <div className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bundle Name</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Components</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Bundle Price</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Complete Tool Set</TableCell>
                        <TableCell>BDL-001</TableCell>
                        <TableCell>3</TableCell>
                        <TableCell>15</TableCell>
                        <TableCell>$125.00</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Gadget Bundle Pack</TableCell>
                        <TableCell>BDL-002</TableCell>
                        <TableCell>2</TableCell>
                        <TableCell>10</TableCell>
                        <TableCell>$69.99</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Create Bundle</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
