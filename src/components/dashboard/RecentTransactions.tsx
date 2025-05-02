
import React from "react";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useCompany } from "@/contexts/CompanyContext";

const RecentTransactions = () => {
  const { currentCompany } = useCompany();

  // Get the 5 most recent transactions
  const recentTransactions = [...currentCompany.transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Transactions</CardTitle>
        <CardDescription>
          {recentTransactions.length} most recent transactions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {recentTransactions.map((transaction) => {
          const isDeposit = transaction.type === "Deposit" || transaction.amount.startsWith("+");

          return (
            <div className="flex items-center" key={transaction.id}>
              <div
                className={cn(
                  "mr-4 rounded-full p-2",
                  isDeposit ? "bg-green-100" : "bg-red-100"
                )}
              >
                {isDeposit ? (
                  <ArrowUpIcon
                    className="h-4 w-4 text-green-500"
                    strokeWidth={3}
                  />
                ) : (
                  <ArrowDownIcon
                    className="h-4 w-4 text-red-500"
                    strokeWidth={3}
                  />
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {transaction.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {transaction.date} · {transaction.category}
                </p>
              </div>
              <div
                className={cn(
                  "ml-auto font-medium",
                  isDeposit ? "text-green-500" : "text-red-500"
                )}
              >
                {isDeposit
                  ? transaction.amount.replace("-", "+")
                  : transaction.amount}
              </div>
            </div>
          );
        })}
        
        {recentTransactions.length === 0 && (
          <div className="text-center text-muted-foreground">
            No recent transactions
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
