
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Plus, Building, Car, Monitor, Wrench } from "lucide-react";
import { toast } from "sonner";

interface FixedAsset {
  id: string;
  name: string;
  category: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  depreciationMethod: string;
  usefulLife: number;
  yearlyDepreciation: number;
  accumulatedDepreciation: number;
  location: string;
  status: "Active" | "Disposed" | "Under Maintenance";
}

export const FixedAssetsTracking = () => {
  const [isNewAssetOpen, setIsNewAssetOpen] = useState(false);
  
  const [fixedAssets] = useState<FixedAsset[]>([
    {
      id: "asset-1",
      name: "Office Building",
      category: "Real Estate",
      purchaseDate: "2020-01-15",
      purchasePrice: 500000,
      currentValue: 475000,
      depreciationMethod: "Straight Line",
      usefulLife: 40,
      yearlyDepreciation: 12500,
      accumulatedDepreciation: 62500,
      location: "Main Office",
      status: "Active"
    },
    {
      id: "asset-2",
      name: "Company Vehicle - Tesla Model S",
      category: "Vehicles",
      purchaseDate: "2023-06-01",
      purchasePrice: 85000,
      currentValue: 68000,
      depreciationMethod: "Straight Line",
      usefulLife: 5,
      yearlyDepreciation: 17000,
      accumulatedDepreciation: 17000,
      location: "Main Office",
      status: "Active"
    },
    {
      id: "asset-3",
      name: "Manufacturing Equipment",
      category: "Machinery",
      purchaseDate: "2022-03-10",
      purchasePrice: 150000,
      currentValue: 120000,
      depreciationMethod: "Straight Line",
      usefulLife: 10,
      yearlyDepreciation: 15000,
      accumulatedDepreciation: 30000,
      location: "Factory Floor",
      status: "Active"
    },
    {
      id: "asset-4",
      name: "Computer Equipment",
      category: "Technology",
      purchaseDate: "2024-01-01",
      purchasePrice: 25000,
      currentValue: 20000,
      depreciationMethod: "Straight Line",
      usefulLife: 3,
      yearlyDepreciation: 8333,
      accumulatedDepreciation: 5000,
      location: "Office",
      status: "Active"
    }
  ]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Real Estate": return <Building className="h-4 w-4" />;
      case "Vehicles": return <Car className="h-4 w-4" />;
      case "Technology": return <Monitor className="h-4 w-4" />;
      case "Machinery": return <Wrench className="h-4 w-4" />;
      default: return <Building className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Disposed": return "bg-red-100 text-red-800";
      case "Under Maintenance": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDepreciationPercentage = (asset: FixedAsset) => {
    return (asset.accumulatedDepreciation / asset.purchasePrice) * 100;
  };

  const getTotalValue = () => {
    return fixedAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
  };

  const getTotalDepreciation = () => {
    return fixedAssets.reduce((sum, asset) => sum + asset.accumulatedDepreciation, 0);
  };

  const handleCreateAsset = () => {
    toast.success("Fixed asset added successfully");
    setIsNewAssetOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Fixed Assets Tracking</h2>
          <p className="text-muted-foreground">Manage and track asset depreciation</p>
        </div>
        <Button onClick={() => setIsNewAssetOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Asset
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fixedAssets.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Current Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${getTotalValue().toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Depreciation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${getTotalDepreciation().toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Original Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${fixedAssets.reduce((sum, asset) => sum + asset.purchasePrice, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fixed Assets Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Purchase Date</TableHead>
                <TableHead>Original Cost</TableHead>
                <TableHead>Current Value</TableHead>
                <TableHead>Depreciation</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fixedAssets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(asset.category)}
                      <div>
                        <div className="font-medium">{asset.name}</div>
                        <div className="text-sm text-muted-foreground">{asset.location}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{asset.category}</TableCell>
                  <TableCell>{asset.purchaseDate}</TableCell>
                  <TableCell>${asset.purchasePrice.toLocaleString()}</TableCell>
                  <TableCell>${asset.currentValue.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Progress value={getDepreciationPercentage(asset)} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        ${asset.accumulatedDepreciation.toLocaleString()} ({getDepreciationPercentage(asset).toFixed(1)}%)
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(asset.status)}>
                      {asset.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{asset.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold">Asset Information</h4>
                              <p><strong>Category:</strong> {asset.category}</p>
                              <p><strong>Location:</strong> {asset.location}</p>
                              <p><strong>Status:</strong> {asset.status}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold">Financial Details</h4>
                              <p><strong>Purchase Price:</strong> ${asset.purchasePrice.toLocaleString()}</p>
                              <p><strong>Current Value:</strong> ${asset.currentValue.toLocaleString()}</p>
                              <p><strong>Useful Life:</strong> {asset.usefulLife} years</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold">Depreciation Details</h4>
                            <p><strong>Method:</strong> {asset.depreciationMethod}</p>
                            <p><strong>Yearly Depreciation:</strong> ${asset.yearlyDepreciation.toLocaleString()}</p>
                            <p><strong>Accumulated Depreciation:</strong> ${asset.accumulatedDepreciation.toLocaleString()}</p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Asset Dialog */}
      <Dialog open={isNewAssetOpen} onOpenChange={setIsNewAssetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Fixed Asset</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="asset-name">Asset Name</Label>
              <Input id="asset-name" placeholder="Enter asset name" />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="real-estate">Real Estate</SelectItem>
                  <SelectItem value="vehicles">Vehicles</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="machinery">Machinery</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="purchase-date">Purchase Date</Label>
                <Input type="date" id="purchase-date" />
              </div>
              <div>
                <Label htmlFor="purchase-price">Purchase Price</Label>
                <Input type="number" id="purchase-price" placeholder="0.00" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="useful-life">Useful Life (years)</Label>
                <Input type="number" id="useful-life" placeholder="5" />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Asset location" />
              </div>
            </div>
            <Button onClick={handleCreateAsset} className="w-full">
              Add Asset
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
