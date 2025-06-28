import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
    name: "",
    client: "",
    description: "",
    status: "Planning" as "Planning" | "In Progress" | "Active" | "Completed" | "On Hold",
    priority: "Medium" as "Low" | "Medium" | "High",
    startDate: new Date().toISOString().split('T')[0],
    endDate: "",
    budget: "",
    progress: "0",
    teamMembers: [] as string[],
    tasks: [] as Array<{id: string, title: string, status: string, assignedTo: string}>,
    milestones: [] as Array<{id: string, title: string, dueDate: string, status: string}>
  });

  const [newTask, setNewTask] = useState({ title: "", assignedTo: "" });
  const [newMilestone, setNewMilestone] = useState({ title: "", dueDate: "" });

  useEffect(() => {
    if (project && isOpen) {
      setFormData({
        name: project.name || "",
        client: project.client || "",
        description: project.description || "",
        status: (project.status as "Planning" | "In Progress" | "Active" | "Completed" | "On Hold") || "Planning",
        priority: (project.priority as "Low" | "Medium" | "High") || "Medium",
        startDate: project.startDate || new Date().toISOString().split('T')[0],
        endDate: project.endDate || "",
        budget: project.budget?.toString() || "",
        progress: project.progress?.toString() || "0",
        teamMembers: project.teamMembers || project.team || [],
        tasks: project.tasks?.map(task => ({
          id: task.id,
          title: task.title,
          status: task.status,
          assignedTo: task.assignedTo || ""
        })) || [],
        milestones: project.milestones?.map(milestone => ({
          id: milestone.id,
          title: milestone.title,
          dueDate: milestone.dueDate,
          status: milestone.status
        })) || []
      });
    } else if (!project && isOpen) {
      setFormData({
        name: "",
        client: "",
        description: "",
        status: "Planning",
        priority: "Medium",
        startDate: new Date().toISOString().split('T')[0],
        endDate: "",
        budget: "",
        progress: "0",
        teamMembers: [],
        tasks: [],
        milestones: []
      });
    }
  }, [project, isOpen]);

  const addTask = () => {
    if (!newTask.title) return;
    const task = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      status: "Todo",
      assignedTo: newTask.assignedTo
    };
    setFormData(prev => ({
      ...prev,
      tasks: [...prev.tasks, task]
    }));
    setNewTask({ title: "", assignedTo: "" });
  };

  const addMilestone = () => {
    if (!newMilestone.title || !newMilestone.dueDate) return;
    const milestone = {
      id: `milestone-${Date.now()}`,
      title: newMilestone.title,
      dueDate: newMilestone.dueDate,
      status: "Pending"
    };
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, milestone]
    }));
    setNewMilestone({ title: "", dueDate: "" });
  };

  const removeTask = (taskId: string) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== taskId)
    }));
  };

  const removeMilestone = (milestoneId: string) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter(milestone => milestone.id !== milestoneId)
    }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.client) {
      toast.error("Please fill in all required fields");
      return;
    }

    const projectData: Project = {
      id: project?.id || `project-${Date.now()}`,
      name: formData.name,
      clientId: project?.clientId || `client-${Date.now()}`,
      client: formData.client,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      startDate: formData.startDate,
      endDate: formData.endDate,
      budget: parseFloat(formData.budget) || 0,
      progress: parseInt(formData.progress) || 0,
      teamMembers: formData.teamMembers,
      tasks: formData.tasks.map(task => ({
        id: task.id,
        title: task.title,
        status: task.status as "Todo" | "In Progress" | "Done",
        assignedTo: task.assignedTo,
        priority: "Medium" as "Low" | "Medium" | "High",
        dueDate: "",
        description: ""
      })),
      milestones: formData.milestones.map(milestone => ({
        id: milestone.id,
        title: milestone.title,
        dueDate: milestone.dueDate,
        status: milestone.status as "Pending" | "Completed",
        description: ""
      })),
      documents: project?.documents || []
    };

    const updatedProjects = project 
      ? (currentCompany.projects || []).map(p => p.id === project.id ? projectData : p)
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
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? 'Edit Project' : 'Create New Project'}</DialogTitle>
          <DialogDescription>
            {project ? 'Update project details and management' : 'Set up a new project with comprehensive details'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Basic Project Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Project Name*</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter project name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Client*</label>
              <Input
                value={formData.client}
                onChange={(e) => setFormData({...formData, client: e.target.value})}
                placeholder="Client name"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Project description"
              rows={3}
            />
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={formData.status} onValueChange={(value: "Planning" | "In Progress" | "Active" | "Completed" | "On Hold") => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
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
            <div>
              <label className="text-sm font-medium">Priority</label>
              <Select value={formData.priority} onValueChange={(value: "Low" | "Medium" | "High") => setFormData({...formData, priority: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Progress (%)</label>
              <Input
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({...formData, progress: e.target.value})}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">End Date</label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Budget</label>
              <Input
                type="number"
                step="0.01"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Tasks Section */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Project Tasks</h3>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Task name"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              />
              <Input
                placeholder="Assignee"
                value={newTask.assignedTo}
                onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
              />
              <Button onClick={addTask}>Add Task</Button>
            </div>
            <div className="space-y-2">
              {formData.tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <span className="font-medium">{task.title}</span>
                    {task.assignedTo && <span className="text-sm text-muted-foreground ml-2">• {task.assignedTo}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{task.status}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => removeTask(task.id)}>×</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones Section */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Project Milestones</h3>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Milestone name"
                value={newMilestone.title}
                onChange={(e) => setNewMilestone({...newMilestone, title: e.target.value})}
              />
              <Input
                type="date"
                value={newMilestone.dueDate}
                onChange={(e) => setNewMilestone({...newMilestone, dueDate: e.target.value})}
              />
              <Button onClick={addMilestone}>Add Milestone</Button>
            </div>
            <div className="space-y-2">
              {formData.milestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <span className="font-medium">{milestone.title}</span>
                    <span className="text-sm text-muted-foreground ml-2">• {milestone.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={milestone.status === "Completed" ? "default" : "outline"}>
                      {milestone.status === "Completed" ? "Completed" : "Pending"}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => removeMilestone(milestone.id)}>×</Button>
                  </div>
                </div>
              ))}
            </div>
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
