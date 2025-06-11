
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Calculator, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

interface FixedAsset {
  id: string;
  name: string;
  category: string;
  purchaseDate: string;
  originalCost: number;
  depreciationMethod: 'straight-line' | 'declining-balance' | 'units-of-production';
  usefulLife: number;
  salvageValue: number;
  accumulatedDepreciation: number;
  bookValue: number;
  status: 'active' | 'disposed' | 'fully-depreciated';
}

export const FixedAssetsManager: React.FC = () => {
  const [assets, setAssets] = useState<FixedAsset[]>([
    {
      id: '1',
      name: 'Office Computer',
      category: 'Equipment',
      purchaseDate: '2022-01-15',
      originalCost: 2500,
      depreciationMethod: 'straight-line',
      usefulLife: 5,
      salvageValue: 500,
      accumulatedDepreciation: 800,
      bookValue: 1700,
      status: 'active'
    }
  ]);

  const [newAsset, setNewAsset] = useState<Partial<FixedAsset>>({
    depreciationMethod: 'straight-line',
    usefulLife: 5,
    salvageValue: 0
  });

  const calculateDepreciation = (asset: Partial<FixedAsset>) => {
    if (!asset.originalCost || !asset.usefulLife) return 0;
    
    const depreciableAmount = asset.originalCost - (asset.salvageValue || 0);
    
    switch (asset.depreciationMethod) {
      case 'straight-line':
        return depreciableAmount / asset.usefulLife;
      case 'declining-balance':
        return (asset.originalCost * 0.2); // 20% declining balance
      default:
        return depreciableAmount / asset.usefulLife;
    }
  };

  const addAsset = () => {
    if (!newAsset.name || !newAsset.originalCost || !newAsset.purchaseDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const annualDepreciation = calculateDepreciation(newAsset);
    const yearsOwned = Math.floor(
      (new Date().getTime() - new Date(newAsset.purchaseDate!).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    );
    const accumulatedDepreciation = Math.min(
      annualDepreciation * yearsOwned,
      newAsset.originalCost! - (newAsset.salvageValue || 0)
    );

    const asset: FixedAsset = {
      id: Date.now().toString(),
      name: newAsset.name!,
      category: newAsset.category || 'Equipment',
      purchaseDate: newAsset.purchaseDate!,
      originalCost: newAsset.originalCost!,
      depreciationMethod: newAsset.depreciationMethod || 'straight-line',
      usefulLife: newAsset.usefulLife || 5,
      salvageValue: newAsset.salvageValue || 0,
      accumulatedDepreciation,
      bookValue: newAsset.originalCost! - accumulatedDepreciation,
      status: 'active'
    };

    setAssets([...assets, asset]);
    setNewAsset({ depreciationMethod: 'straight-line', usefulLife: 5, salvageValue: 0 });
    toast.success("Fixed asset added successfully");
  };

  const deleteAsset = (id: string) => {
    setAssets(assets.filter(asset => asset.id !== id));
    toast.success("Asset deleted successfully");
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'active': { variant: 'default' as const, label: 'Active' },
      'disposed': { variant: 'secondary' as const, label: 'Disposed' },
      'fully-depreciated': { variant: 'outline' as const, label: 'Fully Depreciated' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Fixed Assets Management</h2>
          <p className="text-muted-foreground">Track and manage your company's fixed assets with depreciation schedules</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Asset
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Fixed Asset</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Asset Name *</Label>
                <Input
                  value={newAsset.name || ''}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                  placeholder="Enter asset name"
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select 
                  value={newAsset.category || ''} 
                  onValueChange={(value) => setNewAsset({ ...newAsset, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                    <SelectItem value="Vehicles">Vehicles</SelectItem>
                    <SelectItem value="Building">Building</SelectItem>
                    <SelectItem value="Furniture">Furniture</SelectItem>
                    <SelectItem value="Software">Software</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Purchase Date *</Label>
                <Input
                  type="date"
                  value={newAsset.purchaseDate || ''}
                  onChange={(e) => setNewAsset({ ...newAsset, purchaseDate: e.target.value })}
                />
              </div>
              <div>
                <Label>Original Cost *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newAsset.originalCost || ''}
                  onChange={(e) => setNewAsset({ ...newAsset, originalCost: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label>Depreciation Method</Label>
                <Select 
                  value={newAsset.depreciationMethod || 'straight-line'} 
                  onValueChange={(value: any) => setNewAsset({ ...newAsset, depreciationMethod: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="straight-line">Straight Line</SelectItem>
                    <SelectItem value="declining-balance">Declining Balance</SelectItem>
                    <SelectItem value="units-of-production">Units of Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Useful Life (Years)</Label>
                <Input
                  type="number"
                  value={newAsset.usefulLife || ''}
                  onChange={(e) => setNewAsset({ ...newAsset, usefulLife: parseInt(e.target.value) || 0 })}
                  placeholder="5"
                />
              </div>
              <div>
                <Label>Salvage Value</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newAsset.salvageValue || ''}
                  onChange={(e) => setNewAsset({ ...newAsset, salvageValue: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label>Annual Depreciation</Label>
                <Input
                  value={`$${calculateDepreciation(newAsset).toFixed(2)}`}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline">Cancel</Button>
              <Button onClick={addAsset}>Add Asset</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Asset Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{assets.length}</div>
              <div className="text-sm text-muted-foreground">Total Assets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                ${assets.reduce((sum, asset) => sum + asset.originalCost, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Original Cost</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                ${assets.reduce((sum, asset) => sum + asset.accumulatedDepreciation, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Accumulated Depreciation</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                ${assets.reduce((sum, asset) => sum + asset.bookValue, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Net Book Value</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assets List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Purchase Date</TableHead>
                <TableHead>Original Cost</TableHead>
                <TableHead>Book Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">{asset.name}</TableCell>
                  <TableCell>{asset.category}</TableCell>
                  <TableCell>{new Date(asset.purchaseDate).toLocaleDateString()}</TableCell>
                  <TableCell>${asset.originalCost.toLocaleString()}</TableCell>
                  <TableCell>${asset.bookValue.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(asset.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Calculator className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteAsset(asset.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
