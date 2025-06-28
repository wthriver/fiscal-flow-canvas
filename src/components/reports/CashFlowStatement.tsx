import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompany } from "@/contexts/CompanyContext";
import { safeNumberParse } from "@/utils/typeHelpers";

const CashFlowStatement: React.FC = () => {
  const { currentCompany } = useCompany();
  
  // Calculate cash flows
  const operatingCashFlow = currentCompany.transactions?.reduce((total, transaction) => {
    if (transaction.type === 'Credit') {
      return total + safeNumberParse(transaction.amount);
    }
    return total;
  }, 0) || 0;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cash Flow Statement</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Operating Cash Flow:</span>
            <span>${operatingCashFlow.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CashFlowStatement;
