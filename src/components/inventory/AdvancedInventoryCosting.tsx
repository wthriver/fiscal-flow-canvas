import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Package, Layers, BarChart3, TrendingUp, AlertCircle, Settings } from 'lucide-react';

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  costingMethod: 'FIFO' | 'LIFO' | 'Average' | 'Specific';
  unitCost: number;
  totalValue: number;
  reorderPoint: number;
  costHistory: CostEntry[];
  lotNumbers?: string[];
  serialNumbers?: string[];
}

interface CostEntry {
  date: string;
  quantity: number;
  unitCost: number;
  type: 'purchase' | 'sale' | 'adjustment';
}

interface Assembly {
  id: string;
  name: string;
  sku: string;
  components: AssemblyComponent[];
  laborCost: number;
  overheadCost: number;
  totalCost: number;
  isActive: boolean;
}

interface AssemblyComponent {
  itemId: string;
  itemName: string;
  quantity: number;
  unitCost: number;
}

interface LotTrackingItem {
  id: string;
  itemId: string;
  lotNumber: string;
  expirationDate?: string;
  quantity: number;
  unitCost: number;
  location: string;
  status: 'available' | 'quarantine' | 'expired';
}

const SAMPLE_INVENTORY: InventoryItem[] = [
  {
    id: 'item-1',
    sku: 'WIDGET-001',
    name: 'Premium Widget',
    category: 'Electronics',
    quantity: 150,
    costingMethod: 'FIFO',
    unitCost: 25.50,
    totalValue: 3825.00,
    reorderPoint: 50,
    costHistory: [
      { date: '2024-01-01', quantity: 100, unitCost: 24.00, type: 'purchase' },
      { date: '2024-01-15', quantity: -25, unitCost: 24.00, type: 'sale' },
      { date: '2024-02-01', quantity: 75, unitCost: 27.00, type: 'purchase' }
    ]
  },
  {
    id: 'item-2',
    sku: 'COMP-001',
    name: 'Circuit Board',
    category: 'Components',
    quantity: 200,
    costingMethod: 'Average',
    unitCost: 15.75,
    totalValue: 3150.00,
    reorderPoint: 25,
    costHistory: [
      { date: '2024-01-10', quantity: 150, unitCost: 15.00, type: 'purchase' },
      { date: '2024-01-20', quantity: 50, unitCost: 17.00, type: 'purchase' }
    ]
  }
];

const SAMPLE_ASSEMBLIES: Assembly[] = [
  {
    id: 'asm-1',
    name: 'Complete Device',
    sku: 'DEVICE-001',
    components: [
      { itemId: 'item-1', itemName: 'Premium Widget', quantity: 2, unitCost: 25.50 },
      { itemId: 'item-2', itemName: 'Circuit Board', quantity: 1, unitCost: 15.75 }
    ],
    laborCost: 45.00,
    overheadCost: 12.00,
    totalCost: 123.75,
    isActive: true
  }
];

const SAMPLE_LOTS: LotTrackingItem[] = [
  {
    id: 'lot-1',
    itemId: 'item-1',
    lotNumber: 'LOT-2024-001',
    expirationDate: '2025-01-15',
    quantity: 75,
    unitCost: 24.00,
    location: 'A-1-1',
    status: 'available'
  },
  {
    id: 'lot-2',
    itemId: 'item-1',
    lotNumber: 'LOT-2024-002',
    quantity: 75,
    unitCost: 27.00,
    location: 'A-1-2',
    status: 'available'
  }
];

export const AdvancedInventoryCosting: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(SAMPLE_INVENTORY);
  const [assemblies, setAssemblies] = useState<Assembly[]>(SAMPLE_ASSEMBLIES);
  const [lots, setLots] = useState<LotTrackingItem[]>(SAMPLE_LOTS);
  const [enableLotTracking, setEnableLotTracking] = useState(true);
  const [enableSerialTracking, setEnableSerialTracking] = useState(false);
  const { toast } = useToast();

  const calculateInventoryValue = () => {
    return inventory.reduce((total, item) => total + item.totalValue, 0);
  };

  const getCostingMethodBadge = (method: InventoryItem['costingMethod']) => {
    const colors = {
      FIFO: 'bg-blue-100 text-blue-800',
      LIFO: 'bg-purple-100 text-purple-800',
      Average: 'bg-green-100 text-green-800',
      Specific: 'bg-orange-100 text-orange-800'
    };

    return (
      <Badge variant="secondary" className={colors[method]}>
        {method}
      </Badge>
    );
  };

  const getLotStatusBadge = (status: LotTrackingItem['status']) => {
    const colors = {
      available: 'bg-green-100 text-green-800',
      quarantine: 'bg-yellow-100 text-yellow-800',
      expired: 'bg-red-100 text-red-800'
    };

    return (
      <Badge variant="secondary" className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const updateCostingMethod = (itemId: string, method: InventoryItem['costingMethod']) => {
    setInventory(prev => prev.map(item => 
      item.id === itemId ? { ...item, costingMethod: method } : item
    ));
    toast({
      title: "Costing Method Updated",
      description: `Item costing method changed to ${method}`,
    });
  };

  const calculateFIFOCost = (item: InventoryItem, quantityToSell: number) => {
    let remainingQuantity = quantityToSell;
    let totalCost = 0;
    const sortedHistory = [...item.costHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    for (const entry of sortedHistory) {
      if (entry.type === 'purchase' && remainingQuantity > 0) {
        const quantityFromThisLot = Math.min(remainingQuantity, entry.quantity);
        totalCost += quantityFromThisLot * entry.unitCost;
        remainingQuantity -= quantityFromThisLot;
      }
    }
    
    return totalCost / quantityToSell;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Advanced Inventory Costing</h1>
          <p className="text-muted-foreground">FIFO/LIFO costing, assemblies, and lot tracking</p>
        </div>
        <Button>
          <Package className="mr-2 h-4 w-4" />
          Inventory Valuation Report
        </Button>
      </div>

      {/* Inventory Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${calculateInventoryValue().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+2.5% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
            <p className="text-xs text-muted-foreground">Tracked items</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Lots</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lots.filter(l => l.status === 'available').length}</div>
            <p className="text-xs text-muted-foreground">Available for sale</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assemblies</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assemblies.filter(a => a.isActive).length}</div>
            <p className="text-xs text-muted-foreground">Active configurations</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory Items</TabsTrigger>
          <TabsTrigger value="assemblies">Assemblies</TabsTrigger>
          <TabsTrigger value="lots">Lot Tracking</TabsTrigger>
          <TabsTrigger value="costing">Costing Methods</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Items</CardTitle>
              <CardDescription>Manage inventory with advanced costing methods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventory.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Package className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.sku} • Qty: {item.quantity} • ${item.unitCost.toFixed(2)}/unit
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium">${item.totalValue.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">Total Value</div>
                      </div>
                      {getCostingMethodBadge(item.costingMethod)}
                      {item.quantity <= item.reorderPoint && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assemblies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Assemblies</CardTitle>
              <CardDescription>Configure multi-component products with labor and overhead</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assemblies.map((assembly) => (
                  <div key={assembly.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <Layers className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{assembly.name}</div>
                          <div className="text-sm text-muted-foreground">{assembly.sku}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${assembly.totalCost.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">Total Cost</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Components:</div>
                      {assembly.components.map((comp, index) => (
                        <div key={index} className="flex items-center justify-between text-sm pl-4">
                          <span>{comp.itemName} (Qty: {comp.quantity})</span>
                          <span>${(comp.quantity * comp.unitCost).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between text-sm pl-4">
                        <span>Labor Cost</span>
                        <span>${assembly.laborCost.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm pl-4">
                        <span>Overhead Cost</span>
                        <span>${assembly.overheadCost.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-4">Create Assembly</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lots" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lot Tracking</CardTitle>
              <CardDescription>Track inventory by lot numbers and expiration dates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lots.map((lot) => (
                  <div key={lot.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Package className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{lot.lotNumber}</div>
                        <div className="text-sm text-muted-foreground">
                          Location: {lot.location} • Qty: {lot.quantity}
                          {lot.expirationDate && ` • Expires: ${lot.expirationDate}`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium">${(lot.quantity * lot.unitCost).toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">${lot.unitCost.toFixed(2)}/unit</div>
                      </div>
                      {getLotStatusBadge(lot.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Costing Methods</CardTitle>
              <CardDescription>Configure inventory valuation methods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Available Methods</h3>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium">FIFO (First In, First Out)</div>
                        <div className="text-sm text-muted-foreground">
                          Oldest inventory is sold first. Best for perishable goods.
                        </div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium">LIFO (Last In, First Out)</div>
                        <div className="text-sm text-muted-foreground">
                          Newest inventory is sold first. Tax advantages in inflation.
                        </div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium">Average Cost</div>
                        <div className="text-sm text-muted-foreground">
                          Weighted average of all inventory costs.
                        </div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium">Specific Identification</div>
                        <div className="text-sm text-muted-foreground">
                          Track specific items by serial/lot numbers.
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Item Assignments</h3>
                    <div className="space-y-3">
                      {inventory.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">{item.sku}</div>
                          </div>
                          <Select 
                            value={item.costingMethod} 
                            onValueChange={(value) => updateCostingMethod(item.id, value as InventoryItem['costingMethod'])}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="FIFO">FIFO</SelectItem>
                              <SelectItem value="LIFO">LIFO</SelectItem>
                              <SelectItem value="Average">Average</SelectItem>
                              <SelectItem value="Specific">Specific</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Settings</CardTitle>
              <CardDescription>Configure advanced inventory features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Lot Tracking</Label>
                  <div className="text-sm text-muted-foreground">
                    Track inventory by lot numbers and expiration dates
                  </div>
                </div>
                <Switch checked={enableLotTracking} onCheckedChange={setEnableLotTracking} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Serial Number Tracking</Label>
                  <div className="text-sm text-muted-foreground">
                    Track individual items by unique serial numbers
                  </div>
                </div>
                <Switch checked={enableSerialTracking} onCheckedChange={setEnableSerialTracking} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="default-costing">Default Costing Method</Label>
                <Select defaultValue="FIFO">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FIFO">FIFO</SelectItem>
                    <SelectItem value="LIFO">LIFO</SelectItem>
                    <SelectItem value="Average">Average Cost</SelectItem>
                    <SelectItem value="Specific">Specific Identification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="valuation-method">Inventory Valuation</Label>
                <Select defaultValue="lower-cost-market">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cost">Cost</SelectItem>
                    <SelectItem value="lower-cost-market">Lower of Cost or Market</SelectItem>
                    <SelectItem value="net-realizable">Net Realizable Value</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};