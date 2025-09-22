import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Settings, Play, Pause, CheckCircle, AlertCircle, Package, Wrench } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";

interface BillOfMaterials {
  id: string;
  itemCode: string;
  itemName: string;
  components: {
    id: string;
    componentCode: string;
    componentName: string;
    quantity: number;
    unit: string;
    cost: number;
  }[];
  laborHours: number;
  overheadRate: number;
  totalCost: number;
  status: "active" | "draft" | "archived";
}

interface WorkOrder {
  id: string;
  orderNumber: string;
  bomId: string;
  itemName: string;
  quantityOrdered: number;
  quantityCompleted: number;
  startDate: string;
  dueDate: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  priority: "high" | "medium" | "low";
  assignedTo: string;
  notes: string;
}

export const ManufacturingModule: React.FC = () => {
  const { currentCompany, updateCompany } = useCompany();
  const [activeTab, setActiveTab] = useState("bom");
  const [isBOMDialogOpen, setIsBOMDialogOpen] = useState(false);
  const [isWorkOrderDialogOpen, setIsWorkOrderDialogOpen] = useState(false);

  // Sample BOMs data
  const [billsOfMaterials, setBillsOfMaterials] = useState<BillOfMaterials[]>([
    {
      id: "bom-1",
      itemCode: "DESK-001",
      itemName: "Executive Desk",
      components: [
        { id: "comp-1", componentCode: "WOOD-OAK", componentName: "Oak Wood Panel", quantity: 2, unit: "sheets", cost: 150 },
        { id: "comp-2", componentCode: "HDWR-001", componentName: "Desk Hardware Kit", quantity: 1, unit: "kit", cost: 45 },
        { id: "comp-3", componentCode: "FINISH-001", componentName: "Wood Stain", quantity: 0.5, unit: "gallon", cost: 30 }
      ],
      laborHours: 8,
      overheadRate: 25,
      totalCost: 425,
      status: "active"
    },
    {
      id: "bom-2",
      itemCode: "CHAIR-001",
      itemName: "Office Chair",
      components: [
        { id: "comp-4", componentCode: "FABRIC-001", componentName: "Office Fabric", quantity: 2, unit: "yards", cost: 25 },
        { id: "comp-5", componentCode: "FOAM-001", componentName: "Cushion Foam", quantity: 1, unit: "piece", cost: 15 },
        { id: "comp-6", componentCode: "FRAME-001", componentName: "Chair Frame", quantity: 1, unit: "piece", cost: 85 }
      ],
      laborHours: 4,
      overheadRate: 15,
      totalCost: 185,
      status: "active"
    }
  ]);

  // Sample Work Orders data
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([
    {
      id: "wo-1",
      orderNumber: "WO-2024-001",
      bomId: "bom-1",
      itemName: "Executive Desk",
      quantityOrdered: 5,
      quantityCompleted: 3,
      startDate: "2024-01-15",
      dueDate: "2024-01-30",
      status: "in-progress",
      priority: "high",
      assignedTo: "John Smith",
      notes: "Rush order for corporate client"
    },
    {
      id: "wo-2",
      orderNumber: "WO-2024-002",
      bomId: "bom-2",
      itemName: "Office Chair",
      quantityOrdered: 10,
      quantityCompleted: 10,
      startDate: "2024-01-10",
      dueDate: "2024-01-25",
      status: "completed",
      priority: "medium",
      assignedTo: "Sarah Johnson",
      notes: "Standard production run"
    }
  ]);

  const [newBOM, setNewBOM] = useState<Partial<BillOfMaterials>>({
    itemCode: "",
    itemName: "",
    components: [],
    laborHours: 0,
    overheadRate: 0,
    totalCost: 0,
    status: "draft"
  });

  const [newWorkOrder, setNewWorkOrder] = useState<Partial<WorkOrder>>({
    orderNumber: "",
    bomId: "",
    quantityOrdered: 0,
    startDate: "",
    dueDate: "",
    status: "pending",
    priority: "medium",
    assignedTo: "",
    notes: ""
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "active": return "bg-green-100 text-green-800";
      case "draft": return "bg-gray-100 text-gray-800";
      case "archived": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const calculateProgress = (completed: number, total: number) => {
    return total > 0 ? (completed / total) * 100 : 0;
  };

  const handleSaveBOM = () => {
    if (!newBOM.itemCode || !newBOM.itemName) {
      toast.error("Please fill in required fields");
      return;
    }

    const bom: BillOfMaterials = {
      id: `bom-${Date.now()}`,
      itemCode: newBOM.itemCode!,
      itemName: newBOM.itemName!,
      components: newBOM.components || [],
      laborHours: newBOM.laborHours || 0,
      overheadRate: newBOM.overheadRate || 0,
      totalCost: newBOM.totalCost || 0,
      status: newBOM.status as any || "draft"
    };

    setBillsOfMaterials(prev => [...prev, bom]);
    toast.success("Bill of Materials created successfully");
    setIsBOMDialogOpen(false);
    setNewBOM({
      itemCode: "",
      itemName: "",
      components: [],
      laborHours: 0,
      overheadRate: 0,
      totalCost: 0,
      status: "draft"
    });
  };

  const handleSaveWorkOrder = () => {
    if (!newWorkOrder.orderNumber || !newWorkOrder.bomId) {
      toast.error("Please fill in required fields");
      return;
    }

    const workOrder: WorkOrder = {
      id: `wo-${Date.now()}`,
      orderNumber: newWorkOrder.orderNumber!,
      bomId: newWorkOrder.bomId!,
      itemName: billsOfMaterials.find(bom => bom.id === newWorkOrder.bomId)?.itemName || "",
      quantityOrdered: newWorkOrder.quantityOrdered || 0,
      quantityCompleted: 0,
      startDate: newWorkOrder.startDate || new Date().toISOString().split('T')[0],
      dueDate: newWorkOrder.dueDate || "",
      status: newWorkOrder.status as any || "pending",
      priority: newWorkOrder.priority as any || "medium",
      assignedTo: newWorkOrder.assignedTo || "",
      notes: newWorkOrder.notes || ""
    };

    setWorkOrders(prev => [...prev, workOrder]);
    toast.success("Work Order created successfully");
    setIsWorkOrderDialogOpen(false);
    setNewWorkOrder({
      orderNumber: "",
      bomId: "",
      quantityOrdered: 0,
      startDate: "",
      dueDate: "",
      status: "pending",
      priority: "medium",
      assignedTo: "",
      notes: ""
    });
  };

  const updateWorkOrderStatus = (orderId: string, newStatus: string) => {
    setWorkOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus as any } : order
    ));
    toast.success(`Work order status updated to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manufacturing Management</h1>
          <p className="text-muted-foreground">
            Manage Bill of Materials, Work Orders, and Production
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isBOMDialogOpen} onOpenChange={setIsBOMDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Package className="h-4 w-4 mr-2" />
                New BOM
              </Button>
            </DialogTrigger>
          </Dialog>
          <Dialog open={isWorkOrderDialogOpen} onOpenChange={setIsWorkOrderDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Work Order
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Manufacturing Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active BOMs</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {billsOfMaterials.filter(bom => bom.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Work Orders</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workOrders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workOrders.filter(wo => wo.status === "in-progress").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workOrders.filter(wo => wo.status === "completed").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="bom">Bill of Materials</TabsTrigger>
          <TabsTrigger value="workorders">Work Orders</TabsTrigger>
          <TabsTrigger value="production">Production Tracking</TabsTrigger>
          <TabsTrigger value="costing">Cost Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="bom">
          <Card>
            <CardHeader>
              <CardTitle>Bill of Materials</CardTitle>
              <CardDescription>Manage product recipes and component lists</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Code</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Components</TableHead>
                    <TableHead>Labor Hours</TableHead>
                    <TableHead>Total Cost</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billsOfMaterials.map((bom) => (
                    <TableRow key={bom.id}>
                      <TableCell className="font-medium">{bom.itemCode}</TableCell>
                      <TableCell>{bom.itemName}</TableCell>
                      <TableCell>{bom.components.length} components</TableCell>
                      <TableCell>{bom.laborHours}h</TableCell>
                      <TableCell>${bom.totalCost.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(bom.status)}>
                          {bom.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workorders">
          <Card>
            <CardHeader>
              <CardTitle>Work Orders</CardTitle>
              <CardDescription>Track production orders and progress</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell>{order.itemName}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{order.quantityCompleted}/{order.quantityOrdered}</span>
                            <span>{calculateProgress(order.quantityCompleted, order.quantityOrdered).toFixed(0)}%</span>
                          </div>
                          <Progress value={calculateProgress(order.quantityCompleted, order.quantityOrdered)} />
                        </div>
                      </TableCell>
                      <TableCell>{order.dueDate}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(order.priority)}>
                          {order.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {order.status === "pending" && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => updateWorkOrderStatus(order.id, "in-progress")}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          {order.status === "in-progress" && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => updateWorkOrderStatus(order.id, "completed")}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="production">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Production Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Items in Production:</span>
                    <span className="font-bold">
                      {workOrders.filter(wo => wo.status === "in-progress").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed This Month:</span>
                    <span className="font-bold">
                      {workOrders.filter(wo => wo.status === "completed").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending Orders:</span>
                    <span className="font-bold">
                      {workOrders.filter(wo => wo.status === "pending").length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Production Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-orange-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">2 orders behind schedule</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">Low inventory: Oak Wood Panel</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="costing">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Material Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,450</div>
                <p className="text-sm text-muted-foreground">This month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Labor Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$8,200</div>
                <p className="text-sm text-muted-foreground">This month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Overhead Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$3,100</div>
                <p className="text-sm text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* BOM Dialog */}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Bill of Materials</DialogTitle>
          <DialogDescription>
            Define components and specifications for manufacturing
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="item-code">Item Code</Label>
              <Input
                id="item-code"
                value={newBOM.itemCode || ""}
                onChange={(e) => setNewBOM(prev => ({ ...prev, itemCode: e.target.value }))}
                placeholder="Enter item code"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-name">Item Name</Label>
              <Input
                id="item-name"
                value={newBOM.itemName || ""}
                onChange={(e) => setNewBOM(prev => ({ ...prev, itemName: e.target.value }))}
                placeholder="Enter item name"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="labor-hours">Labor Hours</Label>
              <Input
                id="labor-hours"
                type="number"
                value={newBOM.laborHours || ""}
                onChange={(e) => setNewBOM(prev => ({ ...prev, laborHours: Number(e.target.value) }))}
                placeholder="Labor hours required"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="overhead-rate">Overhead Rate (%)</Label>
              <Input
                id="overhead-rate"
                type="number"
                value={newBOM.overheadRate || ""}
                onChange={(e) => setNewBOM(prev => ({ ...prev, overheadRate: Number(e.target.value) }))}
                placeholder="Overhead percentage"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsBOMDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveBOM}>Create BOM</Button>
        </DialogFooter>
      </DialogContent>

      {/* Work Order Dialog */}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Work Order</DialogTitle>
          <DialogDescription>
            Create a production order based on existing BOMs
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="order-number">Order Number</Label>
              <Input
                id="order-number"
                value={newWorkOrder.orderNumber || ""}
                onChange={(e) => setNewWorkOrder(prev => ({ ...prev, orderNumber: e.target.value }))}
                placeholder="WO-2024-XXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bom-select">Select BOM</Label>
             
              <Select 
                value={newWorkOrder.bomId} 
                onValueChange={(value) => setNewWorkOrder(prev => ({ ...prev, bomId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Bill of Materials" />
                </SelectTrigger>
                <SelectContent>
                  {billsOfMaterials.map(bom => (
                    <SelectItem key={bom.id} value={bom.id}>
                      {bom.itemCode} - {bom.itemName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={newWorkOrder.quantityOrdered || ""}
                onChange={(e) => setNewWorkOrder(prev => ({ ...prev, quantityOrdered: Number(e.target.value) }))}
                placeholder="Quantity to produce"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={newWorkOrder.startDate || ""}
                onChange={(e) => setNewWorkOrder(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="due-date">Due Date</Label>
              <Input
                id="due-date"
                type="date"
                value={newWorkOrder.dueDate || ""}
                onChange={(e) => setNewWorkOrder(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="assigned-to">Assigned To</Label>
            <Input
              id="assigned-to"
              value={newWorkOrder.assignedTo || ""}
              onChange={(e) => setNewWorkOrder(prev => ({ ...prev, assignedTo: e.target.value }))}
              placeholder="Assign to team member"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={newWorkOrder.notes || ""}
              onChange={(e) => setNewWorkOrder(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes or requirements"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsWorkOrderDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveWorkOrder}>Create Work Order</Button>
        </DialogFooter>
      </DialogContent>
    </div>
  );
};