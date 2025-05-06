
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  CircleDollarSign,
  FileText,
  Home,
  Users,
  Wallet,
  CalendarCheck,
  Clock,
  Receipt,
  CirclePlus,
  Landmark,
  Settings,
  ReceiptText,
  Tag,
  BarChart4,
  ListCheck,
  FileBarChart,
  Building,
  List,
  Calendar,
  Package,
  Globe,
  Plug,
} from "lucide-react";

interface SidebarItemProps {
  to: string;
  icon: JSX.Element;
  label: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  to,
  icon,
  label,
  active = false,
}) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
        active ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" : ""
      )}
    >
      {icon}
      {label}
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="hidden border-r bg-card md:block h-screen w-64 overflow-y-auto">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <CircleDollarSign className="h-6 w-6" />
          <span className="text-xl">FiscalFlow</span>
        </Link>
      </div>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Dashboard
          </h2>
          <div className="space-y-1">
            <SidebarItem
              to="/"
              icon={<Home className="h-4 w-4" />}
              label="Home"
              active={pathname === "/"}
            />
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Customers & Sales
          </h2>
          <div className="space-y-1">
            <SidebarItem
              to="/customers"
              icon={<Users className="h-4 w-4" />}
              label="Customers"
              active={pathname === "/customers"}
            />
            <SidebarItem
              to="/invoices"
              icon={<FileText className="h-4 w-4" />}
              label="Invoices"
              active={pathname === "/invoices"}
            />
            <SidebarItem
              to="/sales"
              icon={<Tag className="h-4 w-4" />}
              label="Sales & Estimates"
              active={pathname === "/sales"}
            />
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Money Management
          </h2>
          <div className="space-y-1">
            <SidebarItem
              to="/banking"
              icon={<Wallet className="h-4 w-4" />}
              label="Banking"
              active={pathname === "/banking"}
            />
            <SidebarItem
              to="/accounting"
              icon={<Landmark className="h-4 w-4" />}
              label="Accounting"
              active={pathname === "/accounting"}
            />
            <SidebarItem
              to="/expenses"
              icon={<Receipt className="h-4 w-4" />}
              label="Expenses"
              active={pathname === "/expenses"}
            />
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Tracking & Planning
          </h2>
          <div className="space-y-1">
            <SidebarItem
              to="/projects"
              icon={<ListCheck className="h-4 w-4" />}
              label="Projects"
              active={pathname === "/projects"}
            />
            <SidebarItem
              to="/time-tracking"
              icon={<Clock className="h-4 w-4" />}
              label="Time Tracking"
              active={pathname === "/time-tracking"}
            />
            <SidebarItem
              to="/inventory"
              icon={<Package className="h-4 w-4" />}
              label="Inventory"
              active={pathname === "/inventory"}
            />
            <SidebarItem
              to="/payroll"
              icon={<CircleDollarSign className="h-4 w-4" />}
              label="Payroll"
              active={pathname === "/payroll"}
            />
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Reports & Taxes
          </h2>
          <div className="space-y-1">
            <SidebarItem
              to="/reports"
              icon={<FileBarChart className="h-4 w-4" />}
              label="Reports"
              active={pathname === "/reports"}
            />
            <SidebarItem
              to="/taxes"
              icon={<ReceiptText className="h-4 w-4" />}
              label="Taxes"
              active={pathname === "/taxes"}
            />
            <SidebarItem
              to="/budgeting"
              icon={<BarChart4 className="h-4 w-4" />}
              label="Budgeting"
              active={pathname === "/budgeting"}
            />
            <SidebarItem
              to="/journal"
              icon={<List className="h-4 w-4" />}
              label="Journal"
              active={pathname === "/journal"}
            />
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Advanced Features
          </h2>
          <div className="space-y-1">
            <SidebarItem
              to="/audit-trail"
              icon={<Calendar className="h-4 w-4" />}
              label="Audit Trail"
              active={pathname === "/audit-trail"}
            />
            <SidebarItem
              to="/multi-currency"
              icon={<Globe className="h-4 w-4" />}
              label="Multi Currency"
              active={pathname === "/multi-currency"}
            />
            <SidebarItem
              to="/integrations"
              icon={<Plug className="h-4 w-4" />}
              label="Integrations"
              active={pathname === "/integrations"}
            />
          </div>
        </div>
        <div className="px-3 py-2">
          <div className="space-y-1">
            <SidebarItem
              to="/settings"
              icon={<Settings className="h-4 w-4" />}
              label="Settings"
              active={pathname === "/settings"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
