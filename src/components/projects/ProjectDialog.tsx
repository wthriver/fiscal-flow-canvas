
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";
import { Project } from "@/types/company";

interface ProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
}

export const ProjectDialog: React.FC<ProjectDialogProps> = ({ 
  isOpen, 
  onClose, 
  project 
}) => {
  const { currentCompany, updateCompany } = useCompany();
  const [formData, setFormData] = useState({
    name: project?.name || "",
    client: project?.client || "",
    status: project?.status || "Planning",
    startDate: project?.startDate || new Date().toISOString().split('T')[0],
    endDate: project?.endDate || "",
    budget: project?.budget?.toString() || "",
    description: project?.description || "",
    priority: project?.priority || "Medium"
  });

  const handleSave = () => {
    if (!formData.name || !formData.client) {
      toast.error("Please fill in all required fields");
      return;
    }

    const projectData: Project = {
      id: project?.id || `proj-${Date.now()}`,
      name: formData.name,
      client: formData.client,
      status: formData.status,
      startDate: formData.startDate,
      endDate: formData.endDate,
      budget: formData.budget ? parseFloat(formData.budget) : undefined,
      description: formData.description,
      priority: formData.priority,
      documents: project?.documents || [],
      tracked: project?.tracked || 0,
      billed: project?.billed || false,
      spent: project?.spent || 0,
      progress: project?.progress || 0
    };

    const updatedProjects = project 
      ? currentCompany.projects?.map(p => p.id === project.id ? projectData : p) || []
      : [...(currentCompany.projects || []), projectData];

    updateCompany({
      ...currentCompany,
      projects: updatedProjects
    });

    toast.success(project ? "Project updated successfully!" : "Project created successfully!");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{project ? 'Edit Project' : 'Create New Project'}</DialogTitle>
          <DialogDescription>
            {project ? 'Update project details' : 'Set up a new project for your client'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">Name*</label>
            <Input
              className="col-span-3"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Project name"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">Client*</label>
            <Select onValueChange={(value) => setFormData({...formData, client: value})}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={formData.client || "Select client"} />
              </SelectTrigger>
              <SelectContent>
                {currentCompany.customers?.map(customer => (
                  <SelectItem key={customer.id} value={customer.name}>
                    {customer.name}
                  </SelectItem>
                ))}
                <SelectItem value="New Client">New Client</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">Status</label>
            <Select onValueChange={(value) => setFormData({...formData, status: value})}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={formData.status || "Select status"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Planning">Planning</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">Start Date</label>
            <Input
              type="date"
              className="col-span-3"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">Budget</label>
            <Input
              type="number"
              step="0.01"
              className="col-span-3"
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: e.target.value})}
              placeholder="Project budget"
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <label className="text-right">Description</label>
            <Textarea
              className="col-span-3"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Project description"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>
            {project ? 'Update Project' : 'Create Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
