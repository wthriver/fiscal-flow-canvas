
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight, User, Building, CreditCard, Lock, Globe, Bell, Mail, FileText, Users, Calendar, Moon, Sun, Smartphone, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-mobile";

const Settings: React.FC = () => {
  // State for form values and switches
  const [formValues, setFormValues] = useState({
    name: "John Smith",
    email: "john@example.com",
    phone: "(555) 123-4567",
    timezone: "Eastern Time (US & Canada)"
  });

  const [notifications, setNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [twoFactorSetupOpen, setTwoFactorSetupOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [qrCodeUrl] = useState("https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/Lovable:john@example.com?secret=JBSWY3DPEHPK3PXP&issuer=Lovable");
  
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 640px)");

  // Check if dark mode is already enabled in localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

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

  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      toast.success("Dark mode activated");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      toast.success("Light mode activated");
    }
  };

  const handleTwoFactorToggle = (checked: boolean) => {
    if (checked) {
      // Open 2FA setup flow when enabling
      setTwoFactorSetupOpen(true);
    } else {
      // Directly disable 2FA
      setTwoFactor(false);
      toast.info("Two-factor authentication disabled");
    }
  };

  const completeTwoFactorSetup = () => {
    // In a real app, we would validate the verification code here
    if (verificationCode.length === 6) {
      setTwoFactor(true);
      setTwoFactorSetupOpen(false);
      toast.success("Two-factor authentication enabled");
    } else {
      toast.error("Please enter a valid 6-digit verification code");
    }
  };

  const cancelTwoFactorSetup = () => {
    setTwoFactorSetupOpen(false);
    setVerificationCode("");
    // Don't enable 2FA if setup was canceled
    setTwoFactor(false);
  };

  const handleSettingClick = (category: string, setting: string) => {
    // Simulate navigation to specific setting sections
    let message = `Navigating to ${category} - ${setting}`;
    
    // Custom handling for specific settings
    switch (setting) {
      case "Security":
        toast.info("Opening security settings");
        // In a real app, we would navigate to security page or open security modal
        break;
      case "Notifications":
        toast.info("Opening notification preferences");
        // In a real app, we would navigate to notifications page or open notifications modal
        break;
      case "Connected Apps":
        toast.info("Viewing connected applications");
        // In a real app, we would show connected apps
        break;
      default:
        toast.info(message);
    }
  };

  const TwoFactorSetupDialog = () => (
    <Dialog open={twoFactorSetupOpen && !isMobile} onOpenChange={setTwoFactorSetupOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set up Two-Factor Authentication</DialogTitle>
          <DialogDescription>
            Scan the QR code with your authenticator app, then enter the verification code below.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-4">
          <img 
            src={qrCodeUrl} 
            alt="QR Code for 2FA" 
            className="w-48 h-48 mb-4 border rounded"
          />
          <p className="text-sm mb-4">Or enter this code manually: <code className="bg-muted p-1 rounded">JBSWY3DPEHPK3PXP</code></p>
          <Input
            id="verificationCode"
            placeholder="Enter 6-digit code"
            className="w-full"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            maxLength={6}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={cancelTwoFactorSetup}>Cancel</Button>
          <Button onClick={completeTwoFactorSetup}>Verify</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const TwoFactorSetupDrawer = () => (
    <Drawer open={twoFactorSetupOpen && isMobile} onOpenChange={setTwoFactorSetupOpen}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Set up Two-Factor Authentication</DrawerTitle>
          <DrawerDescription>
            Scan the QR code with your authenticator app, then enter the verification code below.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 flex flex-col items-center justify-center py-4">
          <img 
            src={qrCodeUrl} 
            alt="QR Code for 2FA" 
            className="w-48 h-48 mb-4 border rounded"
          />
          <p className="text-sm mb-4">Or enter this code manually: <code className="bg-muted p-1 rounded">JBSWY3DPEHPK3PXP</code></p>
          <Input
            id="verificationCode"
            placeholder="Enter 6-digit code"
            className="w-full"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            maxLength={6}
          />
        </div>
        <DrawerFooter className="pt-2">
          <Button onClick={completeTwoFactorSetup}>Verify</Button>
          <DrawerClose asChild>
            <Button variant="outline" onClick={cancelTwoFactorSetup}>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );

  const settingsCategories = [
    {
      title: "Account",
      icon: User,
      items: [
        { name: "Your Profile", description: "Manage your personal information", icon: User },
        { name: "Security", description: "Password and authentication settings", icon: Lock },
        { name: "Notifications", description: "Configure your notification preferences", icon: Bell },
        { name: "Connected Apps", description: "Manage connected applications and services", icon: Globe },
      ]
    },
    {
      title: "Company",
      icon: Building,
      items: [
        { name: "Company Information", description: "Business name, address, and logo", icon: Building },
        { name: "Users & Permissions", description: "Manage users and access control", icon: Users },
        { name: "Fiscal Year", description: "Set your fiscal year and accounting periods", icon: Calendar },
        { name: "Chart of Accounts", description: "Customize your accounts structure", icon: FileText },
      ]
    },
    {
      title: "Billing",
      icon: CreditCard,
      items: [
        { name: "Subscription", description: "View and change your subscription plan", icon: CreditCard },
        { name: "Payment Methods", description: "Manage your payment methods", icon: CreditCard },
        { name: "Billing History", description: "View past invoices and receipts", icon: FileText },
        { name: "Email Receipts", description: "Configure receipt emails", icon: Mail },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

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
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive email notifications for important events</p>
                </div>
                <Switch 
                  checked={notifications} 
                  onCheckedChange={setNotifications} 
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <div className="flex items-center gap-2">
                  {twoFactor && <Shield className="h-5 w-5 text-green-500" />}
                  <Switch 
                    checked={twoFactor} 
                    onCheckedChange={handleTwoFactorToggle}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
                </div>
                <div className="flex items-center gap-2">
                  {darkMode ? <Moon className="h-5 w-5 text-blue-500" /> : <Sun className="h-5 w-5 text-amber-500" />}
                  <Switch 
                    checked={darkMode} 
                    onCheckedChange={handleDarkModeToggle}
                  />
                </div>
              </div>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {settingsCategories.map((category, idx) => (
          <Card key={idx} className="h-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <category.icon className="h-5 w-5 text-primary" />
                <CardTitle>{category.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {category.items.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between h-auto py-3 px-4 hover:bg-accent hover:text-accent-foreground"
                      onClick={() => handleSettingClick(category.title, item.name)}
                    >
                      <div className="flex items-start gap-2 text-left">
                        <item.icon className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <span className="font-medium block">{item.name}</span>
                          <span className="text-sm text-muted-foreground">{item.description}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two-factor authentication setup UI */}
      {TwoFactorSetupDialog()}
      {TwoFactorSetupDrawer()}
    </div>
  );
};

export default Settings;
