
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Building, Upload } from "lucide-react";
import { toast } from "sonner";
import { useCompany } from "@/contexts/CompanyContext";

export function CompanySettings() {
  const { currentCompany, updateCompany } = useCompany();
  const [formValues, setFormValues] = useState({
    companyName: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    taxId: "",
    industry: ""
  });

  // Update form values when currentCompany changes
  useEffect(() => {
    setFormValues({
      companyName: currentCompany.name,
      address: currentCompany.address,
      phone: currentCompany.phone,
      email: currentCompany.email,
      website: currentCompany.website,
      taxId: currentCompany.taxId,
      industry: currentCompany.industry || ""
    });
  }, [currentCompany]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormValues(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveChanges = () => {
    // Update company data
    updateCompany(currentCompany.id, {
      name: formValues.companyName,
      address: formValues.address,
      phone: formValues.phone,
      email: formValues.email,
      website: formValues.website,
      taxId: formValues.taxId,
      industry: formValues.industry
    });
    
    toast.success("Company information saved successfully");
  };

  const handleLogoUpload = () => {
    toast.info("Logo upload functionality would be implemented here");
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building className="h-5 w-5 text-primary" />
          <CardTitle>Company Information</CardTitle>
        </div>
        <CardDescription>Manage your business details and branding</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Building className="mx-auto h-10 w-10 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Company Logo</span>
              </div>
            </div>
            <Button onClick={handleLogoUpload} size="sm" variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Upload Logo
            </Button>
          </div>
          
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input 
                id="companyName" 
                value={formValues.companyName}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                value={formValues.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input 
                id="industry" 
                value={formValues.industry}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input 
                id="address" 
                value={formValues.address}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={formValues.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input 
                id="website" 
                value={formValues.website}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID / EIN</Label>
              <Input 
                id="taxId" 
                value={formValues.taxId}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline"
            onClick={() => toast.info("Changes canceled")}
          >
            Cancel
          </Button>
          <Button 
            className="flex items-center gap-1"
            onClick={handleSaveChanges}
          >
            <Check size={16} />
            <span>Save Changes</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
