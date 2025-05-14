
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface AccountSummaryCardsProps {
  beginningBalance: string;
  endingBalance: string;
  clearedBalance: string;
  difference: string;
}

export const AccountSummaryCards: React.FC<AccountSummaryCardsProps> = ({
  beginningBalance,
  endingBalance,
  clearedBalance,
  difference
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">Beginning Balance</span>
            <span className="text-xl font-bold">{beginningBalance}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">Ending Balance</span>
            <span className="text-xl font-bold">{endingBalance}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">Cleared Balance</span>
            <span className="text-xl font-bold">{clearedBalance}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">Difference</span>
            <span className={`text-xl font-bold ${difference === "$0.00" ? "text-green-600" : "text-red-600"}`}>
              {difference}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
