
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, DollarSign, TrendingUp, Phone, Mail, Plus } from "lucide-react";
import { toast } from "sonner";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  value: number;
  stage: "New" | "Qualified" | "Proposal" | "Negotiation" | "Closed Won" | "Closed Lost";
  source: string;
  assignedTo: string;
  lastContact: string;
}

interface Opportunity {
  id: string;
  name: string;
  customer: string;
  value: number;
  probability: number;
  stage: string;
  closeDate: string;
  description: string;
}

export const CRMDashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "lead-1",
      name: "John Smith",
      email: "john@example.com",
      phone: "(555) 123-4567",
      company: "Tech Corp",
      value: 15000,
      stage: "Qualified",
      source: "Website",
      assignedTo: "Sales Rep 1",
      lastContact: "2025-05-22"
    },
    {
      id: "lead-2",
      name: "Sarah Johnson",
      email: "sarah@businessinc.com",
      phone: "(555) 987-6543",
      company: "Business Inc",
      value: 25000,
      stage: "Proposal",
      source: "Referral",
      assignedTo: "Sales Rep 2",
      lastContact: "2025-05-21"
    }
  ]);

  const [opportunities, setOpportunities] = useState<Opportunity[]>([
    {
      id: "opp-1",
      name: "Enterprise Software Deal",
      customer: "Tech Corp",
      value: 50000,
      probability: 75,
      stage: "Negotiation",
      closeDate: "2025-06-15",
      description: "Large enterprise software implementation"
    },
    {
      id: "opp-2",
      name: "Consulting Project",
      customer: "Business Inc",
      value: 30000,
      probability: 60,
      stage: "Proposal",
      closeDate: "2025-07-01",
      description: "6-month consulting engagement"
    }
  ]);

  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    value: "",
    source: "",
    assignedTo: ""
  });

  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);

  const handleCreateLead = () => {
    if (!newLead.name || !newLead.email) {
      toast.error("Please fill in required fields");
      return;
    }

    const lead: Lead = {
      id: `lead-${Date.now()}`,
      name: newLead.name,
      email: newLead.email,
      phone: newLead.phone,
      company: newLead.company,
      value: parseFloat(newLead.value) || 0,
      stage: "New",
      source: newLead.source,
      assignedTo: newLead.assignedTo,
      lastContact: new Date().toISOString().split('T')[0]
    };

    setLeads(prev => [lead, ...prev]);
    setNewLead({
      name: "",
      email: "",
      phone: "",
      company: "",
      value: "",
      source: "",
      assignedTo: ""
    });
    setIsNewLeadOpen(false);
    toast.success("Lead created successfully");
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "New": return "secondary";
      case "Qualified": return "default";
      case "Proposal": return "default";
      case "Negotiation": return "default";
      case "Closed Won": return "default";
      case "Closed Lost": return "destructive";
      default: return "secondary";
    }
  };

  const totalLeadValue = leads.reduce((sum, lead) => sum + lead.value, 0);
  const totalOpportunityValue = opportunities.reduce((sum, opp) => sum + opp.value, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">CRM Dashboard</h2>
          <p className="text-muted-foreground">Manage leads, opportunities, and customer relationships</p>
        </div>
        <Dialog open={isNewLeadOpen} onOpenChange={setIsNewLeadOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Lead
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Lead</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={newLead.name}
                    onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newLead.email}
                    onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={newLead.company}
                    onChange={(e) => setNewLead({...newLead, company: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="value">Potential Value</Label>
                  <Input
                    id="value"
                    type="number"
                    value={newLead.value}
                    onChange={(e) => setNewLead({...newLead, value: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="source">Source</Label>
                  <Select value={newLead.source} onValueChange={(value) => setNewLead({...newLead, source: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Website">Website</SelectItem>
                      <SelectItem value="Referral">Referral</SelectItem>
                      <SelectItem value="Cold Call">Cold Call</SelectItem>
                      <SelectItem value="Social Media">Social Media</SelectItem>
                      <SelectItem value="Trade Show">Trade Show</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleCreateLead} className="w-full">
                Create Lead
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-xl font-semibold">{leads.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Lead Value</p>
                <p className="text-xl font-semibold">${totalLeadValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Opportunities</p>
                <p className="text-xl font-semibold">{opportunities.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pipeline Value</p>
                <p className="text-xl font-semibold">${totalOpportunityValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="leads" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="pipeline">Sales Pipeline</TabsTrigger>
        </TabsList>

        <TabsContent value="leads">
          <Card>
            <CardHeader>
              <CardTitle>Lead Management</CardTitle>
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
                    <TableHead>Last Contact</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>{lead.company}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span className="text-sm">{lead.email}</span>
                          </div>
                          {lead.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <span className="text-sm">{lead.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>${lead.value.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={getStageColor(lead.stage)}>
                          {lead.stage}
                        </Badge>
                      </TableCell>
                      <TableCell>{lead.lastContact}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
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

        <TabsContent value="opportunities">
          <Card>
            <CardHeader>
              <CardTitle>Sales Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Opportunity</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Probability</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Close Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {opportunities.map((opp) => (
                    <TableRow key={opp.id}>
                      <TableCell className="font-medium">{opp.name}</TableCell>
                      <TableCell>{opp.customer}</TableCell>
                      <TableCell>${opp.value.toLocaleString()}</TableCell>
                      <TableCell>{opp.probability}%</TableCell>
                      <TableCell>
                        <Badge variant="default">{opp.stage}</Badge>
                      </TableCell>
                      <TableCell>{opp.closeDate}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
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

        <TabsContent value="pipeline">
          <Card>
            <CardHeader>
              <CardTitle>Sales Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {["New", "Qualified", "Proposal", "Negotiation", "Closed Won"].map((stage) => (
                  <div key={stage} className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">{stage}</h3>
                    <div className="space-y-2">
                      {leads.filter(lead => lead.stage === stage).map((lead) => (
                        <div key={lead.id} className="bg-muted p-2 rounded text-sm">
                          <p className="font-medium">{lead.name}</p>
                          <p className="text-muted-foreground">${lead.value.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
