
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Filter, Download, Search, Package, ArrowUpDown, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Inventory: React.FC = () => {
  // Sample inventory items
  const inventoryItems = [
    { 
      id: "INV-001", 
      name: "Widget Pro", 
      sku: "WDG-PRO-001", 
      quantity: 250, 
      reorderPoint: 50, 
      costPrice: "$15.00", 
      sellPrice: "$29.99",
      category: "Hardware",
      status: "In Stock" 
    },
    { 
      id: "INV-002", 
      name: "Premium Gadget", 
      sku: "PRM-GDG-002", 
      quantity: 125, 
      reorderPoint: 30, 
      costPrice: "$25.00", 
      sellPrice: "$49.99",
      category: "Electronics",
      status: "In Stock" 
    },
    { 
      id: "INV-003", 
      name: "Basic Tool Kit", 
      sku: "BSC-TLK-003", 
      quantity: 15, 
      reorderPoint: 20, 
      costPrice: "$35.00", 
      sellPrice: "$75.00",
      category: "Tools",
      status: "Low Stock" 
    },
    { 
      id: "INV-004", 
      name: "Deluxe Component", 
      sku: "DLX-CMP-004", 
      quantity: 78, 
      reorderPoint: 25, 
      costPrice: "$12.50", 
      sellPrice: "$24.99",
      category: "Hardware",
      status: "In Stock" 
    },
    { 
      id: "INV-005", 
      name: "Premium Service Plan", 
      sku: "PRM-SVC-005", 
      quantity: 0, 
      reorderPoint: 0, 
      costPrice: "$0.00", 
      sellPrice: "$199.99",
      category: "Services",
      status: "Service Item" 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventory</h1>
          <p className="text-muted-foreground">Manage your product inventory and stock levels</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowUpDown size={16} />
            <span>Adjust Stock</span>
          </Button>
          <Button className="flex items-center gap-2">
            <PlusCircle size={16} />
            <span>Add Item</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">325</CardTitle>
            <CardDescription>Total Items</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-amber-500">8</CardTitle>
            <CardDescription>Low Stock Items</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-red-500">3</CardTitle>
            <CardDescription>Out of Stock</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-green-500">$45,875</CardTitle>
            <CardDescription>Inventory Value</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search inventory..."
            className="w-full sm:w-[300px] pl-8"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter size={16} />
            <span>Filter</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download size={16} />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>Manage your products and stock levels</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Cost Price</TableHead>
                <TableHead>Sell Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.costPrice}</TableCell>
                  <TableCell>{item.sellPrice}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === "In Stock" 
                        ? "bg-green-100 text-green-800" 
                        : item.status === "Low Stock" 
                          ? "bg-yellow-100 text-yellow-800" 
                          : item.status === "Out of Stock"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                    }`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Package size={16} />
                      <span className="sr-only">View</span>
                    </Button>
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

export default Inventory;
