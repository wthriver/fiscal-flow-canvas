
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Building, CreditCard, Settings as SettingsIcon } from "lucide-react";

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
          {activeSection === "profile" && <ProfileSettings />}
          {activeSection === "security" && <SecuritySettings />}
          {activeSection === "notifications" && <NotificationSettings />}
          {activeSection === "connectedApps" && <ConnectedAppsSettings />}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-3">
              <h2 className="text-xl font-bold mb-4">Account Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <button
                  onClick={() => handleSectionClick("profile")}
                  className={`p-4 border rounded-lg text-left transition-colors hover:bg-accent ${
                    activeSection === "profile" ? "bg-accent border-primary" : ""
                  }`}
                >
                  <User className="h-5 w-5 mb-2 text-primary" />
                  <h3 className="font-medium">Your Profile</h3>
                  <p className="text-sm text-muted-foreground">Manage your personal information</p>
                </button>
                
                <button
                  onClick={() => handleSectionClick("security")}
                  className={`p-4 border rounded-lg text-left transition-colors hover:bg-accent ${
                    activeSection === "security" ? "bg-accent border-primary" : ""
                  }`}
                >
                  <SettingsIcon className="h-5 w-5 mb-2 text-primary" />
                  <h3 className="font-medium">Security</h3>
                  <p className="text-sm text-muted-foreground">Password and authentication settings</p>
                </button>
                
                <button
                  onClick={() => handleSectionClick("notifications")}
                  className={`p-4 border rounded-lg text-left transition-colors hover:bg-accent ${
                    activeSection === "notifications" ? "bg-accent border-primary" : ""
                  }`}
                >
                  <SettingsIcon className="h-5 w-5 mb-2 text-primary" />
                  <h3 className="font-medium">Notifications</h3>
                  <p className="text-sm text-muted-foreground">Configure your notification preferences</p>
                </button>
                
                <button
                  onClick={() => handleSectionClick("connectedApps")}
                  className={`p-4 border rounded-lg text-left transition-colors hover:bg-accent ${
                    activeSection === "connectedApps" ? "bg-accent border-primary" : ""
                  }`}
                >
                  <SettingsIcon className="h-5 w-5 mb-2 text-primary" />
                  <h3 className="font-medium">Connected Apps</h3>
                  <p className="text-sm text-muted-foreground">Manage connected applications and services</p>
                </button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="company" className="space-y-6">
          {activeSection === "companyInfo" && <CompanySettings />}
          {activeSection === "usersPermissions" && <UsersPermissionsSettings />}
          {activeSection === "fiscalYear" && <FiscalYearSettings />}
          {activeSection === "chartOfAccounts" && <ChartOfAccountsSettings />}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-3">
              <h2 className="text-xl font-bold mb-4">Company Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <button
                  onClick={() => handleSectionClick("companyInfo")}
                  className={`p-4 border rounded-lg text-left transition-colors hover:bg-accent ${
                    activeSection === "companyInfo" ? "bg-accent border-primary" : ""
                  }`}
                >
                  <Building className="h-5 w-5 mb-2 text-primary" />
                  <h3 className="font-medium">Company Information</h3>
                  <p className="text-sm text-muted-foreground">Business name, address, and logo</p>
                </button>
                
                <button
                  onClick={() => handleSectionClick("usersPermissions")}
                  className={`p-4 border rounded-lg text-left transition-colors hover:bg-accent ${
                    activeSection === "usersPermissions" ? "bg-accent border-primary" : ""
                  }`}
                >
                  <SettingsIcon className="h-5 w-5 mb-2 text-primary" />
                  <h3 className="font-medium">Users & Permissions</h3>
                  <p className="text-sm text-muted-foreground">Manage users and access control</p>
                </button>
                
                <button
                  onClick={() => handleSectionClick("fiscalYear")}
                  className={`p-4 border rounded-lg text-left transition-colors hover:bg-accent ${
                    activeSection === "fiscalYear" ? "bg-accent border-primary" : ""
                  }`}
                >
                  <SettingsIcon className="h-5 w-5 mb-2 text-primary" />
                  <h3 className="font-medium">Fiscal Year</h3>
                  <p className="text-sm text-muted-foreground">Set your fiscal year and accounting periods</p>
                </button>
                
                <button
                  onClick={() => handleSectionClick("chartOfAccounts")}
                  className={`p-4 border rounded-lg text-left transition-colors hover:bg-accent ${
                    activeSection === "chartOfAccounts" ? "bg-accent border-primary" : ""
                  }`}
                >
                  <SettingsIcon className="h-5 w-5 mb-2 text-primary" />
                  <h3 className="font-medium">Chart of Accounts</h3>
                  <p className="text-sm text-muted-foreground">Customize your accounts structure</p>
                </button>
              </div>
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
