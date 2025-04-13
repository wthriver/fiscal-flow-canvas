
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
import { useCompany } from "@/contexts/CompanyContext";

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
  const { currentCompany } = useCompany();
  
  // Generate transactions based on company invoices and expenses
  const generateTransactions = (): Transaction[] => {
    const transactions: Transaction[] = [];
    
    // Add transactions from invoices
    currentCompany.invoices.forEach(invoice => {
      transactions.push({
        id: `tr-${invoice.id}`,
        type: "income",
        name: `Client Payment - ${invoice.customer}`,
        date: new Date(invoice.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        amount: parseFloat(invoice.amount.replace(/[$,]/g, '')),
        status: invoice.status === "Paid" ? "completed" : 
                invoice.status === "Pending" || invoice.status === "Outstanding" ? "pending" : "failed"
      });
    });
    
    // Add transactions from expenses
    currentCompany.expenses.forEach(expense => {
      transactions.push({
        id: `te-${expense.id}`,
        type: "expense",
        name: `${expense.category} - ${expense.vendor}`,
        date: new Date(expense.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        amount: parseFloat(expense.amount.replace(/[$,]/g, '')),
        status: expense.status === "Paid" ? "completed" : 
                expense.status === "Pending" ? "pending" : "failed"
      });
    });
    
    // Sort by date (most recent first) and limit to 5
    return transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  };

  const transactions = generateTransactions();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>{currentCompany.name}'s latest financial activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
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
                    {transaction.type === "income" ? "+" : "-"}${transaction.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </span>
                  {getStatusIcon(transaction.status)}
                </div>
              </div>
            ))
          ) : (
            <div className="py-4 text-center text-muted-foreground">No recent transactions</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
