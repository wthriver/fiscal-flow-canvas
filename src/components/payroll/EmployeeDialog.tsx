
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";
import { Employee } from "@/types/company";

interface EmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employee?: Employee | null;
}

export const EmployeeDialog: React.FC<EmployeeDialogProps> = ({ 
  isOpen, 
  onClose, 
  employee 
}) => {
  const { currentCompany, updateCompany } = useCompany();
  
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    email: "",
    phone: "",
    address: "",
    hireDate: "",
    salary: "",
    payRate: "",
    payType: "Hourly" as "Hourly" | "Salary",
    status: "Active" as "Active" | "Inactive" | "Pending",
    department: "",
    manager: "",
    emergencyContact: "",
    benefits: [] as string[],
    skills: [] as string[]
  });

  useEffect(() => {
    if (employee && isOpen) {
      setFormData({
        name: employee.name || "",
        position: employee.position || "",
        email: employee.email || "",
        phone: employee.phone || "",
        address: employee.address || "",
        hireDate: employee.hireDate || "",
        salary: typeof employee.salary === 'string' ? employee.salary : employee.salary?.toString() || "",
        payRate: typeof employee.payRate === 'string' ? employee.payRate : employee.payRate?.toString() || "",
        payType: (employee.payType as "Hourly" | "Salary") || "Hourly",
        status: (employee.status as "Active" | "Inactive" | "Pending") || "Active",
        department: employee.department || "",
        manager: employee.manager || "",
        emergencyContact: employee.emergencyContact || "",
        benefits: employee.benefits || [],
        skills: employee.skills || []
      });
    } else if (!employee && isOpen) {
      setFormData({
        name: "",
        position: "",
        email: "",
        phone: "",
        address: "",
        hireDate: "",
        salary: "",
        payRate: "",
        payType: "Hourly",
        status: "Active",
        department: "",
        manager: "",
        emergencyContact: "",
        benefits: [],
        skills: []
      });
    }
  }, [employee, isOpen]);

  const handleSave = () => {
    if (!formData.name || !formData.position) {
      toast.error("Please fill in all required fields");
      return;
    }

    const employeeData: Employee = {
      id: employee?.id || `emp-${Date.now()}`,
      name: formData.name,
      position: formData.position,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      hireDate: formData.hireDate,
      salary: parseFloat(formData.salary) || 0,
      payRate: parseFloat(formData.payRate) || 0,
      payType: formData.payType,
      status: formData.status,
      department: formData.department,
      manager: formData.manager,
      emergencyContact: formData.emergencyContact,
      benefits: formData.benefits,
      skills: formData.skills
    };

    const updatedEmployees = employee 
      ? currentCompany.employees?.map(emp => emp.id === employee.id ? employeeData : emp) || []
      : [...(currentCompany.employees || []), employeeData];

    updateCompany({
      ...currentCompany,
      employees: updatedEmployees
    });

    toast.success(employee ? "Employee updated successfully!" : "Employee added successfully!");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{employee ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
          <DialogDescription>
            Manage employee information for payroll and HR purposes
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Full Name*</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Position*</label>
              <Input
                value={formData.position}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
                placeholder="Software Developer"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="john@company.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Address</label>
            <Textarea
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              placeholder="123 Main St, City, State 12345"
              rows={2}
            />
          </div>

          {/* Employment Details */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Hire Date</label>
              <Input
                type="date"
                value={formData.hireDate}
                onChange={(e) => setFormData({...formData, hireDate: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Department</label>
              <Input
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                placeholder="Engineering"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={formData.status} onValueChange={(value: "Active" | "Inactive" | "Pending") => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="On Leave">On Leave</SelectItem>
                  <SelectItem value="Terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Compensation */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Pay Type</label>
              <Select value={formData.payType} onValueChange={(value: "Hourly" | "Salary") => setFormData({...formData, payType: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hourly">Hourly</SelectItem>
                  <SelectItem value="Salary">Salary</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">
                {formData.payType === 'Salary' ? 'Annual Salary ($)' : 'Hourly Rate ($)'}
              </label>
              <Input
                type="number"
                step="0.01"
                value={formData.payRate}
                onChange={(e) => setFormData({...formData, payRate: e.target.value})}
                placeholder={formData.payType === 'Salary' ? '75000' : '25.00'}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Manager</label>
              <Input
                value={formData.manager}
                onChange={(e) => setFormData({...formData, manager: e.target.value})}
                placeholder="Manager name"
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <label className="text-sm font-medium">Emergency Contact</label>
            <Input
              value={formData.emergencyContact}
              onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
              placeholder="Jane Doe - (555) 987-6543"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>
            {employee ? 'Update Employee' : 'Add Employee'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
