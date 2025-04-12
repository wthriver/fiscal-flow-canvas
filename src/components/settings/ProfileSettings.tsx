
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface ProfileFormValues {
  name: string;
  email: string;
  phone: string;
  timezone: string;
  company: string;
  address: string;
  website: string;
}

export function ProfileSettings() {
  const [formValues, setFormValues] = useState<ProfileFormValues>({
    name: "John Smith",
    email: "john@example.com",
    phone: "(555) 123-4567",
    timezone: "Eastern Time (US & Canada)",
    company: "Acme Inc.",
    address: "123 Main St, New York, NY 10001",
    website: "https://example.com"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormValues(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveChanges = () => {
    toast.success("Profile settings saved successfully");
  };

  const handleCancel = () => {
    toast.info("Changes canceled");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        <CardDescription>Manage your personal information and preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              value={formValues.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              value={formValues.email}
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
            <Label htmlFor="timezone">Timezone</Label>
            <Input 
              id="timezone" 
              value={formValues.timezone}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input 
              id="company" 
              value={formValues.company}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input 
              id="address" 
              value={formValues.address}
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
        </div>

        <div className="flex justify-end gap-2">
          <Button 
            variant="outline"
            onClick={handleCancel}
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
