
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";
import { Bundle, BundleItem } from "@/types/company";

export const BundlesTab: React.FC = () => {
  const { currentCompany, updateCompany } = useCompany();
  const [isBundleDialogOpen, setIsBundleDialogOpen] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    price: "",
    items: [] as BundleItem[]
  });

  const bundles = currentCompany.inventory?.bundles || [];

  const handleCreateBundle = () => {
    setSelectedBundle(null);
    setFormData({
      name: "",
      sku: "",
      description: "",
      price: "",
      items: []
    });
    setIsBundleDialogOpen(true);
  };

  const handleEditBundle = (bundle: Bundle) => {
    setSelectedBundle(bundle);
    setFormData({
      name: bundle.name,
      sku: bundle.sku || "",
      description: bundle.description || "",
      price: bundle.price?.toString() || bundle.sellingPrice?.toString() || "",
      items: bundle.items
    });
    setIsBundleDialogOpen(true);
  };

  const handleDeleteBundle = (bundleId: string) => {
    if (confirm("Are you sure you want to delete this bundle?")) {
      const updatedBundles = bundles.filter(b => b.id !== bundleId);
      updateCompany({
        ...currentCompany,
        inventory: {
          ...currentCompany.inventory,
          bundles: updatedBundles
        }
      });
      toast.success("Bundle deleted successfully");
    }
  };

  const addBundleItem = () => {
    const newItem: BundleItem = {
      id: `item-${Date.now()}`,
      inventoryItemId: "",
      itemId: "",
      quantity: 1,
      unitCost: 0
    };
    setFormData({
      ...formData,
      items: [...formData.items, newItem]
    });
  };

  const updateBundleItem = (index: number, field: keyof BundleItem, value: any) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setFormData({ ...formData, items: updatedItems });
  };

  const removeBundleItem = (index: number) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  const handleSaveBundle = () => {
    if (!formData.name || !formData.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    const price = parseFloat(formData.price);
    const totalCost = formData.items.reduce((sum, item) => sum + (item.unitCost * item.quantity), 0);

    const bundleData: Bundle = {
      id: selectedBundle?.id || `bundle-${Date.now()}`,
      name: formData.name,
      sku: formData.sku,
      price: price,
      description: formData.description,
      items: formData.items,
      totalCost: totalCost,
      sellingPrice: price,
      status: 'Active'
    };

    const updatedBundles = selectedBundle
      ? bundles.map(b => b.id === selectedBundle.id ? bundleData : b)
      : [...bundles, bundleData];

    updateCompany({
      ...currentCompany,
      inventory: {
        ...currentCompany.inventory,
        bundles: updatedBundles
      }
    });

    toast.success(selectedBundle ? "Bundle updated successfully" : "Bundle added successfully");
    setIsBundleDialogOpen(false);
  };

  const getItemName = (itemId: string) => {
    const item = currentCompany.inventory?.items?.find(i => i.id === itemId);
    return item ? item.name : "Unknown Item";
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Product Bundles</CardTitle>
          <CardDescription>Create and manage product bundles for simplified selling</CardDescription>
        </CardHeader>
        <CardContent>
          {bundles.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bundle Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Items Count</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bundles.map((bundle) => (
                  <TableRow key={bundle.id}>
                    <TableCell className="font-medium">{bundle.name}</TableCell>
                    <TableCell>{bundle.sku || '-'}</TableCell>
                    <TableCell>{bundle.items.length} items</TableCell>
                    <TableCell>${bundle.totalCost.toFixed(2)}</TableCell>
                    <TableCell>${(bundle.price || bundle.sellingPrice).toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        bundle.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {bundle.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditBundle(bundle)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteBundle(bundle.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No bundles created yet</p>
              <Button onClick={handleCreateBundle}>
                <Plus className="h-4 w-4 mr-2" />
                Create Bundle
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreateBundle}>
            <Plus className="h-4 w-4 mr-2" />
            Create Bundle
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isBundleDialogOpen} onOpenChange={setIsBundleDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{selectedBundle ? 'Edit Bundle' : 'Create Bundle'}</DialogTitle>
            <DialogDescription>
              Bundle multiple products together for easier selling
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Bundle Name*</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Winter Package"
                />
              </div>
              <div>
                <label className="text-sm font-medium">SKU</label>
                <Input
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  placeholder="WP-001"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Bundle description"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Selling Price*</label>
              <Input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder="0.00"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">Bundle Items</label>
                <Button type="button" variant="outline" size="sm" onClick={addBundleItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
              
              {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <Select value={item.itemId} onValueChange={(value) => updateBundleItem(index, 'itemId', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>
                      <SelectContent>
                        {currentCompany.inventory?.items?.map((inventoryItem) => (
                          <SelectItem key={inventoryItem.id} value={inventoryItem.id}>
                            {inventoryItem.name} - {inventoryItem.sku}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateBundleItem(index, 'quantity', parseInt(e.target.value))}
                      placeholder="Qty"
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      type="number"
                      step="0.01"
                      value={item.unitCost}
                      onChange={(e) => updateBundleItem(index, 'unitCost', parseFloat(e.target.value))}
                      placeholder="Unit Cost"
                    />
                  </div>
                  <div className="col-span-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => removeBundleItem(index)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBundleDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveBundle}>
              {selectedBundle ? 'Update' : 'Create'} Bundle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
