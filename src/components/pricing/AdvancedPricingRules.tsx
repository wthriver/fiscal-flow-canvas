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
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Percent, DollarSign, Users, Calendar } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";

interface PricingRule {
  id: string;
  name: string;
  type: "quantity" | "customer" | "seasonal" | "markup";
  active: boolean;
  priority: number;
  conditions: {
    minQuantity?: number;
    maxQuantity?: number;
    customerGroups?: string[];
    dateRange?: { start: string; end: string };
    items?: string[];
  };
  discount: {
    type: "percentage" | "fixed";
    value: number;
  };
  createdDate: string;
}

export const AdvancedPricingRules: React.FC = () => {
  const { currentCompany, updateCompany } = useCompany();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<PricingRule | null>(null);
  const [activeTab, setActiveTab] = useState("rules");

  // Sample pricing rules data
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([
    {
      id: "rule-1",
      name: "Volume Discount - Electronics",
      type: "quantity",
      active: true,
      priority: 1,
      conditions: { minQuantity: 10, items: ["electronics"] },
      discount: { type: "percentage", value: 15 },
      createdDate: "2024-01-15"
    },
    {
      id: "rule-2",
      name: "VIP Customer Pricing",
      type: "customer",
      active: true,
      priority: 2,
      conditions: { customerGroups: ["VIP", "Premium"] },
      discount: { type: "percentage", value: 10 },
      createdDate: "2024-02-01"
    },
    {
      id: "rule-3",
      name: "Holiday Season Special",
      type: "seasonal",
      active: false,
      priority: 3,
      conditions: { 
        dateRange: { start: "2024-11-15", end: "2024-12-31" } 
      },
      discount: { type: "percentage", value: 20 },
      createdDate: "2024-10-15"
    }
  ]);

  const [newRule, setNewRule] = useState<Partial<PricingRule>>({
    name: "",
    type: "quantity",
    active: true,
    priority: 1,
    conditions: {},
    discount: { type: "percentage", value: 0 }
  });

  const handleSaveRule = () => {
    if (!newRule.name) {
      toast.error("Please enter a rule name");
      return;
    }

    const rule: PricingRule = {
      id: editingRule ? editingRule.id : `rule-${Date.now()}`,
      name: newRule.name!,
      type: newRule.type!,
      active: newRule.active!,
      priority: newRule.priority!,
      conditions: newRule.conditions!,
      discount: newRule.discount!,
      createdDate: editingRule ? editingRule.createdDate : new Date().toISOString().split('T')[0]
    };

    if (editingRule) {
      setPricingRules(prev => prev.map(r => r.id === rule.id ? rule : r));
      toast.success("Pricing rule updated successfully");
    } else {
      setPricingRules(prev => [...prev, rule]);
      toast.success("Pricing rule created successfully");
    }

    setIsDialogOpen(false);
    setEditingRule(null);
    setNewRule({
      name: "",
      type: "quantity",
      active: true,
      priority: 1,
      conditions: {},
      discount: { type: "percentage", value: 0 }
    });
  };

  const handleEditRule = (rule: PricingRule) => {
    setEditingRule(rule);
    setNewRule(rule);
    setIsDialogOpen(true);
  };

  const handleDeleteRule = (ruleId: string) => {
    setPricingRules(prev => prev.filter(r => r.id !== ruleId));
    toast.success("Pricing rule deleted successfully");
  };

  const toggleRuleStatus = (ruleId: string) => {
    setPricingRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, active: !rule.active } : rule
    ));
    toast.success("Rule status updated");
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "quantity": return <DollarSign className="h-4 w-4" />;
      case "customer": return <Users className="h-4 w-4" />;
      case "seasonal": return <Calendar className="h-4 w-4" />;
      default: return <Percent className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "quantity": return "bg-blue-100 text-blue-800";
      case "customer": return "bg-green-100 text-green-800";
      case "seasonal": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Advanced Pricing Rules</h1>
          <p className="text-muted-foreground">
            Create and manage automated pricing strategies
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Pricing Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingRule ? "Edit Pricing Rule" : "Create New Pricing Rule"}
              </DialogTitle>
              <DialogDescription>
                Set up automated pricing rules based on quantity, customer groups, or seasonal conditions
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rule-name">Rule Name</Label>
                  <Input
                    id="rule-name"
                    value={newRule.name || ""}
                    onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter rule name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rule-type">Rule Type</Label>
                  <Select 
                    value={newRule.type} 
                    onValueChange={(value) => setNewRule(prev => ({ ...prev, type: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select rule type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quantity">Quantity Based</SelectItem>
                      <SelectItem value="customer">Customer Based</SelectItem>
                      <SelectItem value="seasonal">Seasonal/Date Based</SelectItem>
                      <SelectItem value="markup">Markup Rule</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount-type">Discount Type</Label>
                  <Select 
                    value={newRule.discount?.type} 
                    onValueChange={(value) => setNewRule(prev => ({ 
                      ...prev, 
                      discount: { ...prev.discount!, type: value as any }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select discount type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount-value">Discount Value</Label>
                  <Input
                    id="discount-value"
                    type="number"
                    value={newRule.discount?.value || 0}
                    onChange={(e) => setNewRule(prev => ({ 
                      ...prev, 
                      discount: { ...prev.discount!, value: Number(e.target.value) }
                    }))}
                    placeholder="Enter discount value"
                  />
                </div>
              </div>

              {newRule.type === "quantity" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min-quantity">Minimum Quantity</Label>
                    <Input
                      id="min-quantity"
                      type="number"
                      value={newRule.conditions?.minQuantity || ""}
                      onChange={(e) => setNewRule(prev => ({ 
                        ...prev, 
                        conditions: { 
                          ...prev.conditions, 
                          minQuantity: Number(e.target.value) 
                        }
                      }))}
                      placeholder="Minimum quantity"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-quantity">Maximum Quantity (Optional)</Label>
                    <Input
                      id="max-quantity"
                      type="number"
                      value={newRule.conditions?.maxQuantity || ""}
                      onChange={(e) => setNewRule(prev => ({ 
                        ...prev, 
                        conditions: { 
                          ...prev.conditions, 
                          maxQuantity: Number(e.target.value) 
                        }
                      }))}
                      placeholder="Maximum quantity"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="rule-active"
                  checked={newRule.active}
                  onCheckedChange={(checked) => setNewRule(prev => ({ ...prev, active: checked }))}
                />
                <Label htmlFor="rule-active">Active Rule</Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveRule}>
                {editingRule ? "Update Rule" : "Create Rule"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules">Pricing Rules</TabsTrigger>
          <TabsTrigger value="analytics">Price Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle>Active Pricing Rules</CardTitle>
              <CardDescription>
                Manage your automated pricing strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rule Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pricingRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell>
                        <Badge className={`${getTypeColor(rule.type)} flex items-center gap-1 w-fit`}>
                          {getTypeIcon(rule.type)}
                          {rule.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {rule.discount.type === "percentage" ? `${rule.discount.value}%` : `$${rule.discount.value}`}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={rule.active}
                          onCheckedChange={() => toggleRuleStatus(rule.id)}
                        />
                      </TableCell>
                      <TableCell>{rule.priority}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditRule(rule)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRule(rule.id)}
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
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Rules Applied</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-sm text-muted-foreground">This month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Revenue Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+$15,432</div>
                <p className="text-sm text-muted-foreground">Increased revenue</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Average Discount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.3%</div>
                <p className="text-sm text-muted-foreground">Applied discount</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Settings</CardTitle>
              <CardDescription>Configure global pricing preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Auto-apply quantity discounts</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically apply quantity-based pricing rules
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Customer-specific pricing</h3>
                  <p className="text-sm text-muted-foreground">
                    Enable customer group pricing rules
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Price change notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Notify when pricing rules are applied
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};