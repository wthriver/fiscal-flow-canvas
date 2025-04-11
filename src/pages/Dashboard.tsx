
import React from "react";
import { CreditCard, DollarSign, TrendingUp, Users } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import InvoiceStatus from "@/components/dashboard/InvoiceStatus";
import RecentTransactions from "@/components/dashboard/RecentTransactions";

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to your financial overview.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value="$24,328.00"
          percentageChange={12.5}
          description="vs. last month"
          icon={<DollarSign size={20} />}
        />
        <StatCard
          title="Outstanding Invoices"
          value="$8,294.00"
          percentageChange={-2.3}
          description="vs. last month"
          icon={<CreditCard size={20} />}
        />
        <StatCard
          title="Profit Margin"
          value="32%"
          percentageChange={4.1}
          description="vs. last month"
          icon={<TrendingUp size={20} />}
        />
        <StatCard
          title="Active Customers"
          value="48"
          percentageChange={8.7}
          description="vs. last month"
          icon={<Users size={20} />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChart />
        <div className="flex flex-col gap-6">
          <InvoiceStatus />
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
