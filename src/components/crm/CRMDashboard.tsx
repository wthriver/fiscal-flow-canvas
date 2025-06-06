
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, DollarSign, Plus, Mail, Phone, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useCompany } from "@/contexts/CompanyContext";
import { Lead, Opportunity } from "@/types/company";

export const CRMDashboard = () => {
  const { currentCompany } = useCompany();
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "lead-1",
      name: "John Smith",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      company: "Tech Solutions Inc",
      value: 25000,
      stage: "Qualified",
      source: "Website",
      assignedTo: "Sarah Johnson",
      lastContact: "2025-05-20",
      notes: "Interested in our enterprise package"
    },
    {
      id: "lead-2",
      name: "Emily Davis",
      email: "emily@marketing.com",
      phone: "+1 (555) 987-6543",
      company: "Marketing Pro",
      value: 15000,
      stage: "New",
      source: "Referral",
      assignedTo: "Mike Wilson",
      lastContact: "2025-05-22",
      notes: "Looking for marketing automation solution"
    }
  ]);

  const [opportunities, setOpportunities] = useState<Opportunity[]>([
    {
      id: "opp-1",
      name: "Enterprise Software Deal",
      customer: "Tech Solutions Inc",
      value: 50000,
      probability: 75,
      stage: "Proposal",
      closeDate: "2025-06-30",
      description: "Large enterprise software implementation",
      salesRep: "Sarah Johnson"
    }
  ]);

  const [showLeadForm, setShowLeadForm] = useState(false);
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    value: "",
    stage: "New",
    source: "Website",
    assignedTo: "",
    notes: ""
  });

  const handleCreateLead = () => {
    if (!newLead.name || !newLead.email || !newLead.company) {
      toast.error("Please fill in all required fields");
      return;
    }

    const lead: Lead = {
      id: `lead-${Date.now()}`,
      name: newLead.name,
      email: newLead.email,
      phone: newLead.phone,
      company: newLead.company,
      value: parseFloat(newLead.value) || 0,
      stage: newLead.stage as Lead['stage'],
      source: newLead.source,
      assignedTo: newLead.assignedTo,
      lastContact: new Date().toISOString().split('T')[0],
      notes: newLead.notes
    };

    setLeads(prev => [lead, ...prev]);
    setShowLeadForm(false);
    setNewLead({
      name: "",
      email: "",
      phone: "",
      company: "",
      value: "",
      stage: "New",
      source: "Website",
      assignedTo: "",
      notes: ""
    });
    toast.success("Lead created successfully");
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "New": return "bg-blue-100 text-blue-800";
      case "Qualified": return "bg-green-100 text-green-800";
      case "Proposal": return "bg-yellow-100 text-yellow-800";
      case "Negotiation": return "bg-orange-100 text-orange-800";
      case "Closed Won": return "bg-emerald-100 text-emerald-800";
      case "Closed Lost": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const totalLeadValue = leads.reduce((sum, lead) => sum + lead.value, 0);
  const qualifiedLeads = leads.filter(lead => lead.stage === "Qualified").length;
  const totalOpportunityValue = opportunities.reduce((sum, opp) => sum + opp.value, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">CRM Dashboard</h1>
          <p className="text-muted-foreground">Manage leads, opportunities, and customer relationships for {currentCompany.name}</p>
        </div>
        <Button onClick={() => setShowLeadForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
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
                <p className="text-2xl font-semibold">{leads.length}</p>
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
                <p className="text-2xl font-semibold">{qualifiedLeads}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Lead Value</p>
                <p className="text-2xl font-semibold">${totalLeadValue.toLocaleString()}</p>
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
                <p className="text-2xl font-semibold">${totalOpportunityValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lead Creation Form */}
      {showLeadForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Lead</CardTitle>
            <CardDescription>Add a new lead to your CRM pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="leadName">Name *</Label>
                <Input
                  id="leadName"
                  value={newLead.name}
                  onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                  placeholder="Contact name"
                />
              </div>
              <div>
                <Label htmlFor="leadEmail">Email *</Label>
                <Input
                  id="leadEmail"
                  type="email"
                  value={newLead.email}
                  onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                  placeholder="contact@company.com"
                />
              </div>
              <div>
                <Label htmlFor="leadPhone">Phone</Label>
                <Input
                  id="leadPhone"
                  value={newLead.phone}
                  onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="leadCompany">Company *</Label>
                <Input
                  id="leadCompany"
                  value={newLead.company}
                  onChange={(e) => setNewLead({...newLead, company: e.target.value})}
                  placeholder="Company name"
                />
              </div>
              <div>
                <Label htmlFor="leadValue">Expected Value</Label>
                <Input
                  id="leadValue"
                  type="number"
                  value={newLead.value}
                  onChange={(e) => setNewLead({...newLead, value: e.target.value})}
                  placeholder="25000"
                />
              </div>
              <div>
                <Label htmlFor="leadStage">Stage</Label>
                <Select value={newLead.stage} onValueChange={(value) => setNewLead({...newLead, stage: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Qualified">Qualified</SelectItem>
                    <SelectItem value="Proposal">Proposal</SelectItem>
                    <SelectItem value="Negotiation">Negotiation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="leadNotes">Notes</Label>
                <Textarea
                  id="leadNotes"
                  value={newLead.notes}
                  onChange={(e) => setNewLead({...newLead, notes: e.target.value})}
                  placeholder="Additional notes about this lead..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowLeadForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateLead}>
                Create Lead
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leads List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Leads</CardTitle>
          <CardDescription>Manage your sales leads and track progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leads.map((lead) => (
              <div key={lead.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">{lead.name}</h4>
                    <p className="text-sm text-muted-foreground">{lead.company}</p>
                  </div>
                  <Badge className={getStageColor(lead.stage)}>
                    {lead.stage}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{lead.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{lead.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">${lead.value.toLocaleString()}</span>
                  </div>
                </div>
                {lead.notes && (
                  <p className="text-sm text-muted-foreground mt-2">{lead.notes}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Opportunities</CardTitle>
          <CardDescription>Track your sales pipeline and opportunities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {opportunities.map((opportunity) => (
              <div key={opportunity.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{opportunity.name}</h4>
                    <p className="text-sm text-muted-foreground">{opportunity.customer}</p>
                    <p className="text-sm text-muted-foreground mt-1">{opportunity.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${opportunity.value.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{opportunity.probability}% probability</p>
                    <Badge className={getStageColor(opportunity.stage)}>
                      {opportunity.stage}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Close: {opportunity.closeDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{opportunity.salesRep}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
