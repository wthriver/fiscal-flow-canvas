
import React from "react";
import { CreditCard, DollarSign, TrendingUp, Users } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import InvoiceStatus from "@/components/dashboard/InvoiceStatus";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import { useCompany } from "@/contexts/CompanyContext";

const Dashboard: React.FC = () => {
  const { currentCompany } = useCompany();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Financial overview for {currentCompany.name}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`$${currentCompany.revenue?.current?.toLocaleString() || 0}.00`}
          percentageChange={currentCompany.revenue?.percentChange || 0}
          description="vs. last month"
          icon={<DollarSign size={20} />}
        />
        <StatCard
          title="Outstanding Invoices"
          value={`$${currentCompany.outstandingInvoices?.amount?.toLocaleString() || 0}.00`}
          percentageChange={currentCompany.outstandingInvoices?.percentChange || 0}
          description="vs. last month"
          icon={<CreditCard size={20} />}
        />
        <StatCard
          title="Profit Margin"
          value={`${currentCompany.profitMargin?.value || 0}%`}
          percentageChange={currentCompany.profitMargin?.percentChange || 0}
          description="vs. last month"
          icon={<TrendingUp size={20} />}
        />
        <StatCard
          title="Active Customers"
          value={currentCompany.activeCustomers?.count?.toString() || "0"}
          percentageChange={currentCompany.activeCustomers?.percentChange || 0}
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
