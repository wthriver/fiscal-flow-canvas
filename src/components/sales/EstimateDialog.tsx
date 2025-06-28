import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";
import { Estimate } from "@/types/company";

interface EstimateItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: string;
  amount: string;
}

export interface EstimateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (estimateData: Estimate) => void;
  estimate?: Estimate | null;
}

export const EstimateDialog: React.FC<EstimateDialogProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  estimate 
}) => {
  const { currentCompany, addEstimate } = useCompany();
  const [estimateData, setEstimateData] = useState({
    id: estimate?.id || `est-${Date.now()}`,
    customerId: estimate?.customer || "",
    date: estimate?.date || new Date().toISOString().split('T')[0],
    expiryDate: estimate?.expiryDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: estimate?.items.map(item => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      unitPrice: `$${item.price.toFixed(2)}`,
      amount: `$${item.amount.toFixed(2)}`
    })) || [
      {
        id: `item-${Date.now()}`,
        description: "",
        quantity: 1,
        unitPrice: "$0.00",
        amount: "$0.00"
      }
    ],
    notes: "",
    termsAndConditions: "Standard terms and conditions apply.",
    amount: estimate ? `$${estimate.total.toFixed(2)}` : "$0.00",
    status: estimate?.status || "Draft",
    estimateNumber: estimate?.estimateNumber || ""
  });

  const handleAddItem = () => {
    setEstimateData({
      ...estimateData,
      items: [
        ...estimateData.items,
        {
          id: `item-${Date.now()}`,
          description: "",
          quantity: 1,
          unitPrice: "$0.00",
          amount: "$0.00"
        }
      ]
    });
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...estimateData.items];
    updatedItems.splice(index, 1);
    
    // Recalculate total
    const newTotal = updatedItems.reduce((total, item) => {
      const itemTotal = parseFloat(item.amount.replace(/[^0-9.-]+/g, "") || "0");
      return total + itemTotal;
    }, 0);
    
    setEstimateData({
      ...estimateData,
      items: updatedItems,
      amount: `$${newTotal.toFixed(2)}`
    });
  };

  const handleItemChange = (index: number, field: keyof EstimateItem, value: string | number) => {
    const updatedItems = [...estimateData.items];
    
    if (field === "unitPrice" || field === "quantity") {
      const price = field === "unitPrice" 
        ? parseFloat(value.toString().replace(/[^0-9.-]+/g, "") || "0") 
        : parseFloat(updatedItems[index].unitPrice.replace(/[^0-9.-]+/g, "") || "0");
      
      const quantity = field === "quantity" 
        ? Number(value) 
        : updatedItems[index].quantity;
      
      const itemTotal = price * quantity;
      
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: field === "unitPrice" ? `$${price.toFixed(2)}` : value,
        amount: `$${itemTotal.toFixed(2)}`
      };
      
      // Update estimate total
      const newTotal = updatedItems.reduce((total, item) => {
        const subTotal = parseFloat(item.amount.replace(/[^0-9.-]+/g, "") || "0");
        return total + subTotal;
      }, 0);
      
      setEstimateData({
        ...estimateData,
        items: updatedItems,
        amount: `$${newTotal.toFixed(2)}`
      });
    } else {
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value
      };
      
      setEstimateData({
        ...estimateData,
        items: updatedItems
      });
    }
  };

  const handleSave = () => {
    if (!estimateData.customerId) {
      toast.error("Please select a customer");
      return;
    }
    
    if (estimateData.items.some(item => !item.description)) {
      toast.error("Please fill in all item descriptions");
      return;
    }
    
    const calculateTotal = (items: EstimateItem[]): number => {
      return items.reduce((total, item) => {
        const itemTotal = parseFloat(item.amount.replace(/[^0-9.-]+/g, "") || "0");
        return total + itemTotal;
      }, 0);
    };
    
    // Convert our estimate items format to EstimateItem format required by Estimate interface
    const estimateItems = estimateData.items.map(item => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      price: parseFloat(item.unitPrice.replace(/[^0-9.-]+/g, "")),
      amount: parseFloat(item.amount.replace(/[^0-9.-]+/g, ""))
    }));
    
    const newEstimate: Estimate = {
      id: estimate?.id || `est-${Date.now()}`,
      customer: estimateData.customerId,
      date: estimateData.date,
      expiryDate: estimateData.expiryDate,
      total: calculateTotal(estimateData.items),
      status: estimateData.status,
      items: estimateItems,
      estimateNumber: estimate?.estimateNumber || `EST-${Date.now().toString().slice(-6)}`,
    };
    
    if (onSave) {
      onSave(newEstimate);
    } else {
      addEstimate(newEstimate);
      toast.success("Estimate created successfully!");
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Estimate</DialogTitle>
          <DialogDescription>
            Create an estimate for a potential sale.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="customer" className="text-right">
              Customer*
            </label>
            <select
              id="customer"
              className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              value={estimateData.customerId}
              onChange={(e) => setEstimateData({...estimateData, customerId: e.target.value})}
            >
              <option value="">Select Customer</option>
              {currentCompany.customers?.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="date" className="text-right">
              Date*
            </label>
            <input
              id="date"
              type="date"
              className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              value={estimateData.date}
              onChange={(e) => setEstimateData({...estimateData, date: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="expiryDate" className="text-right">
              Expiry Date
            </label>
            <input
              id="expiryDate"
              type="date"
              className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              value={estimateData.expiryDate}
              onChange={(e) => setEstimateData({...estimateData, expiryDate: e.target.value})}
            />
          </div>
          
          <div className="border rounded-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Items</h3>
              <Button size="sm" variant="outline" onClick={handleAddItem}>Add Item</Button>
            </div>
            
            <div className="space-y-4">
              {estimateData.items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <label htmlFor={`description-${index}`} className="text-xs mb-1 block">
                      Description*
                    </label>
                    <Input 
                      id={`description-${index}`} 
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <label htmlFor={`quantity-${index}`} className="text-xs mb-1 block">
                      Qty
                    </label>
                    <Input 
                      id={`quantity-${index}`} 
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-2">
                    <label htmlFor={`unitPrice-${index}`} className="text-xs mb-1 block">
                      Unit Price
                    </label>
                    <Input 
                      id={`unitPrice-${index}`} 
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <label htmlFor={`amount-${index}`} className="text-xs mb-1 block">
                      Amount
                    </label>
                    <Input 
                      id={`amount-${index}`} 
                      value={item.amount}
                      readOnly
                    />
                  </div>
                  <div className="col-span-1 flex items-end justify-center">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-9 px-2 text-red-500"
                      onClick={() => handleRemoveItem(index)}
                      disabled={estimateData.items.length === 1}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end mt-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Total Amount</div>
                <div className="text-xl font-bold">{estimateData.amount}</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <label htmlFor="notes" className="text-right">
              Notes
            </label>
            <textarea
              id="notes"
              rows={3}
              className="col-span-3 min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
              value={estimateData.notes}
              onChange={(e) => setEstimateData({...estimateData, notes: e.target.value})}
              placeholder="Additional notes for the estimate"
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <label htmlFor="terms" className="text-right">
              Terms & Conditions
            </label>
            <textarea
              id="terms"
              rows={3}
              className="col-span-3 min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
              value={estimateData.termsAndConditions}
              onChange={(e) => setEstimateData({...estimateData, termsAndConditions: e.target.value})}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Create Estimate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
