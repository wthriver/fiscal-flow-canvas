
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Building, CreditCard } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Import all our settings components
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { ConnectedAppsSettings } from "@/components/settings/ConnectedAppsSettings";
import { CompanySettings } from "@/components/settings/CompanySettings";
import { UsersPermissionsSettings } from "@/components/settings/UsersPermissionsSettings";
import { FiscalYearSettings } from "@/components/settings/FiscalYearSettings";
import { ChartOfAccountsSettings } from "@/components/settings/ChartOfAccountsSettings";
import { BillingSettings } from "@/components/settings/BillingSettings";

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [activeSection, setActiveSection] = useState("profile");

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="account" className="flex gap-2 items-center">
            <User className="h-4 w-4" />
            <span>Account</span>
          </TabsTrigger>
          <TabsTrigger value="company" className="flex gap-2 items-center">
            <Building className="h-4 w-4" />
            <span>Company</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex gap-2 items-center">
            <CreditCard className="h-4 w-4" />
            <span>Billing</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar/Navigation */}
            <div className="col-span-12 md:col-span-3">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold mb-3">Account Settings</h2>
                <button
                  onClick={() => handleSectionClick("profile")}
                  className={`w-full p-2.5 text-left rounded-md transition-colors ${
                    activeSection === "profile" 
                      ? "bg-accent text-accent-foreground" 
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="font-medium">Your Profile</div>
                  <div className="text-sm text-muted-foreground">Manage your personal information</div>
                </button>
                
                <button
                  onClick={() => handleSectionClick("security")}
                  className={`w-full p-2.5 text-left rounded-md transition-colors ${
                    activeSection === "security" 
                      ? "bg-accent text-accent-foreground" 
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="font-medium">Security</div>
                  <div className="text-sm text-muted-foreground">Password and authentication settings</div>
                </button>
                
                <button
                  onClick={() => handleSectionClick("notifications")}
                  className={`w-full p-2.5 text-left rounded-md transition-colors ${
                    activeSection === "notifications" 
                      ? "bg-accent text-accent-foreground" 
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="font-medium">Notifications</div>
                  <div className="text-sm text-muted-foreground">Configure your notification preferences</div>
                </button>
                
                <button
                  onClick={() => handleSectionClick("connectedApps")}
                  className={`w-full p-2.5 text-left rounded-md transition-colors ${
                    activeSection === "connectedApps" 
                      ? "bg-accent text-accent-foreground" 
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="font-medium">Connected Apps</div>
                  <div className="text-sm text-muted-foreground">Manage connected applications and services</div>
                </button>
              </div>
            </div>
            
            {/* Content Area */}
            <div className="col-span-12 md:col-span-9">
              {activeSection === "profile" && <ProfileSettings />}
              {activeSection === "security" && <SecuritySettings />}
              {activeSection === "notifications" && <NotificationSettings />}
              {activeSection === "connectedApps" && <ConnectedAppsSettings />}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="company" className="space-y-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar/Navigation */}
            <div className="col-span-12 md:col-span-3">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold mb-3">Company Settings</h2>
                <button
                  onClick={() => handleSectionClick("companyInfo")}
                  className={`w-full p-2.5 text-left rounded-md transition-colors ${
                    activeSection === "companyInfo" 
                      ? "bg-accent text-accent-foreground" 
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="font-medium">Company Information</div>
                  <div className="text-sm text-muted-foreground">Business name, address, and logo</div>
                </button>
                
                <button
                  onClick={() => handleSectionClick("usersPermissions")}
                  className={`w-full p-2.5 text-left rounded-md transition-colors ${
                    activeSection === "usersPermissions" 
                      ? "bg-accent text-accent-foreground" 
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="font-medium">Users & Permissions</div>
                  <div className="text-sm text-muted-foreground">Manage users and access control</div>
                </button>
                
                <button
                  onClick={() => handleSectionClick("fiscalYear")}
                  className={`w-full p-2.5 text-left rounded-md transition-colors ${
                    activeSection === "fiscalYear" 
                      ? "bg-accent text-accent-foreground" 
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="font-medium">Fiscal Year</div>
                  <div className="text-sm text-muted-foreground">Set your fiscal year and accounting periods</div>
                </button>
                
                <button
                  onClick={() => handleSectionClick("chartOfAccounts")}
                  className={`w-full p-2.5 text-left rounded-md transition-colors ${
                    activeSection === "chartOfAccounts" 
                      ? "bg-accent text-accent-foreground" 
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="font-medium">Chart of Accounts</div>
                  <div className="text-sm text-muted-foreground">Customize your accounts structure</div>
                </button>
              </div>
            </div>
            
            {/* Content Area */}
            <div className="col-span-12 md:col-span-9">
              {activeSection === "companyInfo" && <CompanySettings />}
              {activeSection === "usersPermissions" && <UsersPermissionsSettings />}
              {activeSection === "fiscalYear" && <FiscalYearSettings />}
              {activeSection === "chartOfAccounts" && <ChartOfAccountsSettings />}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <BillingSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
