
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
import { LotTrack } from "@/types/company";

export const LotTrackingTab: React.FC = () => {
  const { currentCompany, updateCompany } = useCompany();
  const [isLotDialogOpen, setIsLotDialogOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState<LotTrack | null>(null);
  const [formData, setFormData] = useState({
    itemId: "",
    lotNumber: "",
    quantity: "1",
    expiryDate: "",
    supplierId: ""
  });

  const lotTracking = currentCompany.inventory?.lotTracking || [];

  const handleCreateLot = () => {
    setSelectedLot(null);
    setFormData({
      itemId: "",
      lotNumber: "",
      quantity: "1",
      expiryDate: "",
      supplierId: ""
    });
    setIsLotDialogOpen(true);
  };

  const handleEditLot = (lot: LotTrack) => {
    setSelectedLot(lot);
    setFormData({
      itemId: lot.itemId || lot.inventoryItemId,
      lotNumber: lot.lotNumber,
      quantity: lot.quantity.toString(),
      expiryDate: lot.expiryDate || lot.expirationDate || "",
      supplierId: lot.supplierId || ""
    });
    setIsLotDialogOpen(true);
  };

  const handleDeleteLot = (lotId: string) => {
    if (confirm("Are you sure you want to delete this lot?")) {
      const updatedLots = lotTracking.filter(l => l.id !== lotId);
      updateCompany({
        ...currentCompany,
        inventory: {
          ...currentCompany.inventory,
          lotTracking: updatedLots
        }
      });
      toast.success("Lot deleted successfully");
    }
  };

  const handleSaveLot = () => {
    if (!formData.itemId || !formData.lotNumber || !formData.quantity) {
      toast.error("Please fill in all required fields");
      return;
    }

    const lotData: LotTrack = {
      id: selectedLot?.id || `lot-${Date.now()}`,
      inventoryItemId: formData.itemId,
      itemId: formData.itemId,
      lotNumber: formData.lotNumber,
      quantity: parseInt(formData.quantity),
      expiryDate: formData.expiryDate,
      expirationDate: formData.expiryDate,
      receivedDate: new Date().toISOString().split('T')[0],
      supplierId: formData.supplierId,
      supplier: formData.supplierId,
      status: 'Available'
    };

    const updatedLots = selectedLot
      ? lotTracking.map(l => l.id === selectedLot.id ? lotData : l)
      : [...lotTracking, lotData];

    updateCompany({
      ...currentCompany,
      inventory: {
        ...currentCompany.inventory,
        lotTracking: updatedLots
      }
    });

    toast.success(selectedLot ? "Lot updated successfully" : "Lot added successfully");
    setIsLotDialogOpen(false);
  };

  const getItemName = (itemId: string) => {
    const item = currentCompany.inventory?.items?.find(i => i.id === itemId);
    return item ? item.name : "Unknown Item";
  };

  const getSupplierName = (supplierId: string) => {
    const supplier = currentCompany.inventory?.suppliers?.find(s => s.id === supplierId);
    return supplier ? supplier.name : "Unknown Supplier";
  };

  const isExpired = (expiryDate: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const isNearExpiry = (expiryDate: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const timeDiff = expiry.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff <= 30 && daysDiff > 0;
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Lot Tracking</CardTitle>
          <CardDescription>Track inventory items by lot numbers and expiration dates</CardDescription>
        </CardHeader>
        <CardContent>
          {lotTracking.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Lot Number</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lotTracking.map((lot) => (
                  <TableRow key={lot.id}>
                    <TableCell>{getItemName(lot.itemId || lot.inventoryItemId)}</TableCell>
                    <TableCell className="font-medium">{lot.lotNumber}</TableCell>
                    <TableCell>{lot.quantity}</TableCell>
                    <TableCell>
                      <span className={`${
                        isExpired(lot.expiryDate || lot.expirationDate || '') 
                          ? 'text-red-600 font-medium' 
                          : isNearExpiry(lot.expiryDate || lot.expirationDate || '')
                          ? 'text-yellow-600 font-medium'
                          : ''
                      }`}>
                        {lot.expiryDate || lot.expirationDate || '-'}
                        {isExpired(lot.expiryDate || lot.expirationDate || '') && ' (Expired)'}
                        {isNearExpiry(lot.expiryDate || lot.expirationDate || '') && ' (Near Expiry)'}
                      </span>
                    </TableCell>
                    <TableCell>{getSupplierName(lot.supplierId || '')}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        lot.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {lot.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditLot(lot)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteLot(lot.id)}
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
              <p className="text-muted-foreground mb-4">No lots tracked yet</p>
              <Button onClick={handleCreateLot}>
                <Plus className="h-4 w-4 mr-2" />
                Add Lot
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreateLot}>
            <Plus className="h-4 w-4 mr-2" />
            Add Lot
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isLotDialogOpen} onOpenChange={setIsLotDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedLot ? 'Edit Lot' : 'Add Lot'}</DialogTitle>
            <DialogDescription>
              Track inventory by lot numbers for better traceability
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <label className="text-sm font-medium">Item*</label>
              <Select value={formData.itemId} onValueChange={(value) => setFormData({...formData, itemId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select item" />
                </SelectTrigger>
                <SelectContent>
                  {currentCompany.inventory?.items?.filter(item => item.trackLots)?.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} - {item.sku}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Lot Number*</label>
                <Input
                  value={formData.lotNumber}
                  onChange={(e) => setFormData({...formData, lotNumber: e.target.value})}
                  placeholder="LOT-2024-001"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Quantity*</label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  placeholder="100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Expiry Date</label>
                <Input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Supplier</label>
                <Select value={formData.supplierId} onValueChange={(value) => setFormData({...formData, supplierId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentCompany.inventory?.suppliers?.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLotDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveLot}>
              {selectedLot ? 'Update' : 'Add'} Lot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
