
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompany } from "@/contexts/CompanyContext";

interface AccountStatementTabProps {
  accountId: string;
}

export const AccountStatementTab: React.FC<AccountStatementTabProps> = ({ accountId }) => {
  const { currentCompany } = useCompany();
  
  const account = currentCompany.bankAccounts?.find(acc => acc.id === accountId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Statement</CardTitle>
        <p className="text-sm text-muted-foreground">
          {account?.name} - {account?.accountNumber}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Account Type</label>
              <p className="font-medium">{account?.type}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Bank Name</label>
              <p className="font-medium">{account?.bankName}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Current Balance</label>
              <p className="text-2xl font-bold">${account?.balance.toFixed(2)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Total Transactions</label>
              <p className="text-2xl font-bold">{account?.transactions?.length || 0}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
