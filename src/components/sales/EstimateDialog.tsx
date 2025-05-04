
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";
import { EstimateItem } from "@/contexts/CompanyContext";

interface EstimateDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EstimateDialog: React.FC<EstimateDialogProps> = ({ isOpen, onClose }) => {
  const { currentCompany, addEstimate } = useCompany();
  const [estimate, setEstimate] = useState({
    customer: "",
    date: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [
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
    amount: "$0.00",
    status: "Draft"
  });

  const handleAddItem = () => {
    setEstimate({
      ...estimate,
      items: [
        ...estimate.items,
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
    const updatedItems = [...estimate.items];
    updatedItems.splice(index, 1);
    
    // Recalculate total
    const newTotal = updatedItems.reduce((total, item) => {
      const itemTotal = parseFloat(item.amount.replace(/[^0-9.-]+/g, "") || "0");
      return total + itemTotal;
    }, 0);
    
    setEstimate({
      ...estimate,
      items: updatedItems,
      amount: `$${newTotal.toFixed(2)}`
    });
  };

  const handleItemChange = (index: number, field: keyof EstimateItem, value: string | number) => {
    const updatedItems = [...estimate.items];
    
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
      
      setEstimate({
        ...estimate,
        items: updatedItems,
        amount: `$${newTotal.toFixed(2)}`
      });
    } else {
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value
      };
      
      setEstimate({
        ...estimate,
        items: updatedItems
      });
    }
  };

  const handleSave = () => {
    if (!estimate.customer) {
      toast.error("Please select a customer");
      return;
    }
    
    if (estimate.items.some(item => !item.description)) {
      toast.error("Please fill in all item descriptions");
      return;
    }
    
    const newEstimate = {
      ...estimate,
      estimateNumber: `EST-${Date.now().toString().slice(-6)}`,
    };
    
    addEstimate(newEstimate);
    toast.success("Estimate created successfully!");
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
              value={estimate.customer}
              onChange={(e) => setEstimate({...estimate, customer: e.target.value})}
            >
              <option value="">Select Customer</option>
              {currentCompany.customers?.map(customer => (
                <option key={customer.id} value={customer.name}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="date" className="text-right">
              Date
            </label>
            <Input 
              id="date" 
              className="col-span-3" 
              type="date"
              value={estimate.date}
              onChange={(e) => setEstimate({...estimate, date: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="expiryDate" className="text-right">
              Expiry Date
            </label>
            <Input 
              id="expiryDate" 
              className="col-span-3" 
              type="date"
              value={estimate.expiryDate}
              onChange={(e) => setEstimate({...estimate, expiryDate: e.target.value})}
            />
          </div>
          
          <div className="border rounded-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Items</h3>
              <Button size="sm" variant="outline" onClick={handleAddItem}>Add Item</Button>
            </div>
            
            <div className="space-y-4">
              {estimate.items.map((item, index) => (
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
                      disabled={estimate.items.length === 1}
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
                <div className="text-xl font-bold">{estimate.amount}</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="notes" className="text-right">
              Notes
            </label>
            <textarea 
              id="notes" 
              className="col-span-3 flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              value={estimate.notes}
              onChange={(e) => setEstimate({...estimate, notes: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="termsAndConditions" className="text-right">
              Terms & Conditions
            </label>
            <textarea 
              id="termsAndConditions" 
              className="col-span-3 flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              value={estimate.termsAndConditions}
              onChange={(e) => setEstimate({...estimate, termsAndConditions: e.target.value})}
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
