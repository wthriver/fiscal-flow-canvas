
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { InventoryStats } from "@/components/inventory/dashboard/InventoryStats";
import { InventorySearch } from "@/components/inventory/dashboard/InventorySearch";
import { InventoryValuation } from "@/components/inventory/InventoryValuation";
import { AdvancedInventoryManagement } from "@/components/inventory/AdvancedInventoryManagement";
import { AdvancedInventoryCosting } from "@/components/inventory/AdvancedInventoryCosting";
import { PurchaseOrders } from "@/components/inventory/PurchaseOrders";
import { TabsContent as TabContentType } from "@radix-ui/react-tabs";
import { InventoryItemsTab } from "@/components/inventory/tabs/InventoryItemsTab";
import { BundlesTab } from "@/components/inventory/tabs/BundlesTab";
import { LotTrackingTab } from "@/components/inventory/tabs/LotTrackingTab";
import { SerialNumbersTab } from "@/components/inventory/tabs/SerialNumbersTab";
import { InventoryItemDialog } from "@/components/inventory/InventoryItemDialog";
import { useCompany } from "@/contexts/CompanyContext";
import { safeReplaceForNumber } from "@/components/timetracking/utils/timeTrackingUtils";

const InventoryPage: React.FC = () => {
  const { currentCompany } = useCompany();
  const [activeTab, setActiveTab] = useState("items");
  const [managementTab, setManagementTab] = useState("valuation");
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  
  const totalValue = currentCompany?.inventory?.items?.reduce((total, item) => {
    const cost = typeof item.cost === 'string' 
      ? parseFloat(safeReplaceForNumber(item.cost))
      : item.cost;
    return total + (cost * item.quantity);
  }, 0) || 0;

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Advanced Inventory Management</h1>
          <p className="text-muted-foreground">Complete inventory control with costing, valuation, and tracking</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsItemDialogOpen(true)}>New Item</Button>
        </div>
      </div>
      
      <InventoryStats />
      
      <InventorySearch />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="bundles">Bundles</TabsTrigger>
          <TabsTrigger value="serial">Serial Numbers</TabsTrigger>
          <TabsTrigger value="lot">Lot Tracking</TabsTrigger>
        </TabsList>
        
        <TabsContent value="items">
          <InventoryItemsTab />
        </TabsContent>
        
        <TabsContent value="bundles">
          <BundlesTab />
        </TabsContent>
        
        <TabsContent value="serial">
          <SerialNumbersTab />
        </TabsContent>
        
        <TabsContent value="lot">
          <LotTrackingTab />
        </TabsContent>
      </Tabs>
      
      <Tabs value={managementTab} onValueChange={setManagementTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="valuation">Inventory Valuation</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Management</TabsTrigger>
          <TabsTrigger value="costing">Advanced Costing</TabsTrigger>
          <TabsTrigger value="purchase">Purchase Orders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="valuation">
          <InventoryValuation />
        </TabsContent>
        
        <TabsContent value="advanced">
          <AdvancedInventoryManagement />
        </TabsContent>
        
        <TabsContent value="costing">
          <AdvancedInventoryCosting />
        </TabsContent>
        
        <TabsContent value="purchase">
          <PurchaseOrders />
        </TabsContent>
      </Tabs>

      <InventoryItemDialog 
        isOpen={isItemDialogOpen}
        onClose={() => setIsItemDialogOpen(false)}
      />
    </div>
  );
};

export default InventoryPage;
