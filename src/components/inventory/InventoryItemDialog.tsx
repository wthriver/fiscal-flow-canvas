import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";
import { InventoryItem } from "@/types/company";
import { AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";

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
    name: "",
    sku: "",
    barcode: "",
    quantity: "0",
    price: "",
    cost: "",
    category: "",
    location: "",
    supplier: "",
    reorderLevel: "",
    maxLevel: "",
    description: "",
    unit: "pcs",
    weight: "",
    dimensions: "",
    taxable: true,
    trackSerial: false,
    trackLots: false,
    images: [] as string[],
    customFields: {} as Record<string, string>
  });

  const [stockMovements, setStockMovements] = useState<Array<{
    id: string;
    type: 'in' | 'out' | 'adjustment';
    quantity: number;
    date: string;
    reason: string;
    reference: string;
  }>>([]);

  const [newMovement, setNewMovement] = useState({
    type: 'in' as 'in' | 'out' | 'adjustment',
    quantity: "",
    reason: "",
    reference: ""
  });

  useEffect(() => {
    if (item && isOpen) {
      setFormData({
        name: item.name || "",
        sku: item.sku || "",
        barcode: item.barcode || "",
        quantity: item.quantity?.toString() || "0",
        price: typeof item.price === 'string' ? item.price.replace(/[^0-9.-]+/g, "") : item.price?.toString() || "",
        cost: typeof item.cost === 'string' ? item.cost.replace(/[^0-9.-]+/g, "") : item.cost?.toString() || "",
        category: item.category || "",
        location: item.location || "",
        supplier: item.supplier || "",
        reorderLevel: item.reorderLevel?.toString() || "",
        maxLevel: (item.maxLevel || item.maxStock)?.toString() || "",
        description: item.description || "",
        unit: item.unit || "pcs",
        weight: item.weight?.toString() || "",
        dimensions: item.dimensions || "",
        taxable: item.taxable !== undefined ? item.taxable : true,
        trackSerial: item.trackSerial || false,
        trackLots: item.trackLots || false,
        images: item.images || [],
        customFields: item.customFields || {}
      });
      setStockMovements(item.stockMovements || []);
    } else if (!item && isOpen) {
      setFormData({
        name: "",
        sku: "",
        barcode: "",
        quantity: "0",
        price: "",
        cost: "",
        category: "",
        location: "",
        supplier: "",
        reorderLevel: "",
        maxLevel: "",
        description: "",
        unit: "pcs",
        weight: "",
        dimensions: "",
        taxable: true,
        trackSerial: false,
        trackLots: false,
        images: [],
        customFields: {}
      });
      setStockMovements([]);
    }
  }, [item, isOpen]);

  const addStockMovement = () => {
    if (!newMovement.quantity || !newMovement.reason) {
      toast.error("Please fill in movement details");
      return;
    }

    const movement = {
      id: `movement-${Date.now()}`,
      type: newMovement.type,
      quantity: parseInt(newMovement.quantity),
      date: new Date().toISOString().split('T')[0],
      reason: newMovement.reason,
      reference: newMovement.reference
    };

    setStockMovements(prev => [...prev, movement]);

    // Update current quantity based on movement
    const currentQty = parseInt(formData.quantity);
    let newQty = currentQty;
    
    if (movement.type === 'in') {
      newQty += movement.quantity;
    } else if (movement.type === 'out') {
      newQty -= movement.quantity;
    } else {
      newQty = movement.quantity; // adjustment sets absolute quantity
    }

    setFormData(prev => ({
      ...prev,
      quantity: Math.max(0, newQty).toString()
    }));

    setNewMovement({
      type: 'in',
      quantity: "",
      reason: "",
      reference: ""
    });

    toast.success("Stock movement added");
  };

  const calculateMargin = () => {
    const cost = parseFloat(formData.cost) || 0;
    const price = parseFloat(formData.price) || 0;
    if (cost === 0) return 0;
    return ((price - cost) / cost * 100).toFixed(1);
  };

  const calculateTotalValue = () => {
    const quantity = parseInt(formData.quantity) || 0;
    const cost = parseFloat(formData.cost) || 0;
    return (quantity * cost).toFixed(2);
  };

  const getStockStatus = () => {
    const quantity = parseInt(formData.quantity) || 0;
    const reorderLevel = parseInt(formData.reorderLevel) || 0;
    const maxLevel = parseInt(formData.maxLevel) || 0;

    if (quantity === 0) return { status: 'Out of Stock', color: 'destructive' };
    if (quantity <= reorderLevel) return { status: 'Low Stock', color: 'warning' };
    if (maxLevel > 0 && quantity >= maxLevel) return { status: 'Overstock', color: 'secondary' };
    return { status: 'In Stock', color: 'success' };
  };

  const handleSave = () => {
    if (!formData.name || !formData.sku) {
      toast.error("Please fill in all required fields");
      return;
    }

    const itemData: InventoryItem = {
      id: item?.id || `inv-${Date.now()}`,
      name: formData.name,
      sku: formData.sku,
      barcode: formData.barcode,
      quantity: parseInt(formData.quantity) || 0,
      price: parseFloat(formData.price) || 0,
      cost: parseFloat(formData.cost) || 0,
      category: formData.category,
      location: formData.location,
      supplier: formData.supplier,
      reorderLevel: parseInt(formData.reorderLevel) || 0,
      maxLevel: parseInt(formData.maxLevel) || 0,
      description: formData.description,
      unit: formData.unit,
      weight: parseFloat(formData.weight) || 0,
      dimensions: formData.dimensions,
      taxable: formData.taxable,
      trackSerial: formData.trackSerial,
      trackLots: formData.trackLots,
      images: formData.images,
      customFields: formData.customFields,
      stockMovements: stockMovements,
      lastUpdated: new Date().toISOString(),
      status: getStockStatus().status
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

  const stockStatus = getStockStatus();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Inventory Item' : 'Add New Inventory Item'}</DialogTitle>
          <DialogDescription>
            {item ? 'Update inventory item details and manage stock' : 'Add a new item to your inventory with comprehensive tracking'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Basic Info */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Name*</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Item name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">SKU*</label>
              <Input
                value={formData.sku}
                onChange={(e) => setFormData({...formData, sku: e.target.value})}
                placeholder="Stock keeping unit"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Barcode</label>
              <Input
                value={formData.barcode}
                onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                placeholder="Barcode"
              />
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Stock Status:</span>
              <Badge variant={stockStatus.color as any}>{stockStatus.status}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Current Stock:</span>
              <span className="text-lg font-bold">{formData.quantity} {formData.unit}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Total Value:</span>
              <span className="text-lg font-bold">${calculateTotalValue()}</span>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Quantity</label>
              <Input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Unit</label>
              <Select value={formData.unit} onValueChange={(value) => setFormData({...formData, unit: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pcs">Pieces</SelectItem>
                  <SelectItem value="kg">Kilograms</SelectItem>
                  <SelectItem value="lbs">Pounds</SelectItem>
                  <SelectItem value="liters">Liters</SelectItem>
                  <SelectItem value="meters">Meters</SelectItem>
                  <SelectItem value="box">Box</SelectItem>
                  <SelectItem value="pack">Pack</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Cost</label>
              <Input
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData({...formData, cost: e.target.value})}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Price</label>
              <Input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Margin Calculation */}
          {formData.cost && formData.price && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {parseFloat(calculateMargin()) > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className="font-medium">Profit Margin:</span>
                  <span className="text-lg font-bold">{calculateMargin()}%</span>
                </div>
                <div>
                  <span className="font-medium">Profit per unit:</span>
                  <span className="text-lg font-bold ml-2">
                    ${(parseFloat(formData.price) - parseFloat(formData.cost)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Details */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Category</label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                placeholder="Item category"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Storage location"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Supplier</label>
              <Input
                value={formData.supplier}
                onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                placeholder="Supplier name"
              />
            </div>
          </div>

          {/* Stock Levels */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Reorder Level</label>
              <Input
                type="number"
                value={formData.reorderLevel}
                onChange={(e) => setFormData({...formData, reorderLevel: e.target.value})}
                placeholder="Minimum stock level"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Maximum Level</label>
              <Input
                type="number"
                value={formData.maxLevel}
                onChange={(e) => setFormData({...formData, maxLevel: e.target.value})}
                placeholder="Maximum stock level"
              />
            </div>
          </div>

          {/* Tracking Options */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="taxable"
                checked={formData.taxable}
                onChange={(e) => setFormData({...formData, taxable: e.target.checked})}
              />
              <label htmlFor="taxable" className="text-sm font-medium">Taxable</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="trackSerial"
                checked={formData.trackSerial}
                onChange={(e) => setFormData({...formData, trackSerial: e.target.checked})}
              />
              <label htmlFor="trackSerial" className="text-sm font-medium">Track Serial Numbers</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="trackLots"
                checked={formData.trackLots}
                onChange={(e) => setFormData({...formData, trackLots: e.target.checked})}
              />
              <label htmlFor="trackLots" className="text-sm font-medium">Track Lots/Batches</label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Item description"
              rows={3}
            />
          </div>

          {/* Stock Movements */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Stock Movements</h3>
            <div className="grid grid-cols-5 gap-2 mb-4">
              <Select value={newMovement.type} onValueChange={(value: 'in' | 'out' | 'adjustment') => setNewMovement({...newMovement, type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">Stock In</SelectItem>
                  <SelectItem value="out">Stock Out</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Quantity"
                value={newMovement.quantity}
                onChange={(e) => setNewMovement({...newMovement, quantity: e.target.value})}
              />
              <Input
                placeholder="Reason"
                value={newMovement.reason}
                onChange={(e) => setNewMovement({...newMovement, reason: e.target.value})}
              />
              <Input
                placeholder="Reference"
                value={newMovement.reference}
                onChange={(e) => setNewMovement({...newMovement, reference: e.target.value})}
              />
              <Button onClick={addStockMovement}>Add</Button>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {stockMovements.map((movement) => (
                <div key={movement.id} className="flex items-center justify-between p-2 border rounded text-sm">
                  <div className="flex items-center gap-4">
                    <Badge variant={movement.type === 'in' ? 'default' : movement.type === 'out' ? 'destructive' : 'secondary'}>
                      {movement.type}
                    </Badge>
                    <span className="font-medium">{movement.quantity} {formData.unit}</span>
                    <span>{movement.reason}</span>
                    {movement.reference && <span className="text-muted-foreground">({movement.reference})</span>}
                  </div>
                  <span className="text-muted-foreground">{movement.date}</span>
                </div>
              ))}
            </div>
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
