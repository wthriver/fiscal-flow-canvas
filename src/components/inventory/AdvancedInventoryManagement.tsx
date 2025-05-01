
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Barcode, ArrowDown, FileBarChart } from "lucide-react";
import { InventoryStats } from "./dashboard/InventoryStats";
import { InventorySearch } from "./dashboard/InventorySearch";
import { InventoryItemsTab } from "./tabs/InventoryItemsTab";
import { LotTrackingTab } from "./tabs/LotTrackingTab";
import { SerialNumbersTab } from "./tabs/SerialNumbersTab";
import { BundlesTab } from "./tabs/BundlesTab";

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
      
      <InventoryStats />
      <InventorySearch />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
          <TabsTrigger value="inventory-items">Inventory Items</TabsTrigger>
          <TabsTrigger value="lot-tracking">Lot Tracking</TabsTrigger>
          <TabsTrigger value="serial-numbers">Serial Numbers</TabsTrigger>
          <TabsTrigger value="bundles">Bundles & Assemblies</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory-items" className="border rounded-md p-0">
          <InventoryItemsTab />
        </TabsContent>
        
        <TabsContent value="lot-tracking" className="border rounded-md p-4">
          <LotTrackingTab />
        </TabsContent>
        
        <TabsContent value="serial-numbers" className="border rounded-md p-4">
          <SerialNumbersTab />
        </TabsContent>
        
        <TabsContent value="bundles" className="border rounded-md p-4">
          <BundlesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
