
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2, 
  AlertCircle, 
  Clock 
} from "lucide-react";
import { cn } from "@/lib/utils";

type TransactionType = "income" | "expense";
type TransactionStatus = "completed" | "pending" | "failed";

interface Transaction {
  id: string;
  type: TransactionType;
  name: string;
  date: string;
  amount: number;
  status: TransactionStatus;
}

const transactions: Transaction[] = [
  {
    id: "tr1",
    type: "income",
    name: "Client Payment - ABC Corp",
    date: "Apr 10, 2025",
    amount: 1200,
    status: "completed",
  },
  {
    id: "tr2",
    type: "expense",
    name: "Software Subscription",
    date: "Apr 8, 2025",
    amount: 49.99,
    status: "completed",
  },
  {
    id: "tr3",
    type: "income",
    name: "Client Payment - XYZ Ltd",
    date: "Apr 7, 2025",
    amount: 850,
    status: "pending",
  },
  {
    id: "tr4",
    type: "expense",
    name: "Office Supplies",
    date: "Apr 5, 2025",
    amount: 125.50,
    status: "completed",
  },
  {
    id: "tr5",
    type: "expense",
    name: "Electricity Bill",
    date: "Apr 3, 2025",
    amount: 85.75,
    status: "failed",
  },
];

const getStatusIcon = (status: TransactionStatus) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 size={16} className="text-finance-green-500" />;
    case "pending":
      return <Clock size={16} className="text-finance-blue-500" />;
    case "failed":
      return <AlertCircle size={16} className="text-finance-red-500" />;
  }
};

const RecentTransactions: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest financial activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    transaction.type === "income"
                      ? "bg-finance-green-100 text-finance-green-600"
                      : "bg-finance-red-100 text-finance-red-600"
                  )}
                >
                  {transaction.type === "income" ? (
                    <ArrowDownLeft size={16} />
                  ) : (
                    <ArrowUpRight size={16} />
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm">{transaction.name}</p>
                  <p className="text-xs text-muted-foreground">{transaction.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "font-semibold",
                    transaction.type === "income"
                      ? "text-finance-green-600"
                      : "text-finance-red-600"
                  )}
                >
                  {transaction.type === "income" ? "+" : "-"}${transaction.amount.toLocaleString()}
                </span>
                {getStatusIcon(transaction.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
