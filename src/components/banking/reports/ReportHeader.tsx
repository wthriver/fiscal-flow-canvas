
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompany } from "@/contexts/CompanyContext";

interface ReportHeaderProps {
  accountId: string;
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({ accountId }) => {
  const { currentCompany } = useCompany();
  
  const account = currentCompany.bankAccounts?.find(acc => acc.id === accountId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Banking Reports</CardTitle>
        <p className="text-sm text-muted-foreground">
          {account ? `${account.name} - ${account.accountNumber}` : 'All Accounts'}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Current Balance</label>
            <p className="text-2xl font-bold">${account?.balance.toFixed(2) || '0.00'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Account Type</label>
            <p className="font-medium">{account?.type || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Bank</label>
            <p className="font-medium">{account?.bankName || 'N/A'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
