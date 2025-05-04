
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { CompanySettings } from "@/components/settings/CompanySettings";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { UsersPermissionsSettings } from "@/components/settings/UsersPermissionsSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { BillingSettings } from "@/components/settings/BillingSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { ChartOfAccountsSettings } from "@/components/settings/ChartOfAccountsSettings";
import { FiscalYearSettings } from "@/components/settings/FiscalYearSettings";
import { ConnectedAppsSettings } from "@/components/settings/ConnectedAppsSettings";
import { AuditTrailSettings } from "@/components/settings/AuditTrailSettings";
import { MultiCurrencySettings } from "@/components/settings/MultiCurrencySettings";
import { IntegrationsSettings } from "@/components/settings/IntegrationsSettings";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("company");

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto">
          <TabsList className="inline-flex w-auto mb-4">
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="users">Users & Permissions</TabsTrigger>
            <TabsTrigger value="chart-of-accounts">Chart of Accounts</TabsTrigger>
            <TabsTrigger value="fiscal-year">Fiscal Year</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="connected-apps">Connected Apps</TabsTrigger>
            <TabsTrigger value="audit-trail">Audit Trail</TabsTrigger>
            <TabsTrigger value="multi-currency">Multi-Currency</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>
        </div>
        
        <Card>
          <TabsContent value="company">
            <CompanySettings />
          </TabsContent>
          
          <TabsContent value="profile">
            <ProfileSettings />
          </TabsContent>
          
          <TabsContent value="users">
            <UsersPermissionsSettings />
          </TabsContent>
          
          <TabsContent value="chart-of-accounts">
            <ChartOfAccountsSettings />
          </TabsContent>
          
          <TabsContent value="fiscal-year">
            <FiscalYearSettings />
          </TabsContent>
          
          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>
          
          <TabsContent value="billing">
            <BillingSettings />
          </TabsContent>
          
          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>
          
          <TabsContent value="connected-apps">
            <ConnectedAppsSettings />
          </TabsContent>
          
          <TabsContent value="audit-trail">
            <AuditTrailSettings />
          </TabsContent>
          
          <TabsContent value="multi-currency">
            <MultiCurrencySettings />
          </TabsContent>
          
          <TabsContent value="integrations">
            <IntegrationsSettings />
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default Settings;
