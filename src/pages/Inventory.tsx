
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCompany } from "@/contexts/CompanyContext";
import { AdvancedInventoryManagement } from "@/components/inventory/AdvancedInventoryManagement";

const Inventory = () => {
  const { currentCompany } = useCompany();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("items");

  // Make sure inventory exists and has items
  const inventory = currentCompany.inventory || { 
    items: [], 
    categories: [], 
    locations: [],
    bundles: [],
    serialNumbers: [],
    lotTracking: []
  };

  // Filter items based on search term
  const filteredItems = inventory.items ? inventory.items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // Calculate inventory statistics
  const totalItems = inventory.items ? inventory.items.length : 0;
  const lowStockItems = inventory.items ? inventory.items.filter(item => item.quantity < 10).length : 0;
  const outOfStockItems = inventory.items ? inventory.items.filter(item => item.quantity === 0).length : 0;
  const totalValue = inventory.items ? inventory.items.reduce((sum, item) => {
    const cost = parseFloat(item.cost.replace(/[^0-9.-]+/g, ""));
    return sum + (cost * item.quantity);
  }, 0) : 0;

  return (
    <div className="container mx-auto p-4">
      {activeTab === "advanced" ? (
        <AdvancedInventoryManagement />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <h1 className="text-2xl font-bold">Inventory Management</h1>
            <Button>Add New Item</Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-sm font-medium text-muted-foreground">Total Items</div>
                <div className="text-2xl font-bold">{totalItems}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-sm font-medium text-muted-foreground">Low Stock</div>
                <div className="text-2xl font-bold">{lowStockItems}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-sm font-medium text-muted-foreground">Out of Stock</div>
                <div className="text-2xl font-bold">{outOfStockItems}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-sm font-medium text-muted-foreground">Inventory Value</div>
                <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <Tabs defaultValue="items" className="w-full" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="items">Items</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="locations">Locations</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              
              <div className="mt-4 w-full">
                <div className="flex justify-between items-center mb-4">
                  <Input 
                    placeholder="Search inventory..." 
                    className="max-w-sm" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button variant="outline">Export</Button>
                </div>
                
                <TabsContent value="items">
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredItems.length > 0 ? (
                          filteredItems.map((item) => (
                            <tr key={item.id}>
                              <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{item.sku}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{item.cost}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{item.location}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Button variant="ghost" size="sm">Edit</Button>
                                <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                              No inventory items found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                
                <TabsContent value="categories">
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {inventory.categories && inventory.categories.length > 0 ? (
                          inventory.categories.map((category) => (
                            <tr key={category.id}>
                              <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{category.description}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Button variant="ghost" size="sm">Edit</Button>
                                <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                              No categories found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                
                <TabsContent value="locations">
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {inventory.locations && inventory.locations.length > 0 ? (
                          inventory.locations.map((location) => (
                            <tr key={location.id}>
                              <td className="px-6 py-4 whitespace-nowrap">{location.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{location.address}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Button variant="ghost" size="sm">Edit</Button>
                                <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                              No locations found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
