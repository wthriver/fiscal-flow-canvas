
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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
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
      <span className="font-medium">{label}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 hidden md:flex flex-col bg-sidebar border-r border-sidebar-border">
      <div className="p-4 border-b border-sidebar-border flex items-center gap-2">
        <DollarSign size={24} className="text-sidebar-primary" />
        <span className="font-bold text-xl text-sidebar-foreground">FinancePro</span>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
        <NavItem to="/invoices" icon={<Receipt size={20} />} label="Invoices" />
        <NavItem to="/expenses" icon={<CreditCard size={20} />} label="Expenses" />
        <NavItem to="/banking" icon={<BookOpen size={20} />} label="Banking" />
        <NavItem to="/reports" icon={<BarChart3 size={20} />} label="Reports" />
        <NavItem to="/journal" icon={<FileText size={20} />} label="Journal" />
        <NavItem to="/inventory" icon={<Package size={20} />} label="Inventory" />
        <NavItem to="/customers" icon={<Users size={20} />} label="Customers" />
        <NavItem to="/sales" icon={<ShoppingCart size={20} />} label="Sales" />
        <NavItem to="/projects" icon={<Clock size={20} />} label="Projects" />
        <NavItem to="/taxes" icon={<Calculator size={20} />} label="Taxes" />
      </nav>
      <div className="p-4 border-t border-sidebar-border">
        <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" />
      </div>
    </aside>
  );
};

export default Sidebar;
