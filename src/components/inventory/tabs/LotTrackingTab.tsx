
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, AlertTriangle } from "lucide-react";
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
    quantity: "",
    expiryDate: "",
    receivedDate: "",
    supplierId: ""
  });

  const lotTracking = currentCompany.inventory?.lotTracking || [];

  const handleCreateLot = () => {
    setSelectedLot(null);
    setFormData({
      itemId: "",
      lotNumber: "",
      quantity: "",
      expiryDate: "",
      receivedDate: new Date().toISOString().split('T')[0],
      supplierId: ""
    });
    setIsLotDialogOpen(true);
  };

  const handleEditLot = (lot: LotTrack) => {
    setSelectedLot(lot);
    setFormData({
      itemId: lot.itemId,
      lotNumber: lot.lotNumber,
      quantity: lot.quantity.toString(),
      expiryDate: lot.expiryDate || "",
      receivedDate: lot.receivedDate,
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
      itemId: formData.itemId,
      lotNumber: formData.lotNumber,
      quantity: parseInt(formData.quantity),
      expiryDate: formData.expiryDate,
      receivedDate: formData.receivedDate,
      supplierId: formData.supplierId
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

  const isExpiringSoon = (expiryDate: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiry <= thirtyDaysFromNow;
  };

  const isExpired = (expiryDate: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Lot Tracking</CardTitle>
          <CardDescription>Track inventory by lot/batch number with expiration dates</CardDescription>
        </CardHeader>
        <CardContent>
          {lotTracking.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Lot Number</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Received Date</TableHead>
                  <TableHead>Expiration Date</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lotTracking.map((lot) => (
                  <TableRow key={lot.id}>
                    <TableCell>{getItemName(lot.itemId)}</TableCell>
                    <TableCell className="font-medium">{lot.lotNumber}</TableCell>
                    <TableCell>{lot.quantity}</TableCell>
                    <TableCell>{new Date(lot.receivedDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {lot.expiryDate && isExpired(lot.expiryDate) && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                        {lot.expiryDate && isExpiringSoon(lot.expiryDate) && !isExpired(lot.expiryDate) && (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                        {lot.expiryDate ? new Date(lot.expiryDate).toLocaleDateString() : 'No expiry'}
                      </div>
                    </TableCell>
                    <TableCell>{lot.supplierId ? getSupplierName(lot.supplierId) : '-'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        lot.expiryDate && isExpired(lot.expiryDate) 
                          ? 'bg-red-100 text-red-800' 
                          : lot.expiryDate && isExpiringSoon(lot.expiryDate)
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {lot.expiryDate && isExpired(lot.expiryDate) 
                          ? 'Expired' 
                          : lot.expiryDate && isExpiringSoon(lot.expiryDate)
                          ? 'Expiring Soon'
                          : 'Active'}
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
            <DialogTitle>{selectedLot ? 'Edit Lot' : 'Add New Lot'}</DialogTitle>
            <DialogDescription>
              Track inventory by lot/batch numbers with expiration tracking
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
                  placeholder="LOT-2025-042"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Quantity*</label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  placeholder="45"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Received Date*</label>
                <Input
                  type="date"
                  value={formData.receivedDate}
                  onChange={(e) => setFormData({...formData, receivedDate: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Expiry Date</label>
                <Input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                />
              </div>
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
