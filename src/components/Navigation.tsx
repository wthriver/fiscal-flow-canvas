
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { 
  Home, 
  FileText, 
  Users, 
  Package, 
  Briefcase, 
  LineChart,
  Calculator, 
  Clock, 
  Settings,
  DollarSign,
  Receipt
} from "lucide-react";

const Navigation = () => {
  const navItems = [
    { name: "Dashboard", icon: <Home size={16} />, href: "/" },
    { name: "Invoices", icon: <FileText size={16} />, href: "/invoices" },
    { name: "Customers", icon: <Users size={16} />, href: "/customers" },
    { name: "Inventory", icon: <Package size={16} />, href: "/inventory" },
    { name: "Projects", icon: <Briefcase size={16} />, href: "/projects" },
    { name: "Reports", icon: <LineChart size={16} />, href: "/reports" },
    { name: "Accounting", icon: <Calculator size={16} />, href: "/accounting" },
    { name: "Banking", icon: <DollarSign size={16} />, href: "/banking" },
    { name: "Time Tracking", icon: <Clock size={16} />, href: "/time-tracking" },
    { name: "Receipts", icon: <Receipt size={16} />, href: "/receipts" },
    { name: "Settings", icon: <Settings size={16} />, href: "/settings" }
  ];

  return (
    <nav className="flex flex-col gap-1 p-4 bg-muted/40">
      {navItems.map(item => (
        <Link to={item.href} key={item.name}>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2"
          >
            {item.icon}
            {item.name}
          </Button>
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
