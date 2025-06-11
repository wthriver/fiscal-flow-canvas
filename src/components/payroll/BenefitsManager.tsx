
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Heart, Shield, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface BenefitPlan {
  id: string;
  name: string;
  type: 'health' | 'dental' | 'vision' | '401k' | 'life' | 'disability';
  provider: string;
  employeeCost: number;
  employerCost: number;
  description: string;
  eligibilityDays: number;
  status: 'active' | 'inactive';
}

interface EmployeeBenefit {
  id: string;
  employeeId: string;
  employeeName: string;
  planId: string;
  planName: string;
  enrollmentDate: string;
  status: 'enrolled' | 'pending' | 'declined';
  contribution?: number;
}

export const BenefitsManager: React.FC = () => {
  const [plans, setPlans] = useState<BenefitPlan[]>([
    {
      id: '1',
      name: 'Premium Health Plan',
      type: 'health',
      provider: 'Blue Cross Blue Shield',
      employeeCost: 200,
      employerCost: 800,
      description: 'Comprehensive health coverage with low deductibles',
      eligibilityDays: 30,
      status: 'active'
    },
    {
      id: '2',
      name: 'Company 401(k)',
      type: '401k',
      provider: 'Fidelity',
      employeeCost: 0,
      employerCost: 0,
      description: '6% employer match, immediate vesting',
      eligibilityDays: 90,
      status: 'active'
    }
  ]);

  const [enrollments] = useState<EmployeeBenefit[]>([
    {
      id: '1',
      employeeId: 'emp1',
      employeeName: 'John Smith',
      planId: '1',
      planName: 'Premium Health Plan',
      enrollmentDate: '2024-01-15',
      status: 'enrolled',
      contribution: 200
    }
  ]);

  const [newPlan, setNewPlan] = useState<Partial<BenefitPlan>>({
    type: 'health',
    status: 'active'
  });

  const addPlan = () => {
    if (!newPlan.name || !newPlan.provider) {
      toast.error("Please fill in all required fields");
      return;
    }

    const plan: BenefitPlan = {
      id: Date.now().toString(),
      name: newPlan.name!,
      type: newPlan.type || 'health',
      provider: newPlan.provider!,
      employeeCost: newPlan.employeeCost || 0,
      employerCost: newPlan.employerCost || 0,
      description: newPlan.description || '',
      eligibilityDays: newPlan.eligibilityDays || 30,
      status: 'active'
    };

    setPlans([...plans, plan]);
    setNewPlan({ type: 'health', status: 'active' });
    toast.success("Benefit plan added successfully");
  };

  const deletePlan = (id: string) => {
    setPlans(plans.filter(plan => plan.id !== id));
    toast.success("Benefit plan deleted successfully");
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'health':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'dental':
      case 'vision':
        return <Shield className="h-4 w-4 text-blue-500" />;
      case '401k':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      default:
        return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? 
      <Badge className="bg-green-100 text-green-800">Active</Badge> : 
      <Badge variant="outline">Inactive</Badge>;
  };

  const getTotalCosts = () => {
    const employeeCosts = enrollments.reduce((sum, enrollment) => sum + (enrollment.contribution || 0), 0);
    const employerCosts = plans.reduce((sum, plan) => {
      const enrolledCount = enrollments.filter(e => e.planId === plan.id && e.status === 'enrolled').length;
      return sum + (plan.employerCost * enrolledCount);
    }, 0);
    
    return { employeeCosts, employerCosts };
  };

  const costs = getTotalCosts();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Benefits Management</h2>
          <p className="text-muted-foreground">Manage employee benefits, health insurance, and retirement plans</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Benefit Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Benefit Plan</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Plan Name *</Label>
                <Input
                  value={newPlan.name || ''}
                  onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                  placeholder="Enter plan name"
                />
              </div>
              <div>
                <Label>Type</Label>
                <Select 
                  value={newPlan.type || 'health'} 
                  onValueChange={(value: any) => setNewPlan({ ...newPlan, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="health">Health Insurance</SelectItem>
                    <SelectItem value="dental">Dental Insurance</SelectItem>
                    <SelectItem value="vision">Vision Insurance</SelectItem>
                    <SelectItem value="401k">401(k) Plan</SelectItem>
                    <SelectItem value="life">Life Insurance</SelectItem>
                    <SelectItem value="disability">Disability Insurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Provider *</Label>
                <Input
                  value={newPlan.provider || ''}
                  onChange={(e) => setNewPlan({ ...newPlan, provider: e.target.value })}
                  placeholder="Enter provider name"
                />
              </div>
              <div>
                <Label>Eligibility (Days)</Label>
                <Input
                  type="number"
                  value={newPlan.eligibilityDays || ''}
                  onChange={(e) => setNewPlan({ ...newPlan, eligibilityDays: parseInt(e.target.value) || 0 })}
                  placeholder="30"
                />
              </div>
              <div>
                <Label>Employee Monthly Cost</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newPlan.employeeCost || ''}
                  onChange={(e) => setNewPlan({ ...newPlan, employeeCost: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label>Employer Monthly Cost</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newPlan.employerCost || ''}
                  onChange={(e) => setNewPlan({ ...newPlan, employerCost: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Description</Label>
                <Input
                  value={newPlan.description || ''}
                  onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                  placeholder="Enter plan description"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline">Cancel</Button>
              <Button onClick={addPlan}>Add Plan</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active Plans</p>
                <p className="text-2xl font-bold">{plans.filter(p => p.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Monthly Employee Costs</p>
                <p className="text-2xl font-bold">${costs.employeeCosts.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Monthly Employer Costs</p>
                <p className="text-2xl font-bold">${costs.employerCosts.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Benefit Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Employee Cost</TableHead>
                <TableHead>Employer Cost</TableHead>
                <TableHead>Eligibility</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(plan.type)}
                      {plan.name}
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{plan.type}</TableCell>
                  <TableCell>{plan.provider}</TableCell>
                  <TableCell>${plan.employeeCost}/mo</TableCell>
                  <TableCell>${plan.employerCost}/mo</TableCell>
                  <TableCell>{plan.eligibilityDays} days</TableCell>
                  <TableCell>{getStatusBadge(plan.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deletePlan(plan.id)}
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

      <Card>
        <CardHeader>
          <CardTitle>Employee Enrollments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Enrollment Date</TableHead>
                <TableHead>Monthly Contribution</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollments.map((enrollment) => (
                <TableRow key={enrollment.id}>
                  <TableCell className="font-medium">{enrollment.employeeName}</TableCell>
                  <TableCell>{enrollment.planName}</TableCell>
                  <TableCell>{new Date(enrollment.enrollmentDate).toLocaleDateString()}</TableCell>
                  <TableCell>${enrollment.contribution || 0}</TableCell>
                  <TableCell>
                    <Badge variant={enrollment.status === 'enrolled' ? 'default' : 'secondary'}>
                      {enrollment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
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
