
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { FileText, Edit, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

interface InvoiceTemplate {
  id: string;
  name: string;
  description: string;
  headerText: string;
  footerText: string;
  paymentTerms: string;
  isDefault: boolean;
}

export const InvoiceTemplates = () => {
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([
    {
      id: "tpl-1",
      name: "Standard Template",
      description: "Default invoice template",
      headerText: "Thank you for your business!",
      footerText: "Payment is due within 30 days of invoice date.",
      paymentTerms: "Net 30",
      isDefault: true
    },
    {
      id: "tpl-2",
      name: "Service Template",
      description: "Template for service-based invoices",
      headerText: "Professional Services Invoice",
      footerText: "Thank you for choosing our services. Payment due upon receipt.",
      paymentTerms: "Due on Receipt",
      isDefault: false
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<InvoiceTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    headerText: "",
    footerText: "",
    paymentTerms: ""
  });

  const handleOpenDialog = (template?: InvoiceTemplate) => {
    if (template) {
      setEditingTemplate(template);
      setFormData({
        name: template.name,
        description: template.description,
        headerText: template.headerText,
        footerText: template.footerText,
        paymentTerms: template.paymentTerms
      });
    } else {
      setEditingTemplate(null);
      setFormData({
        name: "",
        description: "",
        headerText: "",
        footerText: "",
        paymentTerms: ""
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name) {
      toast.error("Please enter a template name");
      return;
    }

    if (editingTemplate) {
      setTemplates(prev => prev.map(t => 
        t.id === editingTemplate.id 
          ? { ...t, ...formData }
          : t
      ));
      toast.success("Template updated successfully");
    } else {
      const newTemplate: InvoiceTemplate = {
        id: `tpl-${Date.now()}`,
        ...formData,
        isDefault: false
      };
      setTemplates(prev => [...prev, newTemplate]);
      toast.success("Template created successfully");
    }
    setIsDialogOpen(false);
  };

  const handleSetDefault = (templateId: string) => {
    setTemplates(prev => prev.map(t => ({
      ...t,
      isDefault: t.id === templateId
    })));
    toast.success("Default template updated");
  };

  const handleDelete = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template?.isDefault) {
      toast.error("Cannot delete the default template");
      return;
    }
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    toast.success("Template deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Invoice Templates</h2>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {template.name}
                </CardTitle>
                {template.isDefault && (
                  <Badge variant="default">Default</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Payment Terms:</span> {template.paymentTerms}
                </div>
                <div>
                  <span className="font-medium">Header:</span> {template.headerText.substring(0, 30)}...
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => handleOpenDialog(template)}>
                  <Edit className="h-4 w-4" />
                </Button>
                {!template.isDefault && (
                  <Button variant="outline" size="sm" onClick={() => handleSetDefault(template.id)}>
                    Set Default
                  </Button>
                )}
                {!template.isDefault && (
                  <Button variant="outline" size="sm" onClick={() => handleDelete(template.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Edit Template" : "Create New Template"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter template name"
                />
              </div>
              <div>
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Input
                  id="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})}
                  placeholder="Net 30"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Template description"
              />
            </div>
            <div>
              <Label htmlFor="headerText">Header Text</Label>
              <Textarea
                id="headerText"
                value={formData.headerText}
                onChange={(e) => setFormData({...formData, headerText: e.target.value})}
                placeholder="Text to appear at the top of invoices"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="footerText">Footer Text</Label>
              <Textarea
                id="footerText"
                value={formData.footerText}
                onChange={(e) => setFormData({...formData, footerText: e.target.value})}
                placeholder="Text to appear at the bottom of invoices"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingTemplate ? "Update" : "Create"} Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
