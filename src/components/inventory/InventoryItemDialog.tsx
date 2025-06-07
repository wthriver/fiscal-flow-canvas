
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";
import { InventoryItem } from "@/types/company";

interface InventoryItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item?: InventoryItem | null;
}

export const InventoryItemDialog: React.FC<InventoryItemDialogProps> = ({ 
  isOpen, 
  onClose, 
  item 
}) => {
  const { currentCompany, updateCompany } = useCompany();
  const [formData, setFormData] = useState({
    name: item?.name || "",
    sku: item?.sku || "",
    quantity: item?.quantity?.toString() || "0",
    price: typeof item?.price === 'string' ? item.price.replace(/[^0-9.-]+/g, "") : item?.price?.toString() || "",
    cost: typeof item?.cost === 'string' ? item.cost.replace(/[^0-9.-]+/g, "") : item?.cost?.toString() || "",
    category: item?.category || "",
    location: item?.location || "",
    supplier: item?.supplier || "",
    reorderLevel: item?.reorderLevel?.toString() || "",
    description: item?.description || ""
  });

  const handleSave = () => {
    if (!formData.name || !formData.sku) {
      toast.error("Please fill in all required fields");
      return;
    }

    const itemData: InventoryItem = {
      id: item?.id || `inv-${Date.now()}`,
      name: formData.name,
      sku: formData.sku,
      quantity: parseInt(formData.quantity) || 0,
      price: parseFloat(formData.price) || 0,
      cost: parseFloat(formData.cost) || 0,
      category: formData.category,
      location: formData.location,
      supplier: formData.supplier,
      reorderLevel: parseInt(formData.reorderLevel) || 0,
      description: formData.description
    };

    const updatedInventory = item 
      ? { 
          ...currentCompany.inventory, 
          items: currentCompany.inventory?.items?.map(i => i.id === item.id ? itemData : i) || []
        }
      : { 
          ...currentCompany.inventory, 
          items: [...(currentCompany.inventory?.items || []), itemData]
        };

    updateCompany({
      ...currentCompany,
      inventory: updatedInventory
    });

    toast.success(item ? "Item updated successfully!" : "Item added successfully!");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Inventory Item' : 'Add New Inventory Item'}</DialogTitle>
          <DialogDescription>
            {item ? 'Update inventory item details' : 'Add a new item to your inventory'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">Name*</label>
            <Input
              className="col-span-3"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Item name"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">SKU*</label>
            <Input
              className="col-span-3"
              value={formData.sku}
              onChange={(e) => setFormData({...formData, sku: e.target.value})}
              placeholder="Stock keeping unit"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">Quantity</label>
            <Input
              type="number"
              className="col-span-3"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              placeholder="0"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">Price</label>
            <Input
              type="number"
              step="0.01"
              className="col-span-3"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              placeholder="0.00"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">Cost</label>
            <Input
              type="number"
              step="0.01"
              className="col-span-3"
              value={formData.cost}
              onChange={(e) => setFormData({...formData, cost: e.target.value})}
              placeholder="0.00"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">Category</label>
            <Input
              className="col-span-3"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              placeholder="Item category"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>
            {item ? 'Update Item' : 'Add Item'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
