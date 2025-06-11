import React from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  User,
  FileText,
  ShoppingCart,
  Calendar,
  Coins,
  Landmark,
  Clock,
  Package2,
  Activity,
  Settings,
  CreditCard,
  BarChart3,
  FileText as Receipt,
  Calculator,
  Users,
  TrendingUp,
  Target,
  Package,
  Briefcase,
} from "lucide-react";
import { useLocation } from "react-router-dom";

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <RouterLink
          ref={ref as any}
          className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${className}`}
          to={props.href || "#"}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </RouterLink>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const Navigation = () => {
  const location = useLocation();
  
  const menuItems = [
    { name: "Dashboard", icon: BarChart3, path: "/" },
    { name: "Invoices", icon: FileText, path: "/invoices" },
    { name: "Expenses", icon: Receipt, path: "/expenses" },
    { name: "Banking", icon: CreditCard, path: "/banking" },
    { name: "Accounting", icon: Calculator, path: "/accounting" },
    { name: "Advanced Accounting", icon: Calculator, path: "/advanced-accounting" },
    { name: "Payroll", icon: Users, path: "/payroll" },
    { name: "Advanced Payroll", icon: Users, path: "/advanced-payroll" },
    { name: "Reports", icon: TrendingUp, path: "/reports" },
    { name: "Advanced Reporting", icon: TrendingUp, path: "/advanced-reporting" },
    { name: "Budgeting", icon: Target, path: "/budgeting" },
    { name: "Customers", icon: User, path: "/customers" },
    { name: "Inventory", icon: Package, path: "/inventory" },
    { name: "Projects", icon: Briefcase, path: "/projects" },
    { name: "Settings", icon: Settings, path: "/settings" }
  ];

  return (
    <div className="border-b">
      <div className="container flex items-center justify-between py-4">
        <RouterLink to="/" className="font-bold text-2xl">
          Acme Corp
        </RouterLink>
        <NavigationMenu>
          <NavigationMenuList>
            {menuItems.map((route) => (
              <NavigationMenuItem key={route.path}>
                <RouterLink to={route.path} className={navigationMenuTriggerStyle()}>
                  {route.name}
                </RouterLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:w-64">
            <div className="p-4">
              <RouterLink to="/" className="font-bold text-2xl block mb-4">
                Acme Corp
              </RouterLink>
              {menuItems.map((route) => (
                <RouterLink
                  key={route.path}
                  to={route.path}
                  className="flex items-center space-x-2 py-2 text-sm font-medium hover:underline"
                >
                  <route.icon className="h-4 w-4" />
                  <span>{route.name}</span>
                </RouterLink>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Navigation;
