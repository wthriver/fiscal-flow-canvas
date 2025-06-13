
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Calculator } from "lucide-react";
import { toast } from "sonner";

interface FixedAsset {
  id: string;
  name: string;
  category: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  depreciationMethod: 'Straight Line' | 'Declining Balance' | 'Sum of Years';
  usefulLife: number;
  accumulatedDepreciation: number;
  status: 'Active' | 'Disposed' | 'Sold';
}

export const FixedAssetsManager: React.FC = () => {
  const [assets, setAssets] = useState<FixedAsset[]>([
    {
      id: '1',
      name: 'Office Building',
      category: 'Real Estate',
      purchaseDate: '2020-01-15',
      purchasePrice: 500000,
      currentValue: 450000,
      depreciationMethod: 'Straight Line',
      usefulLife: 30,
      accumulatedDepreciation: 50000,
      status: 'Active'
    },
    {
      id: '2',
      name: 'Company Vehicle',
      category: 'Vehicle',
      purchaseDate: '2022-06-01',
      purchasePrice: 35000,
      currentValue: 28000,
      depreciationMethod: 'Declining Balance',
      usefulLife: 5,
      accumulatedDepreciation: 7000,
      status: 'Active'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<FixedAsset | null>(null);

  const calculateDepreciation = (asset: FixedAsset): number => {
    const yearsOwned = new Date().getFullYear() - new Date(asset.purchaseDate).getFullYear();
    switch (asset.depreciationMethod) {
      case 'Straight Line':
        return (asset.purchasePrice / asset.usefulLife) * yearsOwned;
      case 'Declining Balance':
        return asset.purchasePrice * (1 - Math.pow(0.8, yearsOwned));
      default:
        return asset.accumulatedDepreciation;
    }
  };

  const handleAddAsset = () => {
    setEditingAsset(null);
    setIsDialogOpen(true);
  };

  const handleEditAsset = (asset: FixedAsset) => {
    setEditingAsset(asset);
    setIsDialogOpen(true);
  };

  const handleDeleteAsset = (assetId: string) => {
    setAssets(assets.filter(asset => asset.id !== assetId));
    toast.success("Asset deleted successfully");
  };

  const handleSaveAsset = (assetData: Partial<FixedAsset>) => {
    if (editingAsset) {
      setAssets(assets.map(asset => 
        asset.id === editingAsset.id 
          ? { ...editingAsset, ...assetData } as FixedAsset
          : asset
      ));
      toast.success("Asset updated successfully");
    } else {
      const newAsset: FixedAsset = {
        id: `asset-${Date.now()}`,
        name: assetData.name!,
        category: assetData.category!,
        purchaseDate: assetData.purchaseDate!,
        purchasePrice: assetData.purchasePrice!,
        currentValue: assetData.currentValue!,
        depreciationMethod: assetData.depreciationMethod!,
        usefulLife: assetData.usefulLife!,
        accumulatedDepreciation: 0,
        status: 'Active'
      };
      setAssets([...assets, newAsset]);
      toast.success("Asset added successfully");
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Fixed Assets Management</h2>
          <p className="text-muted-foreground">Track and manage your company's fixed assets</p>
        </div>
        <Button onClick={handleAddAsset}>
          <Plus className="mr-2 h-4 w-4" />
          Add Asset
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${assets.reduce((sum, asset) => sum + asset.purchasePrice, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Current Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${assets.reduce((sum, asset) => sum + asset.currentValue, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Depreciation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${assets.reduce((sum, asset) => sum + asset.accumulatedDepreciation, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assets.filter(asset => asset.status === 'Active').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Purchase Date</TableHead>
                <TableHead>Purchase Price</TableHead>
                <TableHead>Current Value</TableHead>
                <TableHead>Depreciation</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">{asset.name}</TableCell>
                  <TableCell>{asset.category}</TableCell>
                  <TableCell>{asset.purchaseDate}</TableCell>
                  <TableCell>${asset.purchasePrice.toLocaleString()}</TableCell>
                  <TableCell>${asset.currentValue.toLocaleString()}</TableCell>
                  <TableCell>${asset.accumulatedDepreciation.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={asset.status === 'Active' ? 'default' : 'secondary'}>
                      {asset.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditAsset(asset)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteAsset(asset.id)}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingAsset ? 'Edit Asset' : 'Add New Asset'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            handleSaveAsset({
              name: formData.get('name') as string,
              category: formData.get('category') as string,
              purchaseDate: formData.get('purchaseDate') as string,
              purchasePrice: parseFloat(formData.get('purchasePrice') as string),
              currentValue: parseFloat(formData.get('currentValue') as string),
              depreciationMethod: formData.get('depreciationMethod') as any,
              usefulLife: parseInt(formData.get('usefulLife') as string)
            });
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Asset Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={editingAsset?.name}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    defaultValue={editingAsset?.category}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="purchaseDate">Purchase Date</Label>
                  <Input
                    id="purchaseDate"
                    name="purchaseDate"
                    type="date"
                    defaultValue={editingAsset?.purchaseDate}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="purchasePrice">Purchase Price</Label>
                  <Input
                    id="purchasePrice"
                    name="purchasePrice"
                    type="number"
                    step="0.01"
                    defaultValue={editingAsset?.purchasePrice}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentValue">Current Value</Label>
                  <Input
                    id="currentValue"
                    name="currentValue"
                    type="number"
                    step="0.01"
                    defaultValue={editingAsset?.currentValue}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="usefulLife">Useful Life (years)</Label>
                  <Input
                    id="usefulLife"
                    name="usefulLife"
                    type="number"
                    defaultValue={editingAsset?.usefulLife}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="depreciationMethod">Depreciation Method</Label>
                <Select name="depreciationMethod" defaultValue={editingAsset?.depreciationMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Straight Line">Straight Line</SelectItem>
                    <SelectItem value="Declining Balance">Declining Balance</SelectItem>
                    <SelectItem value="Sum of Years">Sum of Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingAsset ? 'Update' : 'Add'} Asset
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
