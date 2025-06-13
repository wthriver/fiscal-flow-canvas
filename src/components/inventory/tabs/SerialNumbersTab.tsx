
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
import { SerialNumber } from "@/types/company";

export const SerialNumbersTab: React.FC = () => {
  const { currentCompany, updateCompany } = useCompany();
  const [isSerialDialogOpen, setIsSerialDialogOpen] = useState(false);
  const [selectedSerial, setSelectedSerial] = useState<SerialNumber | null>(null);
  const [formData, setFormData] = useState({
    itemId: "",
    serialNumber: "",
    status: "Available" as 'Available' | 'Sold' | 'Reserved' | 'Defective',
    location: "",
    soldTo: "",
    saleDate: ""
  });

  const serialNumbers = currentCompany.inventory?.serialNumbers || [];

  const handleCreateSerial = () => {
    setSelectedSerial(null);
    setFormData({
      itemId: "",
      serialNumber: "",
      status: "In Stock",
      location: "",
      soldTo: "",
      saleDate: ""
    });
    setIsSerialDialogOpen(true);
  };

  const handleEditSerial = (serial: SerialNumber) => {
    setSelectedSerial(serial);
    setFormData({
      itemId: serial.itemId,
      serialNumber: serial.serialNumber,
      status: serial.status,
      location: serial.location || "",
      soldTo: serial.soldTo || "",
      saleDate: serial.saleDate || ""
    });
    setIsSerialDialogOpen(true);
  };

  const handleDeleteSerial = (serialId: string) => {
    if (confirm("Are you sure you want to delete this serial number?")) {
      const updatedSerials = serialNumbers.filter(s => s.id !== serialId);
      updateCompany({
        ...currentCompany,
        inventory: {
          ...currentCompany.inventory,
          serialNumbers: updatedSerials
        }
      });
      toast.success("Serial number deleted successfully");
    }
  };

  const handleSaveSerial = () => {
    if (!formData.itemId || !formData.serialNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

    const serialData: SerialNumber = {
      id: selectedSerial?.id || `serial-${Date.now()}`,
      inventoryItemId: formData.itemId,
      itemId: formData.itemId,
      serialNumber: formData.serialNumber,
      status: formData.status,
      location: formData.location,
      soldTo: formData.soldTo,
      saleDate: formData.saleDate,
      receivedDate: new Date().toISOString().split('T')[0]
    };

    const updatedSerials = selectedSerial
      ? serialNumbers.map(s => s.id === selectedSerial.id ? serialData : s)
      : [...serialNumbers, serialData];

    updateCompany({
      ...currentCompany,
      inventory: {
        ...currentCompany.inventory,
        serialNumbers: updatedSerials
      }
    });

    toast.success(selectedSerial ? "Serial number updated successfully" : "Serial number added successfully");
    setIsSerialDialogOpen(false);
  };

  const getItemName = (itemId: string) => {
    const item = currentCompany.inventory?.items?.find(i => i.id === itemId);
    return item ? item.name : "Unknown Item";
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Serial Number Tracking</CardTitle>
          <CardDescription>Track individual inventory items by serial number</CardDescription>
        </CardHeader>
        <CardContent>
          {serialNumbers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Sale Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serialNumbers.map((serial) => (
                  <TableRow key={serial.id}>
                    <TableCell>{getItemName(serial.itemId)}</TableCell>
                    <TableCell className="font-medium">{serial.serialNumber}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        serial.status === 'Sold' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {serial.status}
                      </span>
                    </TableCell>
                    <TableCell>{serial.location || '-'}</TableCell>
                    <TableCell>{serial.soldTo || '-'}</TableCell>
                    <TableCell>{serial.saleDate || '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditSerial(serial)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteSerial(serial.id)}
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
              <p className="text-muted-foreground mb-4">No serial numbers tracked yet</p>
              <Button onClick={handleCreateSerial}>
                <Plus className="h-4 w-4 mr-2" />
                Add Serial Number
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreateSerial}>
            <Plus className="h-4 w-4 mr-2" />
            Add Serial Number
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isSerialDialogOpen} onOpenChange={setIsSerialDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedSerial ? 'Edit Serial Number' : 'Add Serial Number'}</DialogTitle>
            <DialogDescription>
              Track individual items with unique serial numbers
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
                  {currentCompany.inventory?.items?.filter(item => item.trackSerial)?.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} - {item.sku}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Serial Number*</label>
              <Input
                value={formData.serialNumber}
                onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                placeholder="SN-A0012548"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="In Stock">In Stock</SelectItem>
                    <SelectItem value="Sold">Sold</SelectItem>
                    <SelectItem value="Defective">Defective</SelectItem>
                    <SelectItem value="Returned">Returned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="Warehouse A-1"
                />
              </div>
            </div>

            {formData.status === 'Sold' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Sold To</label>
                  <Input
                    value={formData.soldTo}
                    onChange={(e) => setFormData({...formData, soldTo: e.target.value})}
                    placeholder="Customer name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Sale Date</label>
                  <Input
                    type="date"
                    value={formData.saleDate}
                    onChange={(e) => setFormData({...formData, saleDate: e.target.value})}
                  />
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSerialDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveSerial}>
              {selectedSerial ? 'Update' : 'Add'} Serial Number
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
