
import { Transaction } from "@/contexts/CompanyContext";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export function prepareTransactionData(
  transactions: Transaction[], 
  accountName: string, 
  dateRange: DateRange
) {
  // Filter transactions for the specific account
  const accountTransactions = transactions.filter(
    (transaction) => {
      if (accountName === "All Accounts") return true;
      return transaction.account === accountName || transaction.bankAccount === accountName;
    }
  );

  // Filter transactions by date range if it's set
  const filteredTransactions = accountTransactions.filter((transaction) => {
    if (!dateRange.from && !dateRange.to) return true;
    
    const transactionDate = new Date(transaction.date);
    
    if (dateRange.from && !dateRange.to) {
      return transactionDate >= dateRange.from;
    }
    
    if (!dateRange.from && dateRange.to) {
      return transactionDate <= dateRange.to;
    }
    
    if (dateRange.from && dateRange.to) {
      return transactionDate >= dateRange.from && transactionDate <= dateRange.to;
    }
    
    return true;
  });

  // Calculate income and expenses data for chart
  const incomeExpenseData = filteredTransactions.reduce((acc: any[], transaction) => {
    const date = transaction.date.substring(0, 7); // Get YYYY-MM format
    const amount = parseFloat(transaction.amount.replace(/[^0-9.-]+/g, ""));
    const isIncome = transaction.amount.startsWith("+") || transaction.type === "Credit";
    
    const existingEntry = acc.find((entry) => entry.month === date);
    
    if (existingEntry) {
      if (isIncome) {
        existingEntry.income += amount;
      } else {
        existingEntry.expenses += amount;
      }
      existingEntry.balance = existingEntry.income - existingEntry.expenses;
    } else {
      acc.push({
        month: date,
        income: isIncome ? amount : 0,
        expenses: isIncome ? 0 : amount,
        balance: isIncome ? amount : -amount,
      });
    }
    
    return acc;
  }, []).sort((a, b) => a.month.localeCompare(b.month));

  // Create reconciliation status data
  const reconciliationData = {
    reconciled: filteredTransactions.filter(t => t.reconciled).length,
    unreconciled: filteredTransactions.filter(t => !t.reconciled).length
  };

  // Calculate account balance over time
  const balanceHistory = filteredTransactions
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc: any[], transaction) => {
      const date = transaction.date;
      const amount = parseFloat(transaction.amount.replace(/[^0-9.-]+/g, ""));
      const isIncome = transaction.amount.startsWith("+") || transaction.type === "Credit";
      
      const lastBalance = acc.length > 0 ? acc[acc.length - 1].balance : 0;
      const newBalance = isIncome ? lastBalance + amount : lastBalance - amount;
      
      acc.push({
        date,
        amount: isIncome ? amount : -amount,
        balance: newBalance,
      });
      
      return acc;
    }, []);

  return {
    filteredTransactions,
    incomeExpenseData,
    reconciliationData,
    balanceHistory
  };
}
