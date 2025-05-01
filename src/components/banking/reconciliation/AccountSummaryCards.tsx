
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileCheck } from "lucide-react";

interface BankAccountProps {
  title: string;
  lastReconciled: string;
  balance: string;
}

const BankAccount: React.FC<BankAccountProps> = ({ title, lastReconciled, balance }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>Last reconciled: {lastReconciled}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm">Account Balance</p>
          <p className="text-2xl font-bold">{balance}</p>
        </div>
        <Button variant="outline" className="flex items-center gap-1">
          <FileCheck className="h-4 w-4" />
          <span>View History</span>
        </Button>
      </div>
    </CardContent>
  </Card>
);

export const AccountSummaryCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <BankAccount 
        title="Business Checking" 
        lastReconciled="March 31, 2025"
        balance="$15,243.89"
      />
      
      <BankAccount 
        title="Business Savings" 
        lastReconciled="March 31, 2025"
        balance="$42,876.54"
      />
      
      <BankAccount 
        title="Operating Account" 
        lastReconciled="March 15, 2025"
        balance="$8,721.33"
      />
    </div>
  );
};
