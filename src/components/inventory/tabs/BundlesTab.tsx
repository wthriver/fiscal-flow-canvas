
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
    price: "",
    description: "",
    items: [] as BundleItem[]
  });
  const [newBundleItem, setNewBundleItem] = useState({
    itemId: "",
    quantity: ""
  });

  const bundles = currentCompany.inventory?.bundles || [];

  const handleCreateBundle = () => {
    setSelectedBundle(null);
    setFormData({
      name: "",
      sku: "",
      price: "",
      description: "",
      items: []
    });
    setIsBundleDialogOpen(true);
  };

  const handleEditBundle = (bundle: Bundle) => {
    setSelectedBundle(bundle);
    setFormData({
      name: bundle.name,
      sku: bundle.sku,
      price: bundle.price.toString(),
      description: bundle.description || "",
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
    if (!newBundleItem.itemId || !newBundleItem.quantity) {
      toast.error("Please select an item and quantity");
      return;
    }

    const bundleItem: BundleItem = {
      itemId: newBundleItem.itemId,
      quantity: parseInt(newBundleItem.quantity)
    };

    setFormData({
      ...formData,
      items: [...formData.items, bundleItem]
    });

    setNewBundleItem({ itemId: "", quantity: "" });
  };

  const removeBundleItem = (index: number) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    setFormData({ ...formData, items: updatedItems });
  };

  const handleSaveBundle = () => {
    if (!formData.name || !formData.sku || !formData.price || formData.items.length === 0) {
      toast.error("Please fill in all required fields and add at least one item");
      return;
    }

    const bundleData: Bundle = {
      id: selectedBundle?.id || `bundle-${Date.now()}`,
      name: formData.name,
      sku: formData.sku,
      price: parseFloat(formData.price),
      description: formData.description,
      items: formData.items
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

    toast.success(selectedBundle ? "Bundle updated successfully" : "Bundle created successfully");
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
          <CardTitle>Bundles & Assemblies</CardTitle>
          <CardDescription>Create and manage product bundles and assemblies</CardDescription>
        </CardHeader>
        <CardContent>
          {bundles.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bundle Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Components</TableHead>
                  <TableHead>Bundle Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bundles.map((bundle) => (
                  <TableRow key={bundle.id}>
                    <TableCell className="font-medium">{bundle.name}</TableCell>
                    <TableCell>{bundle.sku}</TableCell>
                    <TableCell>{bundle.items.length} items</TableCell>
                    <TableCell>${bundle.price.toFixed(2)}</TableCell>
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
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedBundle ? 'Edit Bundle' : 'Create New Bundle'}</DialogTitle>
            <DialogDescription>
              Bundle multiple items together to sell as a single unit
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Bundle Name*</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Complete Tool Set"
                />
              </div>
              <div>
                <label className="text-sm font-medium">SKU*</label>
                <Input
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  placeholder="BDL-001"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Bundle Price*</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="125.00"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Bundle description"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Bundle Items</label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <Select value={newBundleItem.itemId} onValueChange={(value) => setNewBundleItem({...newBundleItem, itemId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select item" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentCompany.inventory?.items?.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} - {item.sku}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={newBundleItem.quantity}
                  onChange={(e) => setNewBundleItem({...newBundleItem, quantity: e.target.value})}
                />
                <Button onClick={addBundleItem}>Add</Button>
              </div>
              
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {formData.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <span>{getItemName(item.itemId)} (Qty: {item.quantity})</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeBundleItem(index)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBundleDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveBundle}>
              {selectedBundle ? 'Update Bundle' : 'Create Bundle'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
