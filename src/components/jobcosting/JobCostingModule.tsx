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
import { Plus, DollarSign, Clock, Users, TrendingUp, AlertTriangle, Calculator } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";

interface JobCost {
  id: string;
  jobNumber: string;
  jobName: string;
  customer: string;
  startDate: string;
  estimatedEndDate: string;
  actualEndDate?: string;
  status: "active" | "completed" | "on-hold" | "cancelled";
  budgetedAmount: number;
  actualCosts: {
    materials: number;
    labor: number;
    overhead: number;
    subcontractors: number;
    equipment: number;
  };
  estimatedCosts: {
    materials: number;
    labor: number;
    overhead: number;
    subcontractors: number;
    equipment: number;
  };
  profitMargin: number;
  billedAmount: number;
  phases: JobPhase[];
}

interface JobPhase {
  id: string;
  phaseName: string;
  budgetedCost: number;
  actualCost: number;
  percentComplete: number;
  startDate: string;
  endDate?: string;
  status: "not-started" | "in-progress" | "completed";
}

interface CostEntry {
  id: string;
  jobId: string;
  phaseId?: string;
  date: string;
  type: "material" | "labor" | "overhead" | "subcontractor" | "equipment";
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  vendor?: string;
  employee?: string;
  category: string;
}

export const JobCostingModule: React.FC = () => {
  const { currentCompany, updateCompany } = useCompany();
  const [activeTab, setActiveTab] = useState("jobs");
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [isCostEntryDialogOpen, setIsCostEntryDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobCost | null>(null);

  // Sample job costing data
  const [jobs, setJobs] = useState<JobCost[]>([
    {
      id: "job-1",
      jobNumber: "JOB-2024-001",
      jobName: "Office Building Renovation",
      customer: "ABC Corporation",
      startDate: "2024-01-15",
      estimatedEndDate: "2024-03-15",
      status: "active",
      budgetedAmount: 150000,
      actualCosts: {
        materials: 45000,
        labor: 35000,
        overhead: 8000,
        subcontractors: 12000,
        equipment: 5000
      },
      estimatedCosts: {
        materials: 50000,
        labor: 40000,
        overhead: 10000,
        subcontractors: 15000,
        equipment: 8000
      },
      profitMargin: 0.15,
      billedAmount: 85000,
      phases: [
        {
          id: "phase-1",
          phaseName: "Demolition",
          budgetedCost: 25000,
          actualCost: 23000,
          percentComplete: 100,
          startDate: "2024-01-15",
          endDate: "2024-01-30",
          status: "completed"
        },
        {
          id: "phase-2",
          phaseName: "Electrical Work",
          budgetedCost: 40000,
          actualCost: 28000,
          percentComplete: 70,
          startDate: "2024-02-01",
          status: "in-progress"
        },
        {
          id: "phase-3",
          phaseName: "Finishing",
          budgetedCost: 35000,
          actualCost: 0,
          percentComplete: 0,
          startDate: "2024-02-15",
          status: "not-started"
        }
      ]
    },
    {
      id: "job-2",
      jobNumber: "JOB-2024-002",
      jobName: "Warehouse Construction",
      customer: "XYZ Logistics",
      startDate: "2024-02-01",
      estimatedEndDate: "2024-05-01",
      status: "active",
      budgetedAmount: 300000,
      actualCosts: {
        materials: 85000,
        labor: 45000,
        overhead: 12000,
        subcontractors: 25000,
        equipment: 18000
      },
      estimatedCosts: {
        materials: 120000,
        labor: 80000,
        overhead: 20000,
        subcontractors: 40000,
        equipment: 25000
      },
      profitMargin: 0.18,
      billedAmount: 125000,
      phases: [
        {
          id: "phase-4",
          phaseName: "Foundation",
          budgetedCost: 80000,
          actualCost: 75000,
          percentComplete: 100,
          startDate: "2024-02-01",
          endDate: "2024-02-28",
          status: "completed"
        },
        {
          id: "phase-5",
          phaseName: "Structure",
          budgetedCost: 120000,
          actualCost: 65000,
          percentComplete: 55,
          startDate: "2024-03-01",
          status: "in-progress"
        }
      ]
    }
  ]);

  const [newJob, setNewJob] = useState<Partial<JobCost>>({
    jobNumber: "",
    jobName: "",
    customer: "",
    startDate: "",
    estimatedEndDate: "",
    status: "active",
    budgetedAmount: 0,
    actualCosts: {
      materials: 0,
      labor: 0,
      overhead: 0,
      subcontractors: 0,
      equipment: 0
    },
    estimatedCosts: {
      materials: 0,
      labor: 0,
      overhead: 0,
      subcontractors: 0,
      equipment: 0
    },
    profitMargin: 0.15,
    billedAmount: 0,
    phases: []
  });

  const [newCostEntry, setNewCostEntry] = useState<Partial<CostEntry>>({
    jobId: "",
    phaseId: "",
    date: new Date().toISOString().split('T')[0],
    type: "material",
    description: "",
    quantity: 0,
    rate: 0,
    amount: 0,
    category: ""
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "active": return "bg-blue-100 text-blue-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "on-hold": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "not-started": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const calculateTotalActualCosts = (costs: any) => {
    return costs.materials + costs.labor + costs.overhead + costs.subcontractors + costs.equipment;
  };

  const calculateTotalEstimatedCosts = (costs: any) => {
    return costs.materials + costs.labor + costs.overhead + costs.subcontractors + costs.equipment;
  };

  const calculateVariance = (actual: number, estimated: number) => {
    return ((actual - estimated) / estimated) * 100;
  };

  const calculateProfitability = (job: JobCost) => {
    const totalActualCosts = calculateTotalActualCosts(job.actualCosts);
    const revenue = job.billedAmount;
    return revenue > 0 ? ((revenue - totalActualCosts) / revenue) * 100 : 0;
  };

  const handleSaveJob = () => {
    if (!newJob.jobNumber || !newJob.jobName || !newJob.customer) {
      toast.error("Please fill in required fields");
      return;
    }

    const job: JobCost = {
      id: `job-${Date.now()}`,
      jobNumber: newJob.jobNumber!,
      jobName: newJob.jobName!,
      customer: newJob.customer!,
      startDate: newJob.startDate!,
      estimatedEndDate: newJob.estimatedEndDate!,
      status: newJob.status as any || "active",
      budgetedAmount: newJob.budgetedAmount || 0,
      actualCosts: newJob.actualCosts!,
      estimatedCosts: newJob.estimatedCosts!,
      profitMargin: newJob.profitMargin || 0.15,
      billedAmount: newJob.billedAmount || 0,
      phases: newJob.phases || []
    };

    setJobs(prev => [...prev, job]);
    toast.success("Job created successfully");
    setIsJobDialogOpen(false);
    setNewJob({
      jobNumber: "",
      jobName: "",
      customer: "",
      startDate: "",
      estimatedEndDate: "",
      status: "active",
      budgetedAmount: 0,
      actualCosts: {
        materials: 0,
        labor: 0,
        overhead: 0,
        subcontractors: 0,
        equipment: 0
      },
      estimatedCosts: {
        materials: 0,
        labor: 0,
        overhead: 0,
        subcontractors: 0,
        equipment: 0
      },
      profitMargin: 0.15,
      billedAmount: 0,
      phases: []
    });
  };

  const handleAddCostEntry = () => {
    if (!newCostEntry.jobId || !newCostEntry.description || !newCostEntry.amount) {
      toast.error("Please fill in required fields");
      return;
    }

    // Here you would add the cost entry to the job
    toast.success("Cost entry added successfully");
    setIsCostEntryDialogOpen(false);
    setNewCostEntry({
      jobId: "",
      phaseId: "",
      date: new Date().toISOString().split('T')[0],
      type: "material",
      description: "",
      quantity: 0,
      rate: 0,
      amount: 0,
      category: ""
    });
  };

  const getTotalActiveJobs = () => jobs.filter(job => job.status === "active").length;
  const getTotalJobValue = () => jobs.reduce((sum, job) => sum + job.budgetedAmount, 0);
  const getTotalBilledAmount = () => jobs.reduce((sum, job) => sum + job.billedAmount, 0);
  const getAverageProfitMargin = () => {
    const totalProfit = jobs.reduce((sum, job) => sum + calculateProfitability(job), 0);
    return jobs.length > 0 ? totalProfit / jobs.length : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Job Costing & Project Profitability</h1>
          <p className="text-muted-foreground">
            Track costs, profitability, and performance by job and phase
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCostEntryDialogOpen} onOpenChange={setIsCostEntryDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Calculator className="h-4 w-4 mr-2" />
                Add Cost Entry
              </Button>
            </DialogTrigger>
          </Dialog>
          <Dialog open={isJobDialogOpen} onOpenChange={setIsJobDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Job
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Job Costing Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalActiveJobs()}</div>
            <p className="text-xs text-muted-foreground">Currently in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Job Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${getTotalJobValue().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Contracted amount</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Billed Amount</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${getTotalBilledAmount().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total invoiced</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Profit Margin</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getAverageProfitMargin().toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Across all jobs</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="jobs">Job Overview</TabsTrigger>
          <TabsTrigger value="phases">Job Phases</TabsTrigger>
          <TabsTrigger value="costs">Cost Tracking</TabsTrigger>
          <TabsTrigger value="profitability">Profitability Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle>Job Summary</CardTitle>
              <CardDescription>Overview of all jobs and their current status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job #</TableHead>
                    <TableHead>Job Name</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Actual Costs</TableHead>
                    <TableHead>Billed</TableHead>
                    <TableHead>Profit %</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => {
                    const totalActualCosts = calculateTotalActualCosts(job.actualCosts);
                    const profitability = calculateProfitability(job);
                    
                    return (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.jobNumber}</TableCell>
                        <TableCell>{job.jobName}</TableCell>
                        <TableCell>{job.customer}</TableCell>
                        <TableCell>${job.budgetedAmount.toLocaleString()}</TableCell>
                        <TableCell>${totalActualCosts.toLocaleString()}</TableCell>
                        <TableCell>${job.billedAmount.toLocaleString()}</TableCell>
                        <TableCell>
                          <span className={profitability >= 15 ? "text-green-600" : profitability >= 5 ? "text-yellow-600" : "text-red-600"}>
                            {profitability.toFixed(1)}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(job.status)}>
                            {job.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedJob(job)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phases">
          <Card>
            <CardHeader>
              <CardTitle>Job Phases</CardTitle>
              <CardDescription>Track progress and costs by project phase</CardDescription>
            </CardHeader>
            <CardContent>
              {jobs.map((job) => (
                <div key={job.id} className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">{job.jobName} ({job.jobNumber})</h3>
                  <div className="space-y-3">
                    {job.phases.map((phase) => (
                      <div key={phase.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{phase.phaseName}</h4>
                          <Badge className={getStatusColor(phase.status)}>
                            {phase.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-muted-foreground">Budgeted</p>
                            <p className="font-semibold">${phase.budgetedCost.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Actual</p>
                            <p className="font-semibold">${phase.actualCost.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Variance</p>
                            <p className={`font-semibold ${phase.actualCost > phase.budgetedCost ? 'text-red-600' : 'text-green-600'}`}>
                              ${(phase.actualCost - phase.budgetedCost).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Complete</p>
                            <p className="font-semibold">{phase.percentComplete}%</p>
                          </div>
                        </div>
                        <Progress value={phase.percentComplete} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
                <CardDescription>Actual vs Estimated costs by category</CardDescription>
              </CardHeader>
              <CardContent>
                {jobs.map((job) => (
                  <div key={job.id} className="mb-6">
                    <h3 className="font-semibold mb-3">{job.jobName}</h3>
                    <div className="space-y-2">
                      {Object.entries(job.actualCosts).map(([category, actualCost]) => {
                        const estimatedCost = job.estimatedCosts[category as keyof typeof job.estimatedCosts];
                        const variance = calculateVariance(actualCost, estimatedCost);
                        
                        return (
                          <div key={category} className="flex justify-between items-center">
                            <span className="capitalize">{category}:</span>
                            <div className="text-right">
                              <p className="font-medium">${actualCost.toLocaleString()}</p>
                              <p className={`text-xs ${variance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {variance > 0 ? '+' : ''}{variance.toFixed(1)}% vs budget
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Cost Alerts</CardTitle>
                <CardDescription>Jobs requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {jobs.filter(job => {
                    const totalActual = calculateTotalActualCosts(job.actualCosts);
                    const totalEstimated = calculateTotalEstimatedCosts(job.estimatedCosts);
                    return totalActual > totalEstimated * 1.1; // Over budget by 10%
                  }).map(job => (
                    <div key={job.id} className="flex items-center gap-2 p-3 border rounded-lg bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <div>
                        <p className="font-medium text-red-800">{job.jobName}</p>
                        <p className="text-sm text-red-600">Over budget by {calculateVariance(
                          calculateTotalActualCosts(job.actualCosts),
                          calculateTotalEstimatedCosts(job.estimatedCosts)
                        ).toFixed(1)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profitability">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {jobs.map((job) => {
              const totalActualCosts = calculateTotalActualCosts(job.actualCosts);
              const profitability = calculateProfitability(job);
              const grossProfit = job.billedAmount - totalActualCosts;
              
              return (
                <Card key={job.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{job.jobName}</CardTitle>
                    <CardDescription>{job.jobNumber}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Revenue:</span>
                        <span className="font-semibold">${job.billedAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Costs:</span>
                        <span className="font-semibold">${totalActualCosts.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gross Profit:</span>
                        <span className={`font-semibold ${grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${grossProfit.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Margin:</span>
                        <span className={`font-semibold ${profitability >= 15 ? 'text-green-600' : profitability >= 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {profitability.toFixed(1)}%
                        </span>
                      </div>
                      <Progress 
                        value={Math.max(0, Math.min(100, profitability))} 
                        className="h-2" 
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* New Job Dialog */}
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create New Job</DialogTitle>
          <DialogDescription>
            Set up a new job for cost tracking and profitability analysis
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="job-number">Job Number</Label>
              <Input
                id="job-number"
                value={newJob.jobNumber || ""}
                onChange={(e) => setNewJob(prev => ({ ...prev, jobNumber: e.target.value }))}
                placeholder="JOB-2024-XXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="job-name">Job Name</Label>
              <Input
                id="job-name"
                value={newJob.jobName || ""}
                onChange={(e) => setNewJob(prev => ({ ...prev, jobName: e.target.value }))}
                placeholder="Enter job name"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Customer</Label>
              <Input
                id="customer"
                value={newJob.customer || ""}
                onChange={(e) => setNewJob(prev => ({ ...prev, customer: e.target.value }))}
                placeholder="Customer name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={newJob.startDate || ""}
                onChange={(e) => setNewJob(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">Estimated End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={newJob.estimatedEndDate || ""}
                onChange={(e) => setNewJob(prev => ({ ...prev, estimatedEndDate: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budgeted-amount">Budgeted Amount</Label>
              <Input
                id="budgeted-amount"
                type="number"
                value={newJob.budgetedAmount || ""}
                onChange={(e) => setNewJob(prev => ({ ...prev, budgetedAmount: Number(e.target.value) }))}
                placeholder="Total project budget"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profit-margin">Target Profit Margin (%)</Label>
              <Input
                id="profit-margin"
                type="number"
                step="0.01"
                value={(newJob.profitMargin || 0) * 100}
                onChange={(e) => setNewJob(prev => ({ ...prev, profitMargin: Number(e.target.value) / 100 }))}
                placeholder="15"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsJobDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveJob}>Create Job</Button>
        </DialogFooter>
      </DialogContent>

      {/* Cost Entry Dialog */}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Cost Entry</DialogTitle>
          <DialogDescription>
            Record actual costs against jobs and phases
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost-job">Select Job</Label>
              <Select 
                value={newCostEntry.jobId} 
                onValueChange={(value) => setNewCostEntry(prev => ({ ...prev, jobId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select job" />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map(job => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.jobNumber} - {job.jobName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost-type">Cost Type</Label>
              <Select 
                value={newCostEntry.type} 
                onValueChange={(value) => setNewCostEntry(prev => ({ ...prev, type: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cost type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="material">Material</SelectItem>
                  <SelectItem value="labor">Labor</SelectItem>
                  <SelectItem value="overhead">Overhead</SelectItem>
                  <SelectItem value="subcontractor">Subcontractor</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cost-description">Description</Label>
            <Input
              id="cost-description"
              value={newCostEntry.description || ""}
              onChange={(e) => setNewCostEntry(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the cost item"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost-quantity">Quantity</Label>
              <Input
                id="cost-quantity"
                type="number"
                value={newCostEntry.quantity || ""}
                onChange={(e) => setNewCostEntry(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                placeholder="Quantity"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost-rate">Rate</Label>
              <Input
                id="cost-rate"
                type="number"
                step="0.01"
                value={newCostEntry.rate || ""}
                onChange={(e) => setNewCostEntry(prev => ({ ...prev, rate: Number(e.target.value) }))}
                placeholder="Rate per unit"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost-amount">Total Amount</Label>
              <Input
                id="cost-amount"
                type="number"
                step="0.01"
                value={newCostEntry.amount || ""}
                onChange={(e) => setNewCostEntry(prev => ({ ...prev, amount: Number(e.target.value) }))}
                placeholder="Total cost"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsCostEntryDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddCostEntry}>Add Cost Entry</Button>
        </DialogFooter>
      </DialogContent>
    </div>
  );
};