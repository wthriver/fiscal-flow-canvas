
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCompany } from "@/contexts/CompanyContext";
import { Lead, Customer } from "@/types/company";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  TrendingUp,
  DollarSign,
  UserPlus,
  Search,
  Plus,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  Edit,
  Trash,
} from "lucide-react";

const leadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone is required"),
  company: z.string().min(1, "Company is required"),
  value: z.number().min(0, "Value must be positive"),
  stage: z.enum(["New", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"]),
  source: z.string().min(1, "Source is required"),
  assignedTo: z.string().min(1, "Assigned to is required"),
  notes: z.string().optional(),
});

export const CRMDashboard: React.FC = () => {
  const { currentCompany, addCustomer } = useCompany();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("leads");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLeadDialogOpen, setIsLeadDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [leads, setLeads] = useState<Lead[]>(currentCompany?.leads || [
    {
      id: "lead-1",
      name: "John Smith",
      email: "john@example.com",
      phone: "+1-555-0123",
      company: "ABC Corp",
      value: 15000,
      stage: "Qualified",
      source: "Website",
      assignedTo: "Sales Rep 1",
      lastContact: "2024-01-15",
      nextFollowUp: "2024-01-22",
      notes: "Interested in our premium package",
      score: 85
    },
    {
      id: "lead-2",
      name: "Sarah Johnson",
      email: "sarah@techstart.com",
      phone: "+1-555-0124",
      company: "TechStart Inc",
      value: 25000,
      stage: "Proposal",
      source: "Referral",
      assignedTo: "Sales Rep 2",
      lastContact: "2024-01-18",
      nextFollowUp: "2024-01-25",
      notes: "Enterprise solution required",
      score: 92
    }
  ]);

  const customers = currentCompany?.customers || [];

  const form = useForm<z.infer<typeof leadSchema>>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      value: 0,
      stage: "New",
      source: "",
      assignedTo: "",
      notes: "",
    },
  });

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.company && customer.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const generateLeadId = () => `lead-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

  const handleCreateLead = (data: z.infer<typeof leadSchema>) => {
    const newLead: Lead = {
      id: editingLead?.id || generateLeadId(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      value: data.value,
      stage: data.stage,
      source: data.source,
      assignedTo: data.assignedTo,
      lastContact: new Date().toISOString().split('T')[0],
      nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: data.notes || "",
      score: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
    };

    if (editingLead) {
      setLeads(prev => prev.map(lead => lead.id === editingLead.id ? newLead : lead));
      toast({
        title: "Lead Updated",
        description: "Lead has been updated successfully.",
      });
    } else {
      setLeads(prev => [...prev, newLead]);
      toast({
        title: "Lead Created",
        description: "New lead has been created successfully.",
      });
    }

    setIsLeadDialogOpen(false);
    setEditingLead(null);
    form.reset();
  };

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    form.reset({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      value: lead.value,
      stage: lead.stage,
      source: lead.source,
      assignedTo: lead.assignedTo,
      notes: lead.notes || "",
    });
    setIsLeadDialogOpen(true);
  };

  const handleDeleteLead = (leadId: string) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      setLeads(prev => prev.filter(lead => lead.id !== leadId));
      toast({
        title: "Lead Deleted",
        description: "Lead has been deleted successfully.",
      });
    }
  };

  const handleConvertToCustomer = (lead: Lead) => {
    const newCustomer: Customer = {
      id: `cust-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: lead.company,
      contactName: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      type: "Business",
      status: "Active",
      customerSince: new Date().toISOString().split('T')[0],
    };

    addCustomer(newCustomer);
    handleDeleteLead(lead.id);
    
    toast({
      title: "Lead Converted",
      description: `${lead.name} has been converted to a customer.`,
    });
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      "New": "bg-blue-100 text-blue-800",
      "Qualified": "bg-yellow-100 text-yellow-800",
      "Proposal": "bg-purple-100 text-purple-800",
      "Negotiation": "bg-orange-100 text-orange-800",
      "Closed Won": "bg-green-100 text-green-800",
      "Closed Lost": "bg-red-100 text-red-800",
    };
    return colors[stage] || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      "Active": "bg-green-100 text-green-800",
      "Inactive": "bg-gray-100 text-gray-800",
      "Lead": "bg-blue-100 text-blue-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  // Calculate stats
  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter(lead => lead.stage === "Qualified" || lead.stage === "Proposal" || lead.stage === "Negotiation").length;
  const totalPipelineValue = leads.reduce((sum, lead) => sum + lead.value, 0);
  const conversionRate = customers.length > 0 ? ((customers.length / (customers.length + totalLeads)) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">CRM Dashboard</h1>
          <p className="text-muted-foreground">Manage your leads, customers, and sales pipeline</p>
        </div>
        <Button onClick={() => setIsLeadDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Lead
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-xl font-semibold">{totalLeads}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Qualified Leads</p>
                <p className="text-xl font-semibold">{qualifiedLeads}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pipeline Value</p>
                <p className="text-xl font-semibold">${totalPipelineValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-xl font-semibold">{conversionRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads and customers..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="leads">Leads ({totalLeads})</TabsTrigger>
          <TabsTrigger value="customers">Customers ({customers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lead Pipeline</CardTitle>
              <CardDescription>Manage and track your sales leads</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Next Follow-up</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.length > 0 ? (
                    filteredLeads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.name}</TableCell>
                        <TableCell>{lead.company}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              <span className="text-xs">{lead.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <span className="text-xs">{lead.phone}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>${lead.value.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={getStageColor(lead.stage)}>{lead.stage}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <div className="w-8 h-2 bg-gray-200 rounded-full">
                              <div 
                                className="h-2 bg-blue-500 rounded-full" 
                                style={{ width: `${lead.score}%` }}
                              />
                            </div>
                            <span className="text-xs">{lead.score}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span className="text-xs">{lead.nextFollowUp}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditLead(lead)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Lead
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleConvertToCustomer(lead)}>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Convert to Customer
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteLead(lead.id)}
                                className="text-red-600"
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                Delete Lead
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        No leads found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer List</CardTitle>
              <CardDescription>View and manage your customers</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Customer Since</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>{customer.contactName || 'N/A'}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.phone || 'N/A'}</TableCell>
                        <TableCell>{customer.type}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(customer.status || 'Active')}>
                            {customer.status || 'Active'}
                          </Badge>
                        </TableCell>
                        <TableCell>{customer.customerSince || 'N/A'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No customers found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Lead Dialog */}
      <Dialog open={isLeadDialogOpen} onOpenChange={setIsLeadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingLead ? 'Edit Lead' : 'Create New Lead'}</DialogTitle>
            <DialogDescription>
              {editingLead ? 'Update the lead information' : 'Fill in the lead details to add them to your pipeline'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateLead)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Contact name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Company name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="email@example.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Phone number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Value *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          min="0"
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          placeholder="0" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="stage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stage *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select stage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Qualified">Qualified</SelectItem>
                          <SelectItem value="Proposal">Proposal</SelectItem>
                          <SelectItem value="Negotiation">Negotiation</SelectItem>
                          <SelectItem value="Closed Won">Closed Won</SelectItem>
                          <SelectItem value="Closed Lost">Closed Lost</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Website, Referral, Cold Call" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="assignedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned To *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Sales representative" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Additional notes about this lead..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsLeadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingLead ? 'Update Lead' : 'Create Lead'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
