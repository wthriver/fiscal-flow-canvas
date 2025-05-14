
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Download, ArrowDown, ArrowUp, Package2 } from "lucide-react";
import { InventoryItemsTab } from "@/components/inventory/tabs/InventoryItemsTab";
import { BundlesTab } from "@/components/inventory/tabs/BundlesTab";
import { LotTrackingTab } from "@/components/inventory/tabs/LotTrackingTab";
import { SerialNumbersTab } from "@/components/inventory/tabs/SerialNumbersTab";
import { InventoryValuation } from "@/components/inventory/InventoryValuation";
import { PurchaseOrders } from "@/components/inventory/PurchaseOrders";
import { useCompany } from "@/contexts/CompanyContext";

const Inventory = () => {
  const [activeTab, setActiveTab] = useState("items");
  const { currentCompany } = useCompany();
  
  // Get inventory stats
  const totalItems = currentCompany.inventory?.items?.length || 0;
  const totalValue = (currentCompany.inventory?.items || []).reduce((acc, item) => {
    const cost = parseFloat(item.cost.replace(/[^0-9.-]+/g, "") || "0");
    return acc + (cost * item.quantity);
  }, 0);
  
  // Count low stock items (those below reorder point)
  const lowStockItems = (currentCompany.inventory?.items || []).filter(item => {
    return item.quantity <= 20; // Using arbitrary value as reorder point
  }).length;
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <div className="flex gap-2 mt-2 sm:mt-0">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Inventory Value</p>
                <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{totalItems}</p>
              </div>
              <div className="bg-purple-100 p-2 rounded-full text-purple-600">
                <Package2 size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
                <p className="text-2xl font-bold">{lowStockItems}</p>
              </div>
              <div className="bg-yellow-100 p-2 rounded-full text-yellow-600">
                <ArrowDown size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Categories</p>
                <p className="text-2xl font-bold">{currentCompany.inventory?.categories?.length || 0}</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full text-green-600">
                <ArrowUp size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-background">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="items">Items</TabsTrigger>
              <TabsTrigger value="purchase-orders">Purchase Orders</TabsTrigger>
              <TabsTrigger value="bundles">Bundles & Kits</TabsTrigger>
              <TabsTrigger value="serial-numbers">Serial Numbers</TabsTrigger>
              <TabsTrigger value="lot-tracking">Lot Tracking</TabsTrigger>
              <TabsTrigger value="valuation">Valuation</TabsTrigger>
            </TabsList>
            
            <div className="relative hidden md:block w-[250px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory..."
                className="pl-8"
              />
            </div>
          </div>
          
          <TabsContent value="items">
            <InventoryItemsTab />
          </TabsContent>
          
          <TabsContent value="purchase-orders">
            <PurchaseOrders />
          </TabsContent>
          
          <TabsContent value="bundles">
            <BundlesTab />
          </TabsContent>
          
          <TabsContent value="serial-numbers">
            <SerialNumbersTab />
          </TabsContent>
          
          <TabsContent value="lot-tracking">
            <LotTrackingTab />
          </TabsContent>
          
          <TabsContent value="valuation">
            <InventoryValuation />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Inventory;
