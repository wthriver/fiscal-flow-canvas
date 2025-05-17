
import React from "react";
import { ChartOfAccountsComponent } from "@/components/accounting/ChartOfAccountsComponent";

const ChartOfAccounts = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Chart of Accounts</h1>
        <p className="text-muted-foreground">Manage your accounting structure and accounts</p>
      </div>
      
      <ChartOfAccountsComponent />
    </div>
  );
};

export default ChartOfAccounts;
