
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  CreditCard,
  BarChart3,
  BookOpen,
  ShoppingCart,
  FileText,
  Users,
  Settings,
  Package,
  Clock,
  Calculator,
  DollarSign,
  Building,
  Banknote,
  Landmark,
  HardDrive,
  Globe,
  Wallet,
  Timer,
  FileCheck,
  FileSearch,
  Camera,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: string;
}

interface NavSectionProps {
  title: string;
  items: NavItemProps[];
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, badge }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md group transition-colors",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
      )}
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium flex-grow">{label}</span>
      {badge && (
        <span className="rounded-full bg-primary/20 text-primary text-xs px-2 py-0.5">
          {badge}
        </span>
      )}
    </Link>
  );
};

const NavSection: React.FC<NavSectionProps> = ({ title, items }) => {
  return (
    <div className="mb-4">
      <h3 className="text-xs uppercase tracking-wider text-muted-foreground mx-3 mb-1">
        {title}
      </h3>
      <div className="space-y-1">
        {items.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            badge={item.badge}
          />
        ))}
      </div>
    </div>
  );
};

const Sidebar: React.FC = () => {
  const mainItems: NavItemProps[] = [
    { to: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/invoices", icon: <Receipt size={20} />, label: "Invoices" },
    { to: "/expenses", icon: <CreditCard size={20} />, label: "Expenses" },
    { to: "/banking", icon: <Landmark size={20} />, label: "Banking" },
    { to: "/reports", icon: <BarChart3 size={20} />, label: "Reports" },
    { to: "/journal", icon: <FileText size={20} />, label: "Journal" },
  ];
  
  const businessItems: NavItemProps[] = [
    { to: "/inventory", icon: <Package size={20} />, label: "Inventory" },
    { to: "/customers", icon: <Users size={20} />, label: "Customers" },
    { to: "/sales", icon: <ShoppingCart size={20} />, label: "Sales" },
    { to: "/projects", icon: <Clock size={20} />, label: "Projects" },
    { to: "/taxes", icon: <Calculator size={20} />, label: "Taxes" },
  ];
  
  const advancedItems: NavItemProps[] = [
    { to: "/payroll", icon: <Banknote size={20} />, label: "Payroll", badge: "New" },
    { to: "/time-tracking", icon: <Timer size={20} />, label: "Time Tracking", badge: "New" },
    { to: "/budgeting", icon: <Wallet size={20} />, label: "Budgeting", badge: "New" },
    { to: "/multi-currency", icon: <Globe size={20} />, label: "Multi-Currency", badge: "New" },
    { to: "/audit-trail", icon: <FileSearch size={20} />, label: "Audit Trail", badge: "New" },
    { to: "/receipts", icon: <Camera size={20} />, label: "Digital Receipts", badge: "New" },
    { to: "/integrations", icon: <HardDrive size={20} />, label: "Integrations", badge: "New" },
  ];

  return (
    <aside className="w-64 hidden md:flex flex-col bg-sidebar border-r border-sidebar-border">
      <div className="p-4 border-b border-sidebar-border flex items-center gap-2">
        <DollarSign size={24} className="text-sidebar-primary" />
        <span className="font-bold text-xl text-sidebar-foreground">FinancePro</span>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <NavSection title="Main" items={mainItems} />
        <NavSection title="Business" items={businessItems} />
        <NavSection title="Advanced" items={advancedItems} />
      </nav>
      <div className="p-4 border-t border-sidebar-border">
        <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" />
      </div>
    </aside>
  );
};

export default Sidebar;
