
import { format } from 'date-fns';
import { Transaction } from '@/types/company';

export const formatCurrency = (amount: number | string): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num);
};

export const formatDate = (date: string): string => {
  return format(new Date(date), 'MMM dd, yyyy');
};

export const calculateTransactionTotal = (transactions: Transaction[]): number => {
  return transactions.reduce((total, transaction) => {
    const amount = typeof transaction.amount === 'string' 
      ? parseFloat(transaction.amount.replace(/[^0-9.-]+/g, ''))
      : transaction.amount;
    return total + amount;
  }, 0);
};

export const groupTransactionsByCategory = (transactions: Transaction[]) => {
  return transactions.reduce((groups, transaction) => {
    const category = transaction.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);
};

export const filterTransactionsByDateRange = (
  transactions: Transaction[], 
  startDate: string, 
  endDate: string
): Transaction[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= start && transactionDate <= end;
  });
};
