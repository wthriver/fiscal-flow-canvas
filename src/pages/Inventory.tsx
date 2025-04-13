
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, ArrowUpDown, Search, Package, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FilterButton, ExportButton } from "@/components/common/ActionButtons";
import { toast } from "sonner";
import { handleCreateItem } from "@/utils/navigationUtils";
import { useCompany } from "@/contexts/CompanyContext";

const Inventory: React.FC = () => {
  const { currentCompany } = useCompany();
  const [searchText, setSearchText] = useState("");

  // Filter inventory items based on search text
  const filteredItems = currentCompany.inventory.filter(item => 
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchText.toLowerCase()) ||
    item.category.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAdjustStock = () => {
    // Display a stock adjustment modal
    const adjustModal = document.createElement('div');
    adjustModal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    adjustModal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-bold mb-4">Adjust Stock</h3>
        <div class="space-y-4 mb-4">
          <div>
            <label class="block text-sm font-medium mb-1">Item</label>
            <select class="w-full p-2 border rounded-md">
              <option value="">Select an item</option>
              ${currentCompany.inventory.map(item => `<option value="${item.id}">${item.name}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Adjustment Type</label>
            <select class="w-full p-2 border rounded-md">
              <option value="add">Add Stock</option>
              <option value="remove">Remove Stock</option>
              <option value="set">Set Quantity</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Quantity</label>
            <input type="number" class="w-full p-2 border rounded-md" min="1" value="1" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Reason</label>
            <select class="w-full p-2 border rounded-md">
              <option value="purchase">Purchase</option>
              <option value="sale">Sale</option>
              <option value="return">Return</option>
              <option value="damage">Damage</option>
              <option value="correction">Inventory Correction</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Notes</label>
            <textarea class="w-full p-2 border rounded-md" placeholder="Optional notes"></textarea>
          </div>
        </div>
        <div class="flex justify-end space-x-2">
          <button class="px-4 py-2 bg-gray-200 rounded-md" id="cancel-adjust">Cancel</button>
          <button class="px-4 py-2 bg-primary text-white rounded-md" id="save-adjust">Save Adjustment</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(adjustModal);
    
    document.getElementById('cancel-adjust')?.addEventListener('click', () => {
      document.body.removeChild(adjustModal);
    });
    
    document.getElementById('save-adjust')?.addEventListener('click', () => {
      toast.success(`Stock adjustment saved for ${currentCompany.name}`);
      document.body.removeChild(adjustModal);
    });
  };

  const handleViewItem = (id: string) => {
    // Find the item
    const item = currentCompany.inventory.find(item => item.id === id);
    
    if (!item) return;
    
    // Create a modal to view the item details
    const viewModal = document.createElement('div');
    viewModal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    viewModal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <h3 class="text-xl font-bold mb-4">${item.name}</h3>
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p class="text-sm text-gray-500">SKU</p>
            <p class="font-medium">${item.sku}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Category</p>
            <p class="font-medium">${item.category}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Quantity</p>
            <p class="font-medium">${item.quantity}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Status</p>
            <p class="font-medium">${item.status}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Cost Price</p>
            <p class="font-medium">${item.costPrice}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Sell Price</p>
            <p class="font-medium">${item.sellPrice}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Reorder Point</p>
            <p class="font-medium">${item.reorderPoint}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Item Value</p>
            <p class="font-medium">$${(parseFloat(item.costPrice.replace('$', '')) * item.quantity).toFixed(2)}</p>
          </div>
        </div>
        <div class="border-t pt-4">
          <h4 class="font-semibold mb-2">Recent Activity</h4>
          <div class="space-y-2">
            <div class="text-sm">
              <span class="text-gray-500">2025-04-10:</span> Stock adjusted +50 (Purchase)
            </div>
            <div class="text-sm">
              <span class="text-gray-500">2025-04-05:</span> Stock adjusted -25 (Sale)
            </div>
            <div class="text-sm">
              <span class="text-gray-500">2025-04-01:</span> Price updated from $${(parseFloat(item.sellPrice.replace('$', '')) - 5).toFixed(2)} to ${item.sellPrice}
            </div>
          </div>
        </div>
        <div class="flex justify-end space-x-2 mt-6">
          <button class="px-4 py-2 border bg-white hover:bg-gray-50 rounded-md flex items-center gap-2" id="adjust-item">
            <ArrowUpDown size={16} />
            <span>Adjust Stock</span>
          </button>
          <button class="px-4 py-2 border bg-white hover:bg-gray-50 rounded-md flex items-center gap-2" id="edit-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
              <path d="m15 5 4 4"></path>
            </svg>
            <span>Edit Item</span>
          </button>
          <button class="px-4 py-2 bg-primary text-white rounded-md" id="close-view">Close</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(viewModal);
    
    document.getElementById('close-view')?.addEventListener('click', () => {
      document.body.removeChild(viewModal);
    });
    
    document.getElementById('adjust-item')?.addEventListener('click', () => {
      document.body.removeChild(viewModal);
      handleAdjustStock();
    });
    
    document.getElementById('edit-item')?.addEventListener('click', () => {
      document.body.removeChild(viewModal);
      // Show edit modal with item data pre-filled
      handleEditItem(id);
    });
  };

  const handleEditItem = (id: string) => {
    // Find the item
    const item = currentCompany.inventory.find(item => item.id === id);
    
    if (!item) return;
    
    // Create a modal to edit the item
    const editModal = document.createElement('div');
    editModal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    editModal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-bold mb-4">Edit Item</h3>
        <div class="space-y-4 mb-4">
          <div>
            <label class="block text-sm font-medium mb-1">Item Name</label>
            <input type="text" class="w-full p-2 border rounded-md" value="${item.name}" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">SKU</label>
            <input type="text" class="w-full p-2 border rounded-md" value="${item.sku}" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Category</label>
            <select class="w-full p-2 border rounded-md">
              <option value="Hardware" ${item.category === 'Hardware' ? 'selected' : ''}>Hardware</option>
              <option value="Electronics" ${item.category === 'Electronics' ? 'selected' : ''}>Electronics</option>
              <option value="Tools" ${item.category === 'Tools' ? 'selected' : ''}>Tools</option>
              <option value="Services" ${item.category === 'Services' ? 'selected' : ''}>Services</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Cost Price</label>
              <input type="text" class="w-full p-2 border rounded-md" value="${item.costPrice}" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Sell Price</label>
              <input type="text" class="w-full p-2 border rounded-md" value="${item.sellPrice}" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Reorder Point</label>
              <input type="number" class="w-full p-2 border rounded-md" value="${item.reorderPoint}" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Status</label>
              <select class="w-full p-2 border rounded-md">
                <option value="In Stock" ${item.status === 'In Stock' ? 'selected' : ''}>In Stock</option>
                <option value="Low Stock" ${item.status === 'Low Stock' ? 'selected' : ''}>Low Stock</option>
                <option value="Out of Stock" ${item.status === 'Out of Stock' ? 'selected' : ''}>Out of Stock</option>
                <option value="Service Item" ${item.status === 'Service Item' ? 'selected' : ''}>Service Item</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Description</label>
            <textarea class="w-full p-2 border rounded-md" rows="3">Product description goes here.</textarea>
          </div>
        </div>
        <div class="flex justify-end space-x-2">
          <button class="px-4 py-2 bg-gray-200 rounded-md" id="cancel-edit">Cancel</button>
          <button class="px-4 py-2 bg-primary text-white rounded-md" id="save-edit">Save Changes</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(editModal);
    
    document.getElementById('cancel-edit')?.addEventListener('click', () => {
      document.body.removeChild(editModal);
    });
    
    document.getElementById('save-edit')?.addEventListener('click', () => {
      toast.success(`Item ${item.name} updated successfully for ${currentCompany.name}`);
      document.body.removeChild(editModal);
    });
  };

  // Calculate inventory stats for current company
  const totalItems = currentCompany.inventory.length;
  const lowStockItems = currentCompany.inventory.filter(item => item.status === "Low Stock").length;
  const outOfStockItems = currentCompany.inventory.filter(item => item.status === "Out of Stock").length;
  const inventoryValue = currentCompany.inventory.reduce((sum, item) => {
    return sum + (parseFloat(item.costPrice.replace(/[^0-9.]/g, '')) * item.quantity);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventory</h1>
          <p className="text-muted-foreground">Manage {currentCompany.name}'s product inventory and stock levels</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleAdjustStock}
          >
            <ArrowUpDown size={16} />
            <span>Adjust Stock</span>
          </Button>
          <Button 
            className="flex items-center gap-2"
            onClick={() => handleCreateItem("Inventory Item")}
          >
            <PlusCircle size={16} />
            <span>Add Item</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{totalItems}</CardTitle>
            <CardDescription>Total Items</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-amber-500">{lowStockItems}</CardTitle>
            <CardDescription>Low Stock Items</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-red-500">{outOfStockItems}</CardTitle>
            <CardDescription>Out of Stock</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-green-500">${inventoryValue.toLocaleString()}</CardTitle>
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
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <FilterButton type="Inventory" />
          <ExportButton type="Inventory" />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>Manage {currentCompany.name}'s products and stock levels</CardDescription>
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
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
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
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewItem(item.id)}
                      >
                        <Package size={16} />
                        <span className="sr-only">View</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                    {searchText ? "No items found matching your search" : "No inventory items found for this company."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;
